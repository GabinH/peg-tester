Expression
    = head:Factor yo:AssociatedFactor* {
    switch (yo[0].asso) {
        case "OR":
            return head || yo[0].facto;
        case "AND":
            return head && yo[0].facto;
    }
}

AssociatedFactor
    = ass:Association fact:Factor {
    return { "asso":ass, "facto":fact };
}

Association "or and"
    = _ asso:('or' / 'and' / 'OR' / 'AND') _ {
        return asso.toString().toUpperCase();
    }

Factor
    = "(" _ expr:Expression _ ")" { return expr; }
        / Opertation

Opertation
    = tested:String _ operator:Operator _ expected:( CompareString / Integer) {
    if (Object.keys(options.data).some(v => v == tested)) {
        switch (operator) {
            case "=":
                return options.data[tested] === expected;
            case "!=":
                return options.data[tested] !== expected;
            case "<":
                return options.data[tested] < expected;
            case ">":
                return options.data[tested] > expected;
            default:
                return false;
        }
    } else {
      throw new Error(`This key: "${tested}" doesnt exist in the data object provided`);
    }
}
CompareString
    = SingleQuoteString / DoubleQuoteString

SingleQuoteString
    = "'" str:[0-9a-zA-Z.]+ "'" { return str.join(""); }

DoubleQuoteString
    = '"' str:[0-9a-zA-Z.]+ '"' { return str.join(""); }

Operator
    = "=" / "!=" / "<" / ">"

String "string"
    = _ str:[0-9a-zA-Z.]+ {return str.join("")}

Integer "integer"
    = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
    = [ \t\n\r]*
