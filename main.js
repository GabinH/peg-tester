"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_grammar_1 = require("./generated_grammar");
const data = {
    daysFromLastSelection: 5
};
console.log("Testing : ", JSON.stringify((0, generated_grammar_1.parse)(`if (#daysFromLastSelection > 4)
then (60)

else if (#daysFromLastSelection > 2)
then (40)

else (20)`, { data }), null, 2));
