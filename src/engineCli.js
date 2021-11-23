require('dotenv').config();
const { commonPaperTemplateEngine } = require("./engine");

const TEMPLATE = "One day Anna was walking her {{NUMBER}} {{UNIT_OF_MEASURE}} commute to {{PLACE}} and found a {{ADJECTIVE}} {{NOUN}} on the ground.";

const args = process.argv.slice(2);

const { DATA_PATH, MAX_STR } = process.env;
const options = {};
if (DATA_PATH) options.dataPath = DATA_PATH;
if (MAX_STR) options.dataPath = MAX_STR;

process.stdout.write(commonPaperTemplateEngine(TEMPLATE, options, ...args));
