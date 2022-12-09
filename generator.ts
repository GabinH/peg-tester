import { readFileSync, writeFileSync } from "fs";
import { generate } from "peggy";
import * as tsPeggyPlugin from "ts-pegjs";

try {
  const data = readFileSync("./grammar.pegjs", "utf8");
  const parser = generate(data, {
    output: "source",
    format: "commonjs",
    plugins: [tsPeggyPlugin]
  });
  try {
    writeFileSync("generated_grammar.ts", parser);
  } catch (error) {
    console.error("Failed to write file : ", error);
  }
} catch (error) {
  console.error("Failed to generate file : ", error);
}
