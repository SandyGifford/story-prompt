function assert(assertion: boolean, errorMessage: string): void {
	if (!assertion) throw new Error(errorMessage);
}

export default function commonPaperTemplateEngine(template: string, ...inputs: (string | number)[]): string {
	let index = 0;

	return template.replace(/\{\{(.*?)\}\}/g, (full, dataType) => {
		const i = index;
		const input = inputs[i];
		index ++;

		assert(!!full.match(/^\{\{[A-Z_]+\}\}$/), `Poorly formatted data-type ${full}`);

		// Switches are faster than ifs
		switch (dataType) {
			case "NUMBER":
				assert(typeof input === "number", `Expected NUMBER input at index ${i} to be of type "number" but found "${typeof input}"`);

				// always convert!
				return input + "";
			default:
				assert(typeof input === "string", `Expected ${dataType} input at index ${i} to be of type "string" but found "${typeof input}"`);
				assert((input as string).length <= 100, `Input at index ${i} was too long (max length 100, found ${(input as string).length})`);

				return input as string;
		}
	})
}
