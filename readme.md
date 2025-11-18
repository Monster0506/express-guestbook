# How To Create a Web Server with Node.js and Express

## What a Web Server Is

(this is all in the powerpoint)

at some point, web pages were just simple text documents, but now they're basically mini-programs that get downloaded, installed, and run on your computer as soon as you visit them. however, unlike normal programs, they don't have a natural way to save data, since they're trapped inside your browser. so, sure, one thing you could is write code that asks the browser to store some data for you for next time, but

a) the browser might not feel like it, especially if the user has privacy settings turned on and clears their history and stuff, and 
b) you, the creator of the website, never get to chance to see the data and analyze it and sell it to the north korean state. and 
c), the data won't be there if the user visits the website with a different browser, like the one on their phone. this is why the programs that create web pages kind of need to be split in two: we need to run half of the program in the user's browser, to respond to what they're doing, and half of it on some computer that stores data and lets you retrieve it from anywhere. that computer is called a web server.

a more formal definition of a server is that it's a computer that provides resources to a network. every time you view any kind of website, a web server is sending you the html, javascript, images, and et cetera that constitute the page you're looking at, in addition to storing all the data that it has on you. any network device can play the role of a server: a phone can, a desktop computer can, a raspberry pi can; you usually want a server to be a big powerful computer with a good internet connection sitting in a cool basement somewhere, but sometimes you don't have that, and so you're forced to jailbreak and reverse engineer your smart toaster.

disclaimer: the term "server" can refer to either a whole computer or a specific program that is fulfilling the role of providing resources on a network. so that may sometimes be confusing, sorry. but hopefully it will be possible to use context to figure out what kind of thing i'm talking about.

