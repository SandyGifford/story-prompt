const assert = require("assert");
const path = require("path");
const fs = require("fs");
const { DEFAULT_DATA_PATH } = require("./consts");

function commonPaperTemplateEngine(template, options, ...inputs) {
	if (typeof options !== "object") {
		// it's not actually an options object, it's just another input
		inputs.unshift(options);
		options = null;
	}

	const { maxStr, dataPath } = {
		maxStr: 20,
		dataPath: DEFAULT_DATA_PATH,
		...options,
	};

	// this is a CLI app so using sync methods won't super matter - if this were a
	// server we'd want to use an async method.  Rewriting this FUNCTION for async
	// would only be, like, a minute of work; rewriting the 2 dozen sync tests
	// I just finished would take longer.
	if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "");
	const permData = JSON.parse((fs.readFileSync(dataPath) + "") || "{}");

	let index = 0;

	const out = template.replace(/\{\{(.*?)\}\}/g, (full, dataType) => {
		const i = index;
		index++;		
		const input = inputs[i];

		function addToPerm() {
			permData[dataType] = permData[dataType] || {};
			permData[dataType][input] = permData[dataType][input] || 0;
			// don't store as an array, store as an object
			// tracking occurences (faster lookups, no doubles,
			// low space as string in file)
			permData[dataType][input]++;
		}

		assert(!!full.match(/^\{\{[A-Z_]+\}\}$/), `Poorly formatted data-type ${full}`);

		switch (dataType) {
			case "NUMBER":
				// parseFloat will atempt to toString any value given to it so we can safely do this even if input is a number
				// if a non-numeric string or object is passed in here we'll get NaN back
				const num = parseFloat(input);
				assert(!isNaN(num), `Expected NUMBER input at index ${i} to be of type "number" but found "${input}"`);

				addToPerm();

				// always convert!
				return input + "";
			default:
				assert(typeof input === "string", `Expected ${dataType} input at index ${i} to be of type "string" but found "${typeof input}"`);
				assert(input.length <= maxStr, `Input at index ${i} was too long (max length ${maxStr}, found ${input.length})`);

				addToPerm();

				return input;
		}
	});

	fs.writeFileSync(dataPath, JSON.stringify(permData));
	
	return out;
}

module.exports = {
	commonPaperTemplateEngine,
}
