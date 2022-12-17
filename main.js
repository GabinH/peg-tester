"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_grammar_1 = require("./generated_grammar");
const options = {};
console.log("Testing : ", JSON.stringify((0, generated_grammar_1.parse)(`
#foo => 5
#bar => 5
if (false)
then (#aaa => 5)

else if (true)
then (

if (true)
then (#ccc => 5)
else (#ddd => 8)

)

else (#bbb => 6)
`, options), null, 2));