and, by the way, there is no agreement on the best way to run a server. when you're creating the content that the users see, which is called frontend web development, there really aren't that many options: you have to produce html, css, and javascript, and the main ways to do that are to write programs with react, vue, or angular; frontend web designers do not use too many brain cells pinning down their basic tools. but if you're creating a server, which means you're doing what's called backend engineering, you can do anything. you can write your code in any language, using any or multiple of a million frameworks and libraries people have created for you, you can read and write to files, you can integrate with databases, you can run other unrelated programs from inside your program, anything. we're staring into the abyss, here. (We're not trapped in the browser anymore, but we are caught in the prison of decision making.)

however: since you have to write frontend (user-facing) stuff in javascript, many people have recently started to write their backend server stuff in javascript as well, to avoid having to learn more than one language. they can do this because a program called node.js will run javascript code for you, outside of its original habitat (the browser.) node could theoretically run any kind of program, but it's mostly used for web servers. there's a very popular library for it called "express" that provides convenience functions that make common web server tasks very easy to accomplish. and this introduction is finally over; we can now try creating our own node.js with express server.

## Express Basics: Requests and Responses

In order to run our website we are going to use VS code as our IDE and PowerShell as our terminal. If you are using a different IDE or terminal your commands might be slightly different so I recommend using  VS code and PowerShell.
##### Installing the Boiler Plate
The first thing you will need to install is our lesson boiler plate from our repository. To do this you will have to clone our repository. In your terminal type
```shell
git clone https://github.com/hacksu/express-guestbook
```
If you don't have git you can also just go to our repository here : [link](https://github.com/hacksu/express-guestbook)
Make sure you are in this folder before running any of the next commands.

##### Installing NPM
First run 
```
npm -v
```

If it says `npm : The term 'npm' is not recognized as the name of a cmdlet, function, script file, or operable program.`
Then you know you don't have NPM installed.
To install NPM go to https://nodejs.org/en. Click on **Get Node.js** and then download the installer by pressing. `Windows Installer (.msi)`

Then if you run `npm -v` again it should display a number like `11.5.1`. 
If it doesn't, close and re-open your VS code as your PATH variables may not have linked properly.
If that still doesn't work then restart your computer. 
If THAT still doesn't work then raise your hand and one of our organizers can help you

##### Installing Express.js 
Next up is installing Express.js. Now that you have `npm` you just type 
```
npm install express
```
and it should just install. Then type `npm list express`.
If it returns the word `empty` then it isn't installed. `└── (empty)`
If it returns the word `express` then it is installed `└── (express@5.1.0)`

It should also install a `node_modules` folder, a `package-lock.json` file, and a `package.json` file.

##### Installing Handlebars and jsonfile
Also, you can use `npm i` to install anything as is shorthand for `npm install` 
To install handlebars type 
```
npm i express-handlebars
```

##### File Structure:
Finally make sure your file structure looks like this: (show file structure)
You want to make sure your `views` folder, `guestbook.json`, and `package.json` are in the same folder as your `node_modules` folder.
Alright! Now setup is complete lets start using our express.js server!

##### Start
currently, as advertised, this program does nothing. let's go to server.js and change that.

```js
const express = require("express");
const app = express();

// put code that does actual stuff here

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// note: do not put any code here; code placed after app.listen() will not be
// run, since app.listen() never actually finishes or returns
```

so this is what we've got to work with. this is like the empty husk of a server program that uses express. we import a function called express, and call it to create a new variable called `app`, which will store an object; If you’re new, think of an object like a box that holds both information and things it can do. To use them, you call the box by its name, then a dot, then the specific piece of information or action you want; and we call a function from `app` called `listen` and give it the argument `3000`. the `listen` function is how you start an express server; the 3000 will be used as the port number, which is basically the address our program will have within whatever computer is running it. for no reason, 3000 is a common port to use while developing a web site, and so VS code is going to try to send messages to it. so that's boring.

what's interesting is how we're going to solve the problem of our web server doing nothing. when you type a url into your browser, your browser sends a request that a server application then needs to respond to. we can make ours do that by writing a simple function. it will take two arguments: one object containing the data for our incoming request, and another object that provides the functions that we need to use to respond. then, pass our new function to express.

`- - - on top of the middle comment`
```js
// code that does actual stuff:
function sayHi(request, response) {
    console.log(request.originalUrl)
    response.send("hello world!");
}

app.use(sayHi);
```

so, this is our "hello, world" example. console.log will log the path of the incoming request, which is just the portion of the url that we can vary without going to a completely different website, i.e. it's the part after "localhost:3000". 
To start up the website you can type `npm start` into the VS Code terminal. Then you can click on the link next to "Server running on (link)" . This will allow you to see your website that you are running. After that we can mess around with the address and it will appear in our terminal. 
For any request that comes into our server, this function will be run; if we put 
```
/dogs/should/have/the/right/to/vote
```
as the path in our url, the function will run and that path will be logged and the same response will be used.

if you wanted, you could develop a whole website inside this function. this is all you need. you could just put if statements in here, like, if the path is equal to this, then respond with this html, or if it's equal to this, respond with this image file; you could split the string up and use segments of it in if statements; you could interpret the path as a math problem, because it could be something like `/2+2`, and you could then respond with the answer; you could do anything. there are a million different ways to write a web server because once you have the networking code that express uses to get us to this point, you have complete freedom.

however, for some reason, most people write multiple functions when they're programming. the express library has built-in mechanisms you can use to specify and restrict what a given function should be used for. replace the `app.use()` line above with this:

```js
app.use("/hello", sayHi);
```

Then make sure you restart your server. Every time after editing our `server.js` file we have to restart our server. To do this type `Ctrl+C` into the terminal to stop the program and then type in `npm start` again and press enter. Then if you kept the website open make sure you reload that too.

After editing `app.use()` response function will only be called when we visit /hello. which seems sensible.

## Express Features: Serving Files & Templates

the most common thing web servers have to do is serve files, and i have provided some files that it can potentially serve in the "public" folder here in our project. let's tell express that we want it to respond with those files when a browser visits it:

`- - - put this under the "sayHi" code (but before app.listen())`
```js
const fileProvider = express.static("public");  // the folder name
app.use(fileProvider);
```

now, based on the url that we enter, the server will try to respond with a file in the "pubic" folder. `express.static()` is a convenience function that express provides, we could write our own code to open files, read them, and then send what we read, but this is much easier. if the path of the url that we go to is just "/", file servers will generally look for a file called index.html to serve; 

If we just run this now you will just see our index.html. we can also specifically get `/index.html` which puts us where we already are, or `/confetto.png` and the file provider will respond with those. as you can see, the contents of index.html match what you see what you go to the empty path or /index.html in the little browser on the right here.

so, serving files is useful, but if you just want to do that, you can use github pages or kent state's website folder thing or something else that's free and easy. we're more interested in difficult and expensive. to that end, let's start generating user pages dynamically.

the simplest way to create new web pages on a server is to use templates. i have installed a templating engine called "handlebars" in this project; "handlebars" will piece together files and values from our code to create pages, which lets us make our pages change over time as we re-visit them. there are a billion different templating engines out there; this is one of them. it expects template files to be placed in a folder called "views". go there, and you'll see the template i've added with the filename guestbook.handlebars.

[Example of a guestbook](https://web.archive.org/web/20010522120904fw_/http://www.geocities.com/SiliconValley/Port/2653/geobook.html)

the simplest feature of handlebars templates is that they separate actual html content from boring html boilerplate. if you look at our index.html page, there's a bunch of default generic html that wraps our actual content; every html page kind of needs to have this stuff and it's annoying. however, looking at guestbook.handlebars, we just have the html that defines our actual content. we can do that because the boring html we need is stored in layouts/main.handlebars, and our other templates outside of the layouts folder will use that as their container. in the layout file, we have the word "body", surrounded by three sets of curly braces; whenever you see two or three sets of curly braces in a handlebars template, you know that that content is going to be replaced with something else when it's used. this means that if we create a million templates for a million different web pages, we'll still only need this boilerplate stuff to be in this layout file, whereas if we created a billion normal html files, we would need to put this boilerplate every time.

to use our template, we need a few extra lines of code in our server.js file. the people who wrote express and the people who created handlebars decided that this is how you add a templating option to their response objects. i'm going to put these into the discord because they're boring and everyone copy-pastes them from somewhere anyway.

Also, before doing this, delete the `function sayHi()` and the `app.use("/hello", sayHi);` stuff

`- - - place directly under const app = express();`
```js
const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
```

and now, let's add a function that renders our guestbook template. turning a template into a complete html page is called rendering it.

`- - - place directly under app.use(fileProvider)`
```js
function renderGuestbook(request, response) {
    response.render("guestbook");
}
app.use("/guestbook", renderGuestbook);
```

and now, if we go to `/guestbook`, we'll see the beginning of our guestbook page. so that's exciting.

## Sending and Receiving HTML Form Data

any good guestbook will offer an option for users to add an entry to it. we're going to do that by putting an html form in the guestbook template. first, a form tag:

`- - - in guestbook.handlebars : add under <\p>`
```html
<form method="post" action="/addEntry">

</form>
```

the job of a web server is to respond to web requests, and there are 7ish types of web request used today. all of the requests we've been responding to so far are "get" requests, which is the kind that a browser sends to a server when you click a link or do a search or type a url somewhere and press "enter." however, forms usually use "post" requests, which are intended to send data to the server. so that's why that "method" attribute is there. then, the "action" attribute, which is kind of misnamed, specifies the url that our form data post request will be sent to. now we need to add a way for the user to fill that form data in.


```html
<form method="post" action="/addEntry">
    <input
      type="text"
      placeholder="Write your name..."
      name="nameText"
      required
    />
    <input
      type="text"
      placeholder="Write a message..."
      name="entryText"
      required
    />
  </form>
```

an html input element with the attribute `type="text"` lets you create a small text box. the `placeholder` thing will be displayed in the textbox before the user types stuff, and the value of the `name` attribute will be used to label the data that gets sent. all we need now is a way to actually make the request:

```html
<form method="post" action="/addEntry">
    <input
      type="text"
      placeholder="Write your name..."
      name="nameText"
      required
    />
    <input
      type="text"
      placeholder="Write a message..."
      name="entryText"
      required
    />
    <button>Add Guestbook Entry</button>
  </form>
```

and obviously you do that with a button. so! now we have a complete small form that does not work.

the only reason that it doesn't work is that we need code on our server that will receive the post request. first, we need to tell express to start decoding form data that's in the default format for forms; this format is called "url encoded." again, putting this in the discord.

`- - - directly below app.use(fileProvider);`
```js
app.use(express.urlencoded({ extended: true }));
```

then, let's create a variable in our code called guestbookEntries:

`- - - directly below app.use(express.urlencoded...`
```js
let guestbookEntries = [];
```

then, we'll write a function that adds to it (and logs the result so that we can see that it works). you add stuff to a javascript array by calling the "push" member function.

`- - - below function app.use("/guestbook",...`
```js
function receiveEntry(request, response) {
    guestbookEntries.push(request.body.entryText);
    console.log(guestbookEntries);
}
```

the value that will be stored in `request.body.entryText` comes directly from the input with the name `entryText` from our html. (if we had a text input with the name attribute something else, like `senderName`, we would be able to access that under `request.body.senderName`.) we also do need to send a response that the browser will display after sending the form. one thing we can do is just tell the browser to display the same page it was previously displaying, like this:

```js
function receiveEntry(request, response) {
    const text = request.body.entryText?.trim();
    const name = request.body.nameText?.trim();
    const data = {name, text}
    if (text) {
        guestbookEntries.push(data);
    }
    response.redirect("/guestbook");
}
```

and finally, like we did above with "/hello", we need to specify that this function should be run when the server receives requests with a certain path. this time, we'll also specify that we want to only respond to post requests (by calling `.post()` instead of `.use()`):

`- - - outside & below the recieveEntry function`
```js
app.post("/addEntry", receiveEntry);
```

so, now you should be able to use the logs that we're storing a new entry in our `guestbookEntries` array every time we submit one through the form.

## Using Variables in Templates

Now we can test it by running `npm start` and opening `http://localhost:3000/guestbook` [link](http://localhost:3000/guestbook)

The obvious problem is... we aren't actually displaying any of the data in `guestbookEntries`.

now, obviously, we want to actually display the guestbook entries to the user in a normal way. one way we can do this is by putting them in the second section of our `guestbook.handlebars` file. This will allow us to check if any entries have been made so far.

`- - - In the botton 'section' of the guestbook.handlebars file`
```hbs
<section>
  <h3>Entries</h3>

  {{#if entries}}
    {{entries.0.name}}
    {{entries.0.text}}
    {{entries.1.name}}
    {{entries.1.text}}
    {{entries.2.name}}
    {{entries.2.text}}
  {{else}}
    <p>No entries yet. Be the first to sign the guestbook!</p>
  {{/if}}
</section>
```

using double curly braces tells handlebars that we want to check for a value from our code; so we just need to supply a thing and give it the name `entries`. to do this, we just need to change the rendering code in `renderGuestbook`. (you might need to move the declaration of the variable `entries` so that it comes before the definition of `renderGuestbook`.)

`- - - in server.js file, inside function renderGuestbook, overwrite response.render("guestbook")`
```js
response.render("guestbook", {entries: guestbookEntries});
```

so, that should work and we can test it out right now. we now have an updating guestbook on our page; every time the form is submitted, the value for `nameEntry` gets stored in our array variable, and when the page is then reloaded by the browser, our "/guestbook" function is run and the template is rendered and the guestbook entries are in it.

however, it doesn't exactly work because we can only print off the first 3 instances. It would be nice if we could print everything in the entries helper; to accomplish this, we can use the handlebars "each" helper:

```hbs
{{#if entries}}
	{{#each entries}}
		<p>{{this.name}} {{this.text}}</p>
	{{/each}}
{{else}}

```

handlebars syntax looks kind of ridiculous, but bear with me. whatever html you put inside this "each" helper will be rendered once for each item in the array `entries`. inside the html, the element will be accessible under the name `this`. if we put a paragraph element with `this` in double curly braces as the content of that paragraph element, we'll get a paragraph for each item that contains each item:

```hbs
<section>
  <h3>Entries</h3>

  {{#if entries}}
    <ul class="guestbook-entries">
      {{#each entries}}
        <li>
          <span style="color:red">{{this.name}}</span>
          <span style="color:blue">{{this.text}}</span>
        </li>
        
      {{/each}}
    </ul>
  {{else}}
    <p>No entries yet. Be the first to sign the guestbook!</p>
  {{/if}}
</section>
```

so yeah. there is our guestbook. since we're using variables stored on the server, this will be accessible and will look the same to anyone who goes to your url. anyone can go to this url and add to my guestbook.

## Persistent Data Storage

There's one more thing that we should do to make this useful. since our `guestbookEntries` variable is, well, a variable, it'll get reset to its original value - an empty array - every time the program restarts. the program needs to restart if you like, edit any of its code to make changes, so that could be a problem. to solve this, we just need to save our array to a file when it changes and read it from that file again when the program starts. i have provided a file in this project called "guestbook.json" that currently contains the javascript syntax for an empty array.

json stands for JavaScript Object Notation and you can use it to store values for most of the data types that you can use for variables in javascript. it's actually used for a lot of things in a lot of different types of programs, including those written in other languages like python, because it's really useful whenever you want to turn data into text to send it or store it somewhere. it's easy to use to store and read our list of strings.

first we're going to need to import the functions that will let us read and write json data. they are going to live in an object called `fs`:

`- - - under const app = express();`
```js
const fs = require("fs");
```

after this we need to tell the computer what file we will be editing.
`- - - directly under app.use(express.urlencoded...`
```js
const DATA_FILE = "guestbook.json";
```

then, we need the data from our json file to be loaded every time our program starts up. we can do this with `fs.readFileSync`. This will essentially check if everything is working properly and open our guestbook entries.

`- - - Directly below guestbookEntries=[]`
```js
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
```

then, when we update this array, we'll also save its new value to that file:

`- - - directly under the above code`
```js
function saveEntries() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(guestbookEntries, null, 2));
}
```

Next we need to run this function whenever we get a new guestbook entry here.
```js
function receiveEntry(request, response) {
  const text = request.body.entryText?.trim();
  const name = request.body.nameText?.trim();
  const data = {name, text}
  if (text) {
    guestbookEntries.push(data);
    saveEntries(); // Added save entries function
  }
  response.redirect("/guestbook");
}
```

now, when we add an entry to our guestbook, it will be saved in our json file. this gives us persistent storage; even if our program restarts, or even if we move this whole thing from one computer to another, our guestbook will be preserved. if our guestbook gets very large, we'll want to use a database to store it instead of just using one file, but that is another topic for another day.

so, yeah. that's our server application. it does a thing. i will now take questions.

to learn more about express, you can read their guide: https://expressjs.com/en/guide/routing.html

or the tutorial on MDN: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction

## route parameters are also useful

they don't really fit into the rest of the lesson, though.

```js
function sayHiToName(request, response) {
    const name = request.params.exampleName;
    response.send("Hello, " + name);
}

app.use("/hello/:exampleName", sayHiToName);
```

take a path, and somewhere in it, put a variable name with a : in front of it. then, navigate to that same path in your browser but with some actual value in the place of the variable name. when the response function gets run, the request will store that value under your variable name inside the object `request.params`, so you can access it and do stuff with it.
