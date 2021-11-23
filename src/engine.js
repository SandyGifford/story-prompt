const assert = require("assert");
const fs = require("fs");
const { promisify } = require("util");

const writeFile = promisify(fs.writeFile);

function commonPaperTemplateEngine(template, ...inputs) {
	let index = 0;

	return template.replace(/\{\{(.*?)\}\}/g, (full, dataType) => {
		const i = index;
		index ++;		
		const input = inputs[i];

		assert(!!full.match(/^\{\{[A-Z_]+\}\}$/), `Poorly formatted data-type ${full}`);

		switch (dataType) {
			case "NUMBER":
				// parseFloat will atempt to toString any value given to it so we can safely do this even if input is a number
				// if a non-numeric string or object is passed in here we'll get NaN back
				const num = parseFloat(input);
				assert(!isNaN(num), `Expected NUMBER input at index ${i} to be of type "number" but found "${input}"`)

				// always convert!
				return input + "";
			default:
				assert(typeof input === "string", `Expected ${dataType} input at index ${i} to be of type "string" but found "${typeof input}"`);
				assert(input.length <= 20, `Input at index ${i} was too long (max length 100, found ${input.length})`);

				return input;
		}
	})
}

module.exports = {
	commonPaperTemplateEngine,
}
