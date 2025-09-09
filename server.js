const express = require("express");
const { engine } = require("express-handlebars");
const fs = require("fs");

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const DATA_FILE = "guestbook.json";

let guestbookEntries = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    guestbookEntries = JSON.parse(data);
    if (!Array.isArray(guestbookEntries)) {
      guestbookEntries = [];
    }
    // Normalize historical entries to include id/timestamp/likes
    guestbookEntries = guestbookEntries.map((entry) => {
      const timestamp = typeof entry.timestamp === "number" ? entry.timestamp : Date.now();
      const id = entry.id || `${timestamp}-${Math.random().toString(36).slice(2, 8)}`;
      const likes = typeof entry.likes === "number" ? entry.likes : 0;
      return { id, name: entry.name, text: entry.text, timestamp, likes };
    });
  } catch (err) {
    console.error("Error reading guestbook.json:", err);
    guestbookEntries = [];
  }
}

function saveEntries() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(guestbookEntries, null, 2));
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((part) => {
    const [k, v] = part.split('=');
    if (k && v) cookies[k.trim()] = decodeURIComponent(v.trim());
  });
  return cookies;
}

function getOrSetClientId(req, res) {
  const cookies = parseCookies(req.headers.cookie || '');
  let clientId = cookies.clientId;
  if (!clientId) {
    clientId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    res.setHeader('Set-Cookie', `clientId=${encodeURIComponent(clientId)}; Path=/; HttpOnly; SameSite=Lax`);
  }
  return clientId;
}

function formatTimeAgo(ms) {
  const diff = Date.now() - ms;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

function getFilteredEntries(query) {
  const q = (query || "").trim().toLowerCase();
  const base = [...guestbookEntries].sort((a, b) => b.timestamp - a.timestamp);
  const filtered = q
    ? base.filter((e) =>
      (e.name || "").toLowerCase().includes(q) || (e.text || "").toLowerCase().includes(q)
    )
    : base;
  return filtered.map((e) => ({ ...e, timeAgo: formatTimeAgo(e.timestamp) }));
}

function renderGuestbook(req, res) {
  const clientId = getOrSetClientId(req, res);
  const q = typeof req.query?.q === "string" ? req.query.q : "";
  const mineOnly = req.query?.mine === '1';
  let entries = getFilteredEntries(q);
  if (mineOnly) {
    entries = entries.filter((e) => e.owner === clientId);
  }
  entries = entries.map((e) => ({ ...e, canDelete: e.owner === clientId }));
  res.render("guestbook", {
    title: "Guestbook",
    q,
    mineOnly,
    clientId,
    entries,
  });
}
app.use("/guestbook", renderGuestbook);

function renderHome(req, res) {
  const clientId = getOrSetClientId(req, res);
  res.render("home", {
    title: "Home",
    totalEntries: guestbookEntries.length,
    clientId,
  });
}
app.get("/", renderHome);

// Redirect to repo
app.get("/source", (req, res) => {
  res.redirect("https://github.com/monster0506/express-guestbook/");
});

function receiveEntry(req, res) {
  const text = req.body.entryText?.trim();
  const name = req.body.nameText?.trim() || "Anonymous";
  const owner = getOrSetClientId(req, res);
  // Banned programming language names (excluding C++)
  const banned = [
    "javascript", "typescript", "python", "java", "csharp",
    "go", "golang", "rust", "ruby", "php", "swift", "kotlin", "scala",
    "haskell", "elixir", "erlang", "perl", "r", "matlab", "dart",
    "objective-c", "objective c", "visual basic", "vb", "shell", "bash",
    "powershell", "lua", "clojure", "f#", "fsharp", "fortran", "cobol",
    "groovy", "julia", "solidity", "assembly", "asm", "pascal", "delphi",
    "prolog", "lisp", "scheme", "ocaml", "reasonml", "nim", "crystal",
    "smalltalk", "ada", "abap", "apex", "sas", "stata", "verilog", "vhdl",
    "tcl", "awk", "scratch", "sql"
  ];
  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  let cleanText = text || "";
  for (const w of banned) {
    const re = new RegExp(`\\b${escapeRegExp(w)}\\b`, "gi");
    cleanText = cleanText.replace(re, "***");
  }
  const timestamp = Date.now();
  const id = `${timestamp}-${Math.random().toString(36).slice(2, 8)}`;
  const data = { id, name, text: cleanText, timestamp, likes: 0, owner };
  if (cleanText) {
    guestbookEntries.push(data);
    saveEntries();
  }
  res.redirect("/guestbook");
}
app.post("/addEntry", receiveEntry);

// Like an entry
app.post("/like/:id", (req, res) => {
  const { id } = req.params;
  const idx = guestbookEntries.findIndex((e) => e.id === id);
  if (idx !== -1) {
    guestbookEntries[idx].likes = (guestbookEntries[idx].likes || 0) + 1;
    saveEntries();
  }
  const redirectTo = req.headers.referer?.includes("/guestbook") ? req.headers.referer : "/guestbook";
  res.redirect(redirectTo);
});

// Unlike an entry (toggle off)
app.post("/unlike/:id", (req, res) => {
  const { id } = req.params;
  const idx = guestbookEntries.findIndex((e) => e.id === id);
  if (idx !== -1) {
    const current = guestbookEntries[idx].likes || 0;
    guestbookEntries[idx].likes = current > 0 ? current - 1 : 0;
    saveEntries();
  }
  const redirectTo = req.headers.referer?.includes("/guestbook") ? req.headers.referer : "/guestbook";
  res.redirect(redirectTo);
});

// Delete an entry
app.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  const clientId = getOrSetClientId(req, res);
  const before = guestbookEntries.length;
  guestbookEntries = guestbookEntries.filter((e) => !(e.id === id && e.owner === clientId));
  if (guestbookEntries.length !== before) {
    saveEntries();
  }
  const redirectTo = req.headers.referer?.includes("/guestbook") ? req.headers.referer : "/guestbook";
  res.redirect(redirectTo);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
