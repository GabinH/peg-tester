"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_grammar_1 = require("./generated_grammar");
const options = {
    data: {
        daysFromLastSelection: 5
    },
    output: null
};
console.log("Testing : ", JSON.stringify((0, generated_grammar_1.parse)(`
if (#daysFromLastSelection > 4)
then (#test => 60)

else if (#daysFromLastSelection > 2)
then (#test => 40)

else (#test => 20)
`, options), null, 2));
console.log("output : ", options.output);
