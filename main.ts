import { parse } from "./generated_grammar";

const options = {
  data: {
    daysFromLastSelection: 5
  },
  output: null
};

console.log(
  "Testing : ",
  JSON.stringify(
    parse(
      `
if (#daysFromLastSelection > 4)
then (#test => 60)

else if (#daysFromLastSelection > 2)
then (#test => 40)

else (#test => 20)
`,
      options
    ),
    null,
    2
  )
);

console.log("output : ", options.output);
