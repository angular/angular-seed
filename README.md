# angular-seed — the seed for AngularJS apps

This project is an application skeleton for a typical [AngularJS](http://angularjs.org/) web app.
You can use it to quickly bootstrap your angular webapp projects and dev environment for these
projects.

The seed contains a sample AngularJS application and is preconfigured to install the Angular
framework and a bunch of development and testing tools for instant web development gratification.

The seed app doesn't do much, just shows how to wire two controllers and views together.


## Getting Started

To get you started you can simply clone the angular-seed repository and run the preconfigured
development web server...

### Clone angular-seed

Clone the angular-seed repository using [git][git]:

```
git clone https://github.com/angular/angular-seed.git
cd angular-seed
```

### Run the Application

We have preconfigured the project with node.js to download the latest stable version
of AngularJS and install a simple development web server.  The simplest way to do this is:

```
npm start
```

Now browse to the app at `http://localhost:8080/app/index.html`.


## The AngularJS Files

The AngularJS files are not stored inside the angular-seed project, we download them from the
[bower][bower] repository. [Bower][bower] is a [node.js][node] utility for managing client-side web
application dependencies. It is installed via npm.

**Running `npm start`, in the [Getting Started](#Getting-Started) section, automatically installed
[bower][bower] locally for us.  You may prefer to have [bower][bower] installed globally**:

```
sudo npm install -g bower
```

Once we have bower installed, we can use it to get the Angular framework dependencies we need:

```
bower install
```

Bower will download all the necessary dependencies into the `bower_components` folder. Again, this
is done automatically for us when we run `npm start`.

## Serving the Application Files

While angular is client-side-only technology and it's possible to create angular webapps that
don't require a backend server at all, we recommend serving the project files using a local
webserver during development to avoid issues with security restrictions (sandbox) in browsers. The
sandbox implementation varies between browsers, but quite often prevents things like cookies, xhr,
etc to function properly when an html page is opened via `file://` scheme instead of `http://`.


### Running the app during development

The angular-seed project comes preconfigured with a local development webserver.  It is a node.js
tool called `http-server`.  You can start this webserver with `npm start` but you may choose to
install the tool globally:

```
sudo npm install -g http-server
```

Then you can start your own development web server to server static files, from a folder, by
running:

```
http-server
```

Alternatively, you can choose to configure your own webserver, such as apache or nginx. Just
configure your server to serve the files under the `app/` directory.


### Running the app in production

This really depends on how complex is your app and the overall infrastructure of your system, but
the general rule is that all you need in production are all the files under the `app/` directory.
Everything else should be omitted.

Angular apps are really just a bunch of static html, css and js files that just need to be hosted
somewhere, where they can be accessed by browsers.

If your Angular app is talking to the backend server via xhr or other means, you need to figure
out what is the best way to host the static files to comply with the same origin policy if
applicable. Usually this is done by hosting the files by the backend server or through
reverse-proxying the backend server(s) and webserver(s).


## Testing

There are two kinds of tests in the angular-seed application: Unit tests and End to End tests.

### Running Unit Tests

We recommend using [jasmine](http://pivotal.github.com/jasmine/) and
[Karma](http://karma-runner.github.io) for your unit tests/specs, but you are free
to use whatever works for you.

The angular-seed app comes preconfigured with such tests and a Karma configuration file to run them.

* the configuration is found at `test/karma.conf.js`
* the unit tests are found in `test/unit/`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

This script will ensure that the Karma dependencies are installed and then start the Karma test
runner to execute the unit tests.  Karma will then sit and watch the application and test files for
changes and re-run the tests whenever any of them change.

The Karma Test Runner is a [node.js][node] tool.  You may choose to install the CLI tool globally

```
sudo npm install -g karma
```

You can then start Karma directly, passing it the test configuration file:

```
karma start test/karma.conf.js
```

A browser will start and connect to the Karma server (Chrome is default browser, others can be
captured by loading the same url as the one in Chrome or by changing the `test/karma.conf.js`
file). Karma will then re-run the tests when there are changes to any of the source or test
javascript files.



### End to end testing

We recommend using [Protractor][protractor] for end-to-end tests. It uses native events and has
special features for Angular applications.

* the configuration is found at `test/protractor-conf.js`
* the end-to-end tests are found in `test/e2e/`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

Once you have ensured that the development web server hosting our application is up and running
(probably `npm start`) you can run the end-to-end tests using the supplied npm script:

```
npm run-script protractor
```

This script will ensure that the dependencies (including the Selenium Web Driver component) are
up to date and then execute the end-to-end tests against the application being hosted on the
development server.


### Continuous Integration

CloudBees have provided a CI/deployment setup:

<a href="https://grandcentral.cloudbees.com/?CB_clickstart=https://raw.github.com/CloudBees-community/angular-js-clickstart/master/clickstart.json"><img src="https://d3ko533tu1ozfq.cloudfront.net/clickstart/deployInstantly.png"/></a>

If you run this, you will get a cloned version of this repo to start working on in a private git repo,
along with a CI service (in Jenkins) hosted that will run unit and end to end tests in both Firefox and Chrome.

### Receiving updates from upstream

When we upgrade angular-seed's repo with newer angular or testing library code, you can just
fetch the changes and merge them into your project with git.


## Directory Layout

    app/                --> all of the files to be used in production
      css/              --> css files
        app.css         --> default stylesheet
      img/              --> image files
      index.html        --> app layout file (the main html template file of the app)
      index-async.html  --> just like index.html, but loads js files asynchronously
      js/               --> javascript files
        app.js          --> application
        controllers.js  --> application controllers
        directives.js   --> application directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
      lib/              --> angular and 3rd party javascript libraries
        angular/
          angular.js        --> the latest angular js
          angular.min.js    --> the latest minified angular js
          angular-*.js      --> angular add-on modules
          version.txt       --> version number
      partials/             --> angular view partials (partial html templates)
        partial1.html
        partial2.html

    test/               --> test config and source files
      protractor-conf.js    --> config file for running e2e tests with Protractor
      e2e/                  --> end-to-end specs
        scenarios.js
      karma.conf.js         --> config file for running unit tests with Karma
      unit/                 --> unit level specs/tests
        controllersSpec.js      --> specs for controllers
        directivessSpec.js      --> specs for directives
        filtersSpec.js          --> specs for filters
        servicesSpec.js         --> specs for services

## Contact

For more information on AngularJS please check out http://angularjs.org/

[git]: http://git-scm.com/
[bower]: http://bower.io
[node]: http://nodejs.org
[protractor]: https://github.com/angular/protractor