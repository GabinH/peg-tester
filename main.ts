import { parse } from "./generated_grammar";

const data = {
  daysFromLastSelection: 5
};

console.log(
  "Testing : ",
  JSON.stringify(
    parse(
      `if (#daysFromLastSelection > 4)
then (60)

else if (#daysFromLastSelection > 2)
then (40)

else (20)`,
      { data }
    ),
    null,
    2
  )
);
