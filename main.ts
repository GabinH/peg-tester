import { parse } from "./generated_grammar";

const data = {
  foo: 2,
  bar: "toto"
};

console.log("Testing : ", JSON.stringify(parse(`foo > 1 and bar = 'toto'`, { data }), null, 2));
