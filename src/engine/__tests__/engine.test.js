const { commonPaperTemplateEngine } = require("../engine");
const { AssertionError } = require("assert");

const BASIC_TEMPLATE = "One day Anna was walking her {{NUMBER}} {{UNIT_OF_MEASURE}} commute to {{PLACE}} and found a {{ADJECTIVE}} {{NOUN}} on the ground.";

describe("engine", () => {
	describe("basic template", () => {
		test("normal usage", () => {
			expect(commonPaperTemplateEngine(BASIC_TEMPLATE, "3", "miles", "school", "blue", "rock"))
				.toBe("One day Anna was walking her 3 miles commute to school and found a blue rock on the ground.");
			expect(commonPaperTemplateEngine(BASIC_TEMPLATE, 3, "miles", "school", "blue", "rock"))
				.toBe("One day Anna was walking her 3 miles commute to school and found a blue rock on the ground.");
		});

		test("falsy values", () => {
			expect(commonPaperTemplateEngine(BASIC_TEMPLATE, 3, "", "school", "blue", "rock"))
				.toBe("One day Anna was walking her 3  commute to school and found a blue rock on the ground.");
				expect(commonPaperTemplateEngine(BASIC_TEMPLATE, 3, "", "", "blue", "rock"))
					.toBe("One day Anna was walking her 3  commute to  and found a blue rock on the ground.");
				expect(commonPaperTemplateEngine(BASIC_TEMPLATE, 3, "", "", "", "rock"))
					.toBe("One day Anna was walking her 3  commute to  and found a  rock on the ground.");
				expect(commonPaperTemplateEngine(BASIC_TEMPLATE, 3, "", "", "", ""))
					.toBe("One day Anna was walking her 3  commute to  and found a   on the ground.");

				expect(commonPaperTemplateEngine(BASIC_TEMPLATE, "0", "miles", "school", "blue", "rock"))
					.toBe("One day Anna was walking her 0 miles commute to school and found a blue rock on the ground.");
				expect(commonPaperTemplateEngine(BASIC_TEMPLATE, 0, "miles", "school", "blue", "rock"))
					.toBe("One day Anna was walking her 0 miles commute to school and found a blue rock on the ground.");

				expect(commonPaperTemplateEngine(BASIC_TEMPLATE, "0", "", "school", "blue", "rock"))
					.toBe("One day Anna was walking her 0  commute to school and found a blue rock on the ground.");
				expect(commonPaperTemplateEngine(BASIC_TEMPLATE, 0, "", "school", "blue", "rock"))
					.toBe("One day Anna was walking her 0  commute to school and found a blue rock on the ground.");
		});

		test("almost-to-long-strings", () => {
			expect(commonPaperTemplateEngine(BASIC_TEMPLATE, 3, "12345678901234567890", "school", "blue", "rock"))
				.toBe("One day Anna was walking her 3 12345678901234567890 commute to school and found a blue rock on the ground.");
			expect(commonPaperTemplateEngine(BASIC_TEMPLATE, 3, "12345678901234567890", "school", "blue", "12345678901234567890"))
				.toBe("One day Anna was walking her 3 12345678901234567890 commute to school and found a blue 12345678901234567890 on the ground.");
			// 20 digit numbers are actually beyond Node's max-int so precision drops here in the last few digits and the test fails
			// expect(commonPaperTemplateEngine(BASIC_TEMPLATE, 12345678901234567890, "12345678901234567890", "school", "blue", "12345678901234567890"))
			//	.toBe("One day Anna was walking her 12345678901234567890 12345678901234567890 commute to school and found a blue 12345678901234567890 on the ground.");
			expect(commonPaperTemplateEngine(BASIC_TEMPLATE, Number.MAX_VALUE, "12345678901234567890", "school", "blue", "12345678901234567890"))
				.toBe(`One day Anna was walking her ${Number.MAX_VALUE} 12345678901234567890 commute to school and found a blue 12345678901234567890 on the ground.`);
			expect(commonPaperTemplateEngine(BASIC_TEMPLATE, Number.MAX_SAFE_INTEGER, "12345678901234567890", "school", "blue", "12345678901234567890"))
				.toBe(`One day Anna was walking her ${Number.MAX_SAFE_INTEGER} 12345678901234567890 commute to school and found a blue 12345678901234567890 on the ground.`);
			expect(commonPaperTemplateEngine(BASIC_TEMPLATE, "12345678901234567890", "12345678901234567890", "school", "blue", "12345678901234567890"))
				.toBe("One day Anna was walking her 12345678901234567890 12345678901234567890 commute to school and found a blue 12345678901234567890 on the ground.");
		});

		describe("error cases", () => {
			test("non-numeric values for number", () => {
				expect(() => commonPaperTemplateEngine(BASIC_TEMPLATE, "hello world", "mile", "school", "blue", "rock")).toThrow();
				expect(() => commonPaperTemplateEngine(BASIC_TEMPLATE, "", "mile", "school", "blue", "rock")).toThrow();
				expect(() => commonPaperTemplateEngine(BASIC_TEMPLATE, "-", "mile", "school", "blue", "rock")).toThrow();
				expect(() => commonPaperTemplateEngine(BASIC_TEMPLATE, "-+", "mile", "school", "blue", "rock")).toThrow();
				expect(() => commonPaperTemplateEngine(BASIC_TEMPLATE, "NaN", "mile", "school", "blue", "rock")).toThrow();
				expect(() => commonPaperTemplateEngine(BASIC_TEMPLATE, NaN, "mile", "school", "blue", "rock")).toThrow();
			});

			test("long strings", () => {
				expect(() => commonPaperTemplateEngine(BASIC_TEMPLATE, 3, "123456789012345678901", "school", "blue", "rock")).toThrow(AssertionError);
				expect(() => commonPaperTemplateEngine(BASIC_TEMPLATE, 3, "123456789012345678901", "school", "123456789012345678901", "rock")).toThrow(AssertionError);
			});
		});
	});
});
