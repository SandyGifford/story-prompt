const fs = require("fs");
const { DEFAULT_DATA_PATH } = require("./consts");
const tabula = require("tabula");

const longestStr = strs => strs.reduce((longest, key) => key.length > longest.length ? key : longest, "");
const shortestStr = strs => strs.reduce((shortest, key) => shortest === null || key.length < shortest.length ? key : shortest, null);
const mostCommon = inputs => Object.keys(inputs).reduce((mostKey, key) => !mostKey || inputs[key] > inputs[mostKey] ? key : mostKey, null);
const leastCommon = inputs => Object.keys(inputs).reduce((leastKey, key) => !leastKey || inputs[key] < inputs[leastKey] ? key : leastKey, null);

function mostCommonWithCount(inputs) {
	const most = mostCommon(inputs);
	return `${most} (${inputs[most]})`;
}

function leastCommonWithCount(inputs) {
	const least = leastCommon(inputs);
	return `${least} (${inputs[least]})`;
}


function commonPaperTemplateAnalytics(options) {
	const { dataPath } = {
		dataPath: DEFAULT_DATA_PATH,
		...options,
	};

	if (!fs.existsSync(dataPath)) throw new Error(`Could not find data file at ${dataPath}`);
	const permData = JSON.parse((fs.readFileSync(dataPath) + "") || "{}");
	const dataTypes = Object.keys(permData);
	const numbers = Object.keys(permData.NUMBER).map(parseFloat);
	const dataTypeInputs = dataTypes.reduce((map, key) => {
		map[key] = Object.keys(permData[key]);
		return map;
	}, {});
	const combinedInputs = dataTypes.reduce((map, key) => {
		dataTypeInputs[key].forEach(input => {
			if (!map[input]) map[input] = 0;
			map[input] += permData[key][input];
		});
		return map;
	}, {});

	return tabula.format([
		{ key: `${dataTypes.length} data type(s)`, val: dataTypes.join(", ") },
		{ key: "shortest data key", val: shortestStr(dataTypes) },
		{ key: "longest data key", val: longestStr(dataTypes) },
		...dataTypes.map(key => key === "NUMBER" ? null : ({ key: `shortest input in ${key}`, val: shortestStr(dataTypeInputs[key]) })).filter(i => !!i),
		...dataTypes.map(key => key === "NUMBER" ? null : ({ key: `longest input in ${key}`, val: longestStr(dataTypeInputs[key]) })).filter(i => !!i),
		{ key: "smallest NUMBER", val: permData.NUMBER ? Math.min(...numbers) : "N/A" },
		{ key: "largest NUMBER", val: permData.NUMBER ? Math.max(...numbers) : "N/A" },
		...dataTypes.map(key => ({ key: `most common input in ${key}`, val: mostCommonWithCount(permData[key]) })).filter(i => !!i),
		...dataTypes.map(key => ({ key: `least common input in ${key}`, val: leastCommonWithCount(permData[key]) })).filter(i => !!i),
		{ key: "overall most common input", val: mostCommonWithCount(combinedInputs) },
		{ key: "overall least common input", val: leastCommonWithCount(combinedInputs) },
	], {
		columns: ["key", "val"],
		skipHeader: true,
	});
}

module.exports = {
	commonPaperTemplateAnalytics,
};
