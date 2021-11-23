const { spawn } = require("child_process");
const path = require("path");

const CLI_PATH = path.join(__dirname, "../src/storyGenCli.js");

async function runCli(...args) {
	const cliProc = spawn("node", [CLI_PATH, ...args]);

	return new Promise((resolve, reject) => {
		let err = "", data = "";

		cliProc.stdout.on("data", buffer => data += buffer);
		cliProc.stderr.on("data", errBuffer => err += errBuffer);
		cliProc.on("close", () => {
			if (err) reject(err);
			else resolve(data);
		})
	});
}

// Jest.expect.rejects.toThrow doesn't seem to want to work
async function expectToThrow(...args) {
	let err;

	try {
		await runCli(...args);
	} catch(e) {
		err = e;
	}

	expect(() => { if (err) throw err }).toThrow();
}

test("storyGenCli", async () => {
	// normal usage
	expect(await runCli(3, "mile", "school", "blue", "rock")).toBe("One day Anna was walking her 3 mile commute to school and found a blue rock on the ground.");
	expect(await runCli("3", "mile", "school", "blue", "rock")).toBe("One day Anna was walking her 3 mile commute to school and found a blue rock on the ground.");

	// falsy number values
	expect(await runCli(0, "mile", "school", "blue", "rock")).toBe("One day Anna was walking her 0 mile commute to school and found a blue rock on the ground.");
	expect(await runCli("0", "mile", "school", "blue", "rock")).toBe("One day Anna was walking her 0 mile commute to school and found a blue rock on the ground.");

	// falsy string values
	expect(await runCli(3, "", "school", "blue", "rock")).toBe("One day Anna was walking her 3  commute to school and found a blue rock on the ground.");
	expect(await runCli(3, "mile", "", "blue", "rock")).toBe("One day Anna was walking her 3 mile commute to  and found a blue rock on the ground.");
	expect(await runCli(3, "mile", "school", "", "rock")).toBe("One day Anna was walking her 3 mile commute to school and found a  rock on the ground.");
	expect(await runCli(3, "mile", "school", "blue", "")).toBe("One day Anna was walking her 3 mile commute to school and found a blue  on the ground.");
	expect(await runCli(3, "", "school", "", "rock")).toBe("One day Anna was walking her 3  commute to school and found a  rock on the ground.");
	expect(await runCli(3, "", "", "blue", "")).toBe("One day Anna was walking her 3  commute to  and found a blue  on the ground.");
	expect(await runCli(3, "", "", "", "")).toBe("One day Anna was walking her 3  commute to  and found a   on the ground.");

	// almost-to-long-strings (see note in similar test in storyGen.test.js about non-string values for NUMBER inputs)
	expect(await runCli(3, "12345678901234567890", "school", "blue", "rock")).toBe("One day Anna was walking her 3 12345678901234567890 commute to school and found a blue rock on the ground.");
	expect(await runCli(3, "12345678901234567890", "school", "blue", "12345678901234567890")).toBe("One day Anna was walking her 3 12345678901234567890 commute to school and found a blue 12345678901234567890 on the ground.");
	expect(await runCli("12345678901234567890", "12345678901234567890", "school", "blue", "12345678901234567890")).toBe("One day Anna was walking her 12345678901234567890 12345678901234567890 commute to school and found a blue 12345678901234567890 on the ground.");
	
	// error cases
	// => non-numeric values for number
	await expectToThrow("hello world", "mile", "school", "blue", "rock");
	await expectToThrow("", "mile", "school", "blue", "rock");
	await expectToThrow("-", "mile", "school", "blue", "rock");
	await expectToThrow("-+", "mile", "school", "blue", "rock");
	await expectToThrow("NaN", "mile", "school", "blue", "rock");
	await expectToThrow(NaN, "mile", "school", "blue", "rock");

	// => long strings
	await expectToThrow(3, "123456789012345678901", "school", "blue", "rock");
	await expectToThrow(3, "123456789012345678901", "school", "123456789012345678901", "rock");
});
