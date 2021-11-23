# Common Paper Story Prompt Generator

A simple command line utility for generating stories.

## Pre-Reqs

|requirement|description|
|-:|:-|
|[Node.js](https://nodejs.org/en/)|Javascript runtime|

## Setup

(all commands should be run from the repository directory)

|command|description|
|-:|:-|
|`$ npm i`|Installs packages from NPM|
|`$ npm i -D`|Installs packages, skips testing framework|

## Running

(all commands should be run from the repository directory)

|command|description|
|-:|:-|
|`$ npm test`|Runs all tests (*will* write to data file)|
|`$ node ./src/storyGen.js`|Generate a story with inputs.  Arguments are a space separated list of inputs (inputs with spaces may use quotation marks).|
|`$ node ./src/analytics.js`|Outputs stats on previous stories|
|`$ npm run storyGen`|Shortcut for `node ./src/storyGen.js`.<br />**NOTE**: *to pass arguments to an npm script you must separate them with a "`--`".  IE: `npm run storyGen -- 3 mile school blue rock`*|
|`$ npm run analytics`|Shortcut for `node ./src/analytics.js`|

## Environment Variables

This project supports several environment variables which can be set either directly in UNIX or through a [`.env`](https://www.npmjs.com/package/dotenv) file in the root of the repository directory.

|name|default|description|
|-:|:-|:-|
|DATA_PATH|`./tmp.json`|Location for the statistics data file|
|MAX_STR|`20`|Max length for string input values|
|TEMPLATE|`One day Anna was walking her {{NUMBER}} {{UNIT_OF_MEASURE}} commute to {{PLACE}} and found a {{ADJECTIVE}} {{NOUN}} on the ground.`|Template string for story generation|
