"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const peggy_1 = require("peggy");
const tsPeggyPlugin = require("ts-pegjs");
try {
    const data = (0, fs_1.readFileSync)("./grammar.pegjs", "utf8");
    const parser = (0, peggy_1.generate)(data, {
        output: "source",
        format: "commonjs",
        plugins: [tsPeggyPlugin]
    });
    try {
        (0, fs_1.writeFileSync)("generated_grammar.ts", parser);
    }
    catch (error) {
        console.error("Failed to write file : ", error);
    }
}
catch (error) {
    console.error("Failed to generate file : ", error);
}
