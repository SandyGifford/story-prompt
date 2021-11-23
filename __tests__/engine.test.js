import commonPaperTemplateEngine from "common-paper-template-engine";

test("basic", () => {
	expect(
		commonPaperTemplateEngine(
			"One day Anna was walking her {{NUMBER}} {{UNIT_OF_MEASURE}} commute to {{PLACE}} and found a {{ADJECTIVE}} {{NOUN}} on the ground.",
			2, "mile", "school", "blue", "rock"
		)
	)
		.toBe("One day Anna was walking her 2 mile commute to school and found a blue rock on the ground.")
});
