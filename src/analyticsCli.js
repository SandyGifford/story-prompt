require('dotenv').config();
const { commonPaperTemplateAnalytics } = require("./analytics");

const { DATA_PATH } = process.env;
const options = {};
if (DATA_PATH) options.dataPath = DATA_PATH;

process.stdout.write(commonPaperTemplateAnalytics(options));
