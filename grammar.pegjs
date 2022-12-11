{
	const data = {
	    daysFromLastSelection: options.data.daysFromLastSelection,
    	faithLevel: 1,
        hapinessLevel: 2,
        healthLevel: 3,
        securityLevel: 4,
        wealthLevel: 5,
    }
}

Expression
	= Statement

Statement
	= _ "if (" _ ifElement:(Operation) _ ")"
    _ "then (" _ thenElement:Integer _ ")"
    elseIfElements:(_ "else if (" _ Operation _ ")" _ "then (" _ Integer _ ")")*
    _ "else (" _ elseElement:Integer _ ")" {
    	if (ifElement) {
        	return thenElement;
        }
        if (elseIfElements && elseIfElements.length > 0) {
        	const elseIfElement = elseIfElements.find((element) => {
            	return element[3];
            })
            if (elseIfElement) {
            	return elseIfElement[9];
            }
        }
        return elseElement;
    }

Operation
	= leftElement:Variable " " operator:Operator " " rightElement:(Primitive / Variable) {
        switch (operator) {
            case "==":
                return leftElement === rightElement;
            case "!=":
                return leftElement !== rightElement;
            case "<":
                return leftElement < rightElement;
            case "<=":
                return leftElement <= rightElement;
            case ">":
                return leftElement > rightElement;
            case ">=":
                return leftElement <= rightElement;
        }
    }

Operator
	= "==" / "!=" / "<" / "<=" / ">" / ">="

Primitive "primitive"
	= Integer / String / Boolean

Boolean "boolean"
	= "true" { return true; } / "false" { return false; }

String "string"
    = SingleQuoteString / DoubleQuoteString

SingleQuoteString
    = "'" str:[0-9a-zA-Z.]+ "'" { return str.join(""); }

DoubleQuoteString
    = '"' str:[0-9a-zA-Z.]+ '"' { return str.join(""); }

Variable "variable"
    = "#" key:[0-9a-zA-Z.]+ { return data[key.join("")]; }

Integer "integer"
    = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
    = [ \t\n\r]*
