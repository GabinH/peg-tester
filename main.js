"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_grammar_1 = require("./generated_grammar");
const data = {
    foo: 2,
    bar: "toto"
};
console.log("Testing : ", JSON.stringify((0, generated_grammar_1.parse)(`foo > 1 and bar = 'toto'`, { data }), null, 2));
