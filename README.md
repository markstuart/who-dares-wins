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

`npm install -g express-generator`

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

The generator kindly creates an index page for our website, so if we open up [localhost:3000](http://localhost:3000) in a browser, we should see this page showing up.

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

Kill your current server and restart with `npm start:dev`. Now, every time you save a file in your editor, you should see the server restart in the terminal.

### Setting up reload
Open `app.js` in your editor. This file contains the core setup of your Express server, including defining routes and middleware.

If we look [here](https://github.com/alallier/reload#express-example) we'll see that we need to add some setup code for the reload library. The example code for express is a little different to how the express generator does things, but that's not a problem.

At the top of the file, we need to `require` reload. Using `require` is how you import a library (or function from a library) into the file you need it in.

Now, just above the line that sets up the `indexRouter` using `app.use`, add the `reload(app)` line.

Finally, in `views/layout.hbs` we add the script tag as described in the reload library example.

I recommend having a look at the documentation for the reload library if you are interested in understanding what exactly is going on here.

Kill the server and start it again with `npm run start:dev`, make a change to a file and save it, and watch the server restart AND the browser refresh all by itself.

Commit the changes once you're happy:
- `git status` and review the changed files
- `git add <file>` for the ones you want to add
- `git commit -m 'Setup for dev'`

Now, let's start actually building something of our own :D

## The Form
Let's build a form to capture a name and email address for people wanting to put their name in the draw.

Open up `views/index.hbs` and add:
```html
```




