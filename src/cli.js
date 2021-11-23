const { commonPaperTemplateEngine } = require("./engine");

const TEMPLATE = "One day Anna was walking her {{NUMBER}} {{UNIT_OF_MEASURE}} commute to {{PLACE}} and found a {{ADJECTIVE}} {{NOUN}} on the ground.";

const args = process.argv.slice(2);

process.stdout.write(commonPaperTemplateEngine(TEMPLATE, ...args));
