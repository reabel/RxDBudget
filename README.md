# Reabel X Design Budget Application

~~This project consists of a fork of cleverstack.~~

Note: Cleverstack-cli was last updated in 2016. This project has been renamed and will be refactored to use more modern technology

## Todo

- [x] Review the idea of this project to see if it's still relevent.
  - Will rebuild this in three projects within a monorepo
    1. Backend - Handle the business logic as well as DB Connections
    2. API - handle communication between backend and frontend as well as external sources
    3. Frontend - Render data in a useful manner using JS, possibly build to Electron
- [ ] Look at Backend and Frontend basis for project ~~and review security updates~~
  - [ ] Strip Packages as necessary from Clever folder

## Cleverstack features / Highlights
* NodeJS Async Non-Blocking Core.
* Modular Coding Structure based on NPM.
* ~~Grunt powered tasks, including Server with Live Restart using nodemon.~~
  * should be irrevelant since modern node allows live restart anyways
* Databases supported: MySQL, PostgreSQL, SQLite or MongoDB.
  * Going to be focusing on one single DB for this project
* Official ORM (Object Relational Mapper) Module provides an enterprise SQL based solution out of the box.
* Official ODM (Object Document Mapper) Module provides an enterprise NoSQL based solution out of the box.
  * Not necessarily applicable to this application but could be interesting
* Clustered application with high Concurrency out of the box.
* NodeJS Background Tasks Module which allows CPU intensive (blocking) operations to take place in separate processes, allowing your HTTP Web Server Processes to continue serving HTTP Requests.
* Unit & E2E (Integration) Testing with Mocha and Request.

## Frontend Packages - Clever

The bundle in this case elected to use angular, which is something we could use again since it's regaining a bit of popularity lately it seems.

### devDependencies - FE

```json
"grunt-concurrent": "~0.4.1",
"grunt-contrib-clean": "~0.5.0",
"grunt-contrib-concat": "~0.3.0",
"grunt-contrib-connect": "~0.5.0",
"grunt-contrib-copy": "~0.4.1",
"grunt-contrib-cssmin": "~0.7.0",
"grunt-contrib-htmlmin": "~0.1.3",
"grunt-contrib-imagemin": "~0.4.0",
"grunt-contrib-jshint": "~0.7.1",
"grunt-contrib-less": "~0.6.4",
"grunt-contrib-livereload": "~0.1.2",
"grunt-contrib-requirejs": "~0.4.1",
"grunt-contrib-watch": "~0.5.2",
"grunt-coveralls": "^0.3.0",
"grunt-istanbul": "^0.3.0",
"grunt-karma": "0.7.2",
"grunt-ngmin": "~0.0.2",
"grunt-open": "~0.2.2",
"grunt-protractor-coverage": "^0.2.8",
"grunt-protractor-runner": "~0.1.6",
"grunt-rev": "~0.1.0",
"grunt-run": "~0.2.2",
"grunt-usemin": "~0.1.12",
"karma": "~0.11.11",
"karma-browserstack-launcher": "~0.0.7",
"karma-chrome-launcher": "~0.1.1",
"karma-coverage": "~0.1.0",
"karma-firefox-launcher": "~0.1.2",
"karma-growl-reporter": "~0.1.1",
"karma-html2js-preprocessor": "~0.1.0",
"karma-jasmine": "~0.1.4",
"karma-junit-reporter": "~0.2.1",
"karma-ng-html2js-preprocessor": "~0.1.0",
"karma-opera-launcher": "~0.1.0",
"karma-phantomjs-launcher": "~0.1.1",
"karma-requirejs": "~0.2.0",
"karma-safari-launcher": "~0.1.1",
"karma-sauce-launcher": "~0.2.8",
"karma-script-launcher": "~0.1.0",
"load-grunt-tasks": "~0.2.0",
"phantomjs": "~1.9.2",
"protractor": "~0.24.2",
"time-grunt": "~0.2.1"
```

## Backend Packages - Clever

### dependencies - BE

```json
"async": "~0.9.0",
"bluebird": "~2.1.3",
"chalk": "~0.4.0",
"clever-controller": "^1.2.2",
"clever-injector": "~1.0.0",
"cors": "~2.3.1",
"debug": "6.3.4",
"deepmerge": "~0.2.7",
"express": "~4.17.1",
"i": "~0.3.2",
"nconf": "^0.12.1",
"uberclass": "~1.0.1",
"underscore": "~1.12.1",
"validator": "~13.7.0"
```

### devDependencies - BE

```json
"chai": "~1.9.1",
"grunt-concurrent": "^3.0.0",
"grunt-contrib-clean": "^2.0.1",
"grunt-contrib-connect": "^4.0.0",
"grunt-contrib-jshint": "^3.2.0",
"grunt-contrib-watch": "^1.1.0",
"grunt-exec": "~0.4.2",
"grunt-mocha-test": "^0.13.3",
"grunt-nodemon": "^0.4.2",
"karma": "~6.3.14",
"matchdep": "^2.0.0",
"mocha": "^10.2.0",
"ncp": "~0.5.1",
"rimraf": "~2.2.8",
"should": "~4.0.4",
"sinon": "~1.10.2",
"supertest": "^6.3.4"
```
