[![Build Status](https://travis-ci.org/okigan/angular-seed.svg?branch=master)](https://travis-ci.org/okigan/angular-seed)
[![Code Climate](https://codeclimate.com/github/okigan/angular-seed/badges/gpa.svg)](https://codeclimate.com/github/okigan/angular-seed)

# angular-sensible-seed — the *sensible* seed for AngularJS apps

### Why? 
Why another angular seed project? Because this one is different from many other forks:

  * include common libraries/elements expected in today's webapps:
    * brand logo -- fits in navbar
    * search bar -- ditto
    * support routes with tabs 
    * angular-boostrap -- angular version of Twitter Bootstrap
    * angular-ui-router -- angular's state based router
    * angular-loading-bar -- loading bar for improved user experience / feedback
    * define production build
  * index.html
    * static application works as you expect, no build requires just open in browser and go
    * include *.less files directly in your content 
    * directly edit index.html, partials, any js/less code -- refresh and go (livereload is nice when it works, but much more complex/fragile)
    * edit from Developer Tools, IDE, Sublime or any other editor
  * code organization
    * application wide code separated from feature code
    * individual feature code grouped together
  * build automation
    * gulp build system (ex. to update index.htm with new bower dependencies)
    * separate build for the final distribution files
  * no index-async.html -- there are other ways to do that, without requiring a separate main file

This project is an application skeleton for a typical [AngularJS](http://angularjs.org/) web app.
You can use it to quickly bootstrap your angular webapp projects and dev environment for these
projects.

The seed contains a sample AngularJS application and is preconfigured to install the Angular
framework and a bunch of development and testing tools for instant web development gratification.

The seed app doesn't do much, just shows how to wire two controllers and views together.

![Alt text](/doc/images/home.png?raw=true "Preview home page")

## Getting Started

To get you started you can simply clone the angular-seed repository and install the dependencies:

### Prerequisites
  * git [http://git-scm.com/](http://git-scm.com/)
  * npm [http://nodejs.org/](http://nodejs.org/)

### Clone angular-seed

Clone the angular-seed repository using [git][git]:

```
git clone https://github.com/angular/angular-seed.git
cd angular-seed
npm install
bower install
```

### Install Dependencies

Note that the `bower_components` folder would normally be installed in the root folder but
angular-seed changes this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.*

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
npm start
```

Now browse to the app at `http://localhost:8000/app/index.html`.


## Directory Layout
```
├── app                         --> all of the source files for the application
│   ├── bower_components        --> all external dependencies 
│   ├── features                --> all high level features 
│   │   ├── feature1
│   │   └── feature2
│   ├── images                  --> application wide images
│   ├── css                     --> application css (main.css produced from less, see below)
│   ├── js                      --> application wide js code
│   │   └── components
│   └── partials                --> application wide partials (header, footer, nav, etc)
├── doc                         --> documentation
│   └── images
├── less                        --> styles in less
└── test                        --> js unit test bootstrap and e2e test bootstrap
```

## Testing

There are two kinds of tests in the angular-seed application: 
  * Unit tests and 
  * End to End tests.

### Running Unit Tests

The angular-seed app comes preconfigured with unit tests. These are written in
[Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
configuration file to run them.

* the configuration is found at `test/karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `..._test.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

This script will start the Karma test runner to execute the unit tests. Moreover, Karma will sit and
watch the source and test files for changes and then re-run the tests whenever any of them change.
This is the recommended strategy; if your unit tests are being run every time you save a file then
you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit.  This is useful if you want to
check that a particular version of the code is operating as expected.  The project contains a
predefined script to do this:

```
npm run test-single-run
```


### End to end testing

The angular-seed app comes with end-to-end tests, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `test/protractor-conf.js`
* the end-to-end tests are found in `test/scenarios.js`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

```
npm start
```

In addition, since Protractor is built upon WebDriver we need to install this.  The angular-seed
project comes with a predefined script to do this:

```
npm run update-webdriver
```

This will download and install the latest version of the stand-alone WebDriver tool.

Once you have ensured that the development web server hosting our application is up and running
and WebDriver is updated, you can run the end-to-end tests using the supplied npm script:

```
npm run protractor
```

This script will execute the end-to-end tests against the application being hosted on the
development server.


## Updating Angular

Just run:

```
npm update
bower update
```

This will find the latest versions that match the version ranges specified in the `bower.json` file.


## Serving the Application Files

While angular is client-side-only technology and it's possible to create angular webapps that
don't require a backend server at all, we recommend serving the project files using a local
webserver during development to avoid issues with security restrictions (sandbox) in browsers. The
sandbox implementation varies between browsers, but quite often prevents things like cookies, xhr,
etc to function properly when an html page is opened via `file://` scheme instead of `http://`.


### Running the App during Development

The angular-seed project comes preconfigured with a local development webserver.  It is a node.js
tool called [http-server][http-server].  You can start this webserver with `npm start` but you may choose to
install the tool globally:

```
sudo npm install -g http-server
```

Then you can start your own development web server to serve static files from a folder by
running:

```
http-server -a localhost -p 8000
```

Alternatively, you can choose to configure your own webserver, such as apache or nginx. Just
configure your server to serve the files under the `app/` directory.


### Running the App in Production

This really depends on how complex your app is and the overall infrastructure of your system, but
the general rule is that all you need in production are all the files under the `app/` directory.
Everything else should be omitted.

Angular apps are really just a bunch of static html, css and js files that just need to be hosted
somewhere they can be accessed by browsers.

If your Angular app is talking to the backend server via xhr or other means, you need to figure
out what is the best way to host the static files to comply with the same origin policy if
applicable. Usually this is done by hosting the files by the backend server or through
reverse-proxying the backend server(s) and webserver(s).


## Continuous Integration

### Travis CI

[Travis CI][travis] is a continuous integration service, which can monitor GitHub for new commits
to your repository and execute scripts such as building the app or running tests. The angular-seed
project contains a Travis configuration file, `.travis.yml`, which will cause Travis to run your
tests when you push to GitHub.

You will need to enable the integration between Travis and GitHub. See the Travis website for more
instruction on how to do this.

### CloudBees

CloudBees have provided a CI/deployment setup:

<a href="https://grandcentral.cloudbees.com/?CB_clickstart=https://raw.github.com/CloudBees-community/angular-js-clickstart/master/clickstart.json">
<img src="https://d3ko533tu1ozfq.cloudfront.net/clickstart/deployInstantly.png"/></a>

If you run this, you will get a cloned version of this repo to start working on in a private git repo,
along with a CI service (in Jenkins) hosted that will run unit and end to end tests in both Firefox and Chrome.


## Contact

For more information on AngularJS please check out http://angularjs.org/

[git]: http://git-scm.com/
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
[protractor]: https://github.com/angular/protractor
[jasmine]: http://jasmine.github.io
[karma]: http://karma-runner.github.io
[travis]: https://travis-ci.org/
[http-server]: https://github.com/nodeapps/http-server
