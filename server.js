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
  } catch (err) {
    console.error("Error reading guestbook.json:", err);
    guestbookEntries = [];
  }
}

function saveEntries() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(guestbookEntries, null, 2));
}

function renderGuestbook(req, res) {
  res.render("guestbook", {
    title: "Guestbook",
    entries: guestbookEntries,
  });
}
app.use("/guestbook", renderGuestbook);

function receiveEntry(req, res) {
  const text = req.body.entryText?.trim();
  const name = req.body.nameText?.trim();
  const data = {name, text}
  if (text) {
    guestbookEntries.push(data);
    saveEntries();
  }
  res.redirect("/guestbook");
}
app.post("/addEntry", receiveEntry);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
