require('dotenv').config();
const { commonPaperTemplateStoryGen } = require("./storyGen");

const args = process.argv.slice(2);

const {
	DATA_PATH,
	MAX_STR,
	TEMPLATE = "One day Anna was walking her {{NUMBER}} {{UNIT_OF_MEASURE}} commute to {{PLACE}} and found a {{ADJECTIVE}} {{NOUN}} on the ground."
} = process.env;

const options = {};
if (DATA_PATH) options.dataPath = DATA_PATH;
if (MAX_STR) options.dataPath = MAX_STR;

process.stdout.write(commonPaperTemplateStoryGen(TEMPLATE, options, ...args));
