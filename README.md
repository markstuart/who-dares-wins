# Who Dares Wins!

This project is a tutorial for building a basic site for entering into the draw for a prize, and determining a winner.

The core technologies used are:
- [git](https://git-scm.com/) (version control system)
- javascript (Node.js and clientside ES5)
- [npm](https://www.npmjs.com/) (Node.js package manager)
- [Express](https://expressjs.com/) (Node.js web server framework)
- [Handlebars](https://handlebarsjs.com/) (Templating engine for web pages)
- Firestore (Google's realtime database offering)

**Before undertaking this tutorial you should have:**
- git installed: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- The latest LTS (long term support) version of Node.js installed (currently v8.11.3): https://nodejs.org/en/download/package-manager/
- an editor (Visual Studio Code, Atom, Sublime Text 3, etc, etc...)
- a Google account (required to set up firestore)

## Let's get started!

### Initial setup
We need a server framework to be able to render a page to the web, and we need a reasonably nice environment to develop in.

First, open a terminal shell so that you have access to the command line.

We're going to use [Express](https://expressjs.com/) as our server, so go ahead and install the express app generator cli tool:

`npm install --global express-generator`

For those of you unfamiliar with npm, that command asks npm to install the latest version of the [express-generator](https://www.npmjs.com/package/express-generator) package as a *global* package.

This means that the package will be accessible globally from your operating system's command line, instead of being specific to a project that you are working on.

Now, let's figure out how to use the generator:

`express --help`

We see `Usage: express [options] [dir]` and a list of options we could choose from.

Create a new Express server:

`express --view hbs --git who-dares-wins`

Breaking this command down, we are telling the generator to create a new server in a directory under the current location called `who-dares-wins`, using:
- the [Handlebars](https://handlebarsjs.com/) view engine, allowing us to interpolate variables into our html templates in order to have dynamic content.
- a basic [.gitignore](https://git-scm.com/docs/gitignore) file, preventing us from accidentally committing files that we shouldn't into version control

The output from the generator should give us some commands to use next:
- `cd who-dares-wins`
- `npm install` to install the packages (dependencies) required to run the server
- `DEBUG=who-dares-wins:* npm start` to run the server for the first time

The generator kindly creates an index page for our website, so if we open up [localhost:3000](http://localhost:3000) in a browser, we should see that generated page.

Let's check in the initial state of the application, so that we have a baseline in version control history:
- `git init` initialises git in the current folder so that it is able to track changes on all files in the folder and subfolders
- `git add .` adds all files to the 'working tree' of git
- `git commit -m 'Generated Express server'` actually commits the current state of the working tree with a useful message

Now, this is all really great, but we probably don't want the website to say 'Express'. Let's make it say 'Who Dares Wins!' instead.

Open up the current folder in your editor, and open the `views/index.hbs` file. This is the template for the index page you see when accessing the root route of the application (`/`).

You can see it is interpolating a `title` variable into a couple of places in the html of the template. The `{{title}}` syntax is Handlebars, and it means 'render the template using the current value of `title` in this position'.

Where is `title` being set? If we look at `routes/index.js` we can see that it is being set there, inside the Express handler for the index (`/`) route.

Let's change that `res.render('index', { title: 'Express' });` line to set the `title` to 'Who Dares Wins!'.

Explaining that line... `res` is the Express response object that will determine what is sent back to the browser. Calling `render('index', { title: 'Express' })` tells the view engine to find the `index` template and use the object provided as the data to interpolate into the template, in this case just the `title`.

Save the changes to the `index.js` file and go back to your browser to see the changes. Hmm, they're not there. Still seeing 'Express'. Try refreshing the page. Still not there. Odd. Go back to the commandline and kill the server (CTRL-C or CMD-C depending on your operating system), and run the start command again: `DEBUG=who-dares-wins:* npm start` (you can probably just press the up button a couple of times to get your shell to show the previously run commands).

Now when you refresh the page in the browser, you can see the changes.

This is not a very nice development experience, having to restart the server and refresh the page every time you make a change.

We should commit the change to `index.js`, so do that now.

Let's fix our dev environment up now.

## Set up for development
Open your editor again and take a look at the `package.json` file. This file defines the dependencies of your app, and currently it's just the ones that the generator added. It also defines a `scripts` section that can be used to add scripts for your project (i.e. commands to run tests or whatever).

If we look at the one that exists there now, we see it's called `start` and it invokes `node bin/www`. This is the reason that the server does not restart when we change files, as `node` does not watch for changes.

- `npm install --save-dev nodemon reload`

This command installs two packages into the `devDependencies` section of the `package.json` file in the root of the project.

[nodemon](https://nodemon.io/) runs the server in the same way that the node command does, but it also watches the file system for changes and restarts the server if there are any changes.

[reload](https://github.com/alallier/reload) sets up a Websocket connection to your browser that advises the browser to refresh when the server restarts, so you don't even have to worry about CMD-R or F5 :D

### Setting up nodemon (node monitor)
Add a new script called `start:dev` to the `package.json` that invokes `DEBUG=who-dares-wins:* nodemon --ext js,json,hbs,css bin/www`

The DEBUG flag increases the logging output of the server, and is handy for development.

The `--ext` option for `nodemon` tells it which file types to care about changes to.

Kill your current server and restart with `npm run start:dev`. Now, every time you save a file in your editor, you should see the server restart in the terminal.

### Setting up reload
Open `app.js` in your editor. This file contains the core setup of your Express server, including defining routes and middleware.

If we look [here](https://github.com/alallier/reload#express-example) we'll see that we need to add some setup code for the reload library. The example code for express is a little different to how the express generator does things, but that's not a problem.

At the top of the file, we need to `require` reload. Using `require` is how you import a library (or function from a library) into the file you need it in.

Now, just above the line that sets up the `indexRouter` using `app.use`, add the `reload(app)` line.

Finally, in `views/layout.hbs` we add the script tag as described in the reload library example.

I recommend having a look at the documentation for the reload library if you are interested in understanding what exactly is going on here.

Kill the server and start it again with `npm run start:dev`, refresh the browser once to ensure the reload library sets up the websocket connection, make a change to a file and save it, and watch the server restart AND the browser refresh all by itself.

Commit the changes once you're happy:
- `git status` and review the changed files
- `git add <file>` for the ones you want to add
- `git commit -m 'Setup for dev'`

Now, let's start actually building something of our own :D

## The Form
Let's build a form to capture a name and email address for people wanting to put their name in the draw.

Open up `views/index.hbs` and update it like so:
```hbs
<h1>{{title}}</h1>

<h2>Enter your name and email to go in the draw</h2>
<form id="entry_form">
  <label>
    Name:
    <input type="text" name="name">
  </label>
  <label>
    Email:
    <input type="email" name="email">
  </label>

  <button type="submit">Enter</button>
</form>
```

You should see a form appear after you save the file.

This is all fine, but if we input anything into this form and hit enter, the page refreshes. In this case, we are going to need to stop that from happening so that we can dynamically update the page with a list of people that are in the draw.

Create a file in the `public/javascripts` directory called `entries.js`, and add a script tag in the head of `views/layout.hbs` that loads the file.

Add the following function to `entries.js`:
```js
// We want to wait until the page is loaded so that the form is there to bind the submit listener to.
window.addEventListener('load', function () {
  function getEntryForm () {
    return document.getElementById('entry_form')
  }

  function addEntry(event) {
    // Stop the form from reloading the page
    event.preventDefault()

    var formData = new FormData(getEntryForm())
    console.log(formData.get('name'), formData.get('email'))
  }

  getEntryForm().addEventListener('submit', addEntry);
})
```

In the `views/layouts.hbs` file, add a script tag (similar to the one we added for the reload library) that loads our new script from the server.

Well, that's a _bit_ better. At least we aren't reloading the page when submitting the form any more. Let's get the entries displaying.

Update the code in `entries.js` to stop logging the form data to the console, and display them in a list on the page instead.

Add an Ordered List `<ol id="entry_list"></ol>` under the form.

We can add a new List Item each time an entry is received by getting a reference to the `ol` like we did with the `form`, creating a new `li` with the entry details in it, and appending it to the `ol`.

Something like this:
```js
// Create an object/model to represent the entry
var entry = { name: formData.get('name'), email: formData.get('email') }

var ol = document.getElementById('entry_list')
var entryText = document.createTextNode(entry.name + ' (' + entry.email + ')')
var li = document.createElement('li')

li.appendChild(entryText)
ol.appendChild(li)
```

Try it out, and you should see entries getting added to a numbered list under the form.

Commit your changes.

## Persist the entries
This is pretty good, but we aren't storing the entries anywhere. If we refresh the page, they're gone. Also, if this application was accessible to other people, when they added their entry we wouldn't see it.

We could do this in many different ways, but in this case we are going to leverage Firestore and the Firebase libraries. Using Firestore will give us responsive data updating, so we will see entries populating on our view of the UI as soon as new entries are received.

We need to set up a Firebase account for this.
- Go to https://console.firebase.google.com/
- Make sure you are logged into the Google account that you want to use
- "Add Project"
- Choose a project name and follow the steps
- In the Get Started page, you shoud see an icon like this `</>`
- Click it and copy the scripts, putting the script tags under the `{{{body}}}` in `views/layouts.hbs`
- Click the "Develop > Database" item from the left navigation menu
- Choose "Create database" and "Start in TEST mode"

And we're done!

Leave the firebase console page open on the database area for later.

Let's store the entries in Firestore instead of in memory.

In `entries.js` again, we want to create a reference to the firestore database, and to our `entries` collection.

```js
window.addEventListener('load', function () {
  // Initialise firestore
  var db = firebase.firestore()
  db.settings({ timestampsInSnapshots: true })
  var entriesCollection = db.collection('entries')

  function storeEntry(entry) {
    entriesCollection.add(entry)
  }
  // snip...
```

Make sure you add a call to `storeEntry` where you are adding them to the ordered list.

Once that is set up and `storeEntry` is being called, if you fill out the entry form and submit it, you should see that information appear in the `entries` collection on the firestore console page.

Awesome, a database that we don't really need any setup to use!

May as well commit the current state now.

## Get Realtime updates
Now, let's get all the entries showing up as soon as they get added.

In `entries.js` again:
```js
window.addEventListener('load', function () {
  // Initialise firestore
  var db = firebase.firestore()
  db.settings({ timestampsInSnapshots: true })
  var entriesCollection = db.collection('entries')
  listenForEntries()

  function storeEntry(entry) {
    entriesCollection.add(entry)
  }

  // Keep a local cache of the firestore data for easy access
  var entries = []

  function listenForEntries() {
    entriesCollection
      .onSnapshot(function (querySnapshot) {
        entries = querySnapshot.docs.map(function (doc) {
          return doc.data()
        })
        console.log(entries)
      });
  }
  // snip...
```

So now, instead of displaying the entries as soon as they get submitted in the form, we need to clear the `ol` whenever we get a new array of entries from Firestore, and re-render the entries into the `ol` again.

Note: There are definitely ways to only update the new items in the list on the page instead of re-rendering each time, but that could be a nice enhancement for anyone that wants to try it.

We can clear the `ol` simply by setting it's innerHTML attribute to "". Then we iterate over the entries from Firestore, calling your existing function that adds an entry to the `ol`. If you haven't got that "add an entry to the `ol`" functionality extracted to it's own function, now is a good time. Try it out and see how you go.

Once you've got that working, do a little bit of testing, making sure the entries show up as expected. Notice anything strange? The sort order that they come back in seems rather unintuitive. It appears that it sorts the entries by their automatically assigned ID's in Firestore by default. Let's add a timestamp field to our entry model so we can order by that.

When we store the entry model, we can add a timestamp using the built in Date library.

```
var now = new Date()
var timestamp = now.getTime()
```

`getTime` gives us a unix timestamp with millisecond precision, so we're pretty unlikely to have collisions.

There's a few ways that we can manage the ordering using the timestamp, but the easiest is probably to call `sort()` on the array that we are getting back from Firestore. `Array#sort` takes an optional sort function as the first parameter, which should return 1, 0, or -1 for greater, equal, or less than (respectively). See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort for more info.

When you have the entries displaying in the order they were provided, commit your changes.

## Who actually wins??

We have the ability to receive entries, so lets use that data to figure out who wins.

This is probably the core logic in our app, so we should definitely test it. Download the test file from https://gist.github.com/markstuart/56bfaacada5f8c58bee68747ef1b433d, and edit the random function in there until the test passes. If you save the file to the root of the project folder, then you should be able to run it with `node ./test-random-function.js` from your already open console.

Create a function in `entries.js` that randomly chooses one of the entries and returns it.

Add a button to `views/index.hbs` and bind a function to the click on that button that chooses an entry and displays a "Congratulations <entry.name>, you have won a Frontend Masters subscription!" message.

Commit the final part of this tutorial.

## Is that it?

We have built a functional website that can persist some data, display it, and perform a calculation over that dataset.

But the site is *VERY* basic. Some ideas for enhancements are:
- Add some styling
- Add a way to reset the entries after a draw
- Add admin authentication so that only admins can run the draw/reset the entries
- Use Babel or similar to enable us to rewrite `entries.js` in ES6 style
- Use a lightweight client side framework instead of native javascript to render the list of entries (Vue.js?)
- What can you think of?