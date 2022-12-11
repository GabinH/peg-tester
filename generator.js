"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var peggy_1 = require("peggy");
var tsPeggyPlugin = require("ts-pegjs");
try {
    var data = (0, fs_1.readFileSync)("./grammar.pegjs", "utf8");
    var parser = (0, peggy_1.generate)(data, {
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
