"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assert(assertion, errorMessage) {
    if (!assertion)
        throw new Error(errorMessage);
}
function commonPaperTemplateEngine(template, ...inputs) {
    let index = 0;
    return template.replace(/\{\{(.*?)\}\}/g, (full, dataType) => {
        const i = index;
        const input = inputs[i];
        index++;
        assert(!!full.match(/^\{\{[A-Z_]+\}\}$/), `Poorly formatted data-type ${full}`);
        // Switches are faster than ifs
        switch (dataType) {
            case "NUMBER":
                assert(typeof input === "number", `Expected NUMBER input at index ${i} to be of type "number" but found "${typeof input}"`);
                // always convert!
                return input + "";
            default:
                assert(typeof input === "string", `Expected ${dataType} input at index ${i} to be of type "string" but found "${typeof input}"`);
                assert(input.length <= 100, `Input at index ${i} was too long (max length 100, found ${input.length})`);
                return input;
        }
    });
}
exports.default = commonPaperTemplateEngine;
//# sourceMappingURL=engine.js.map