Expression
	= expressions:(Statement / Mutation / Primitive)* {
        const output = {};
        expressions.forEach((expression) => {
            Object.assign(output, expression);
        });
        return output;
    }

Mutation
	= _ name:VariableName " => " value:Integer { return {[name]: value}; }

Statement
	= _ "if (" _ ifElement:(Operation / Boolean) _ ")"
    _ "then (" _ thenElement:Expression _ ")"
    elseIfElements:(_ "else if (" _ (Operation / Boolean) _ ")" _ "then (" _ Expression _ ")")*
    _ "else (" _ elseElement:Expression _ ")" _ {
		let result;
		if (ifElement) {
        	result = thenElement;
        } else if (elseIfElements && elseIfElements.length > 0) {
        	const elseIfElement = elseIfElements.find((element) => {
            	return element[3];
            })
            if (elseIfElement) {
            	result = elseIfElement[9];
            }
        }
        if (!result) {
        	result = elseElement;
        }
        return typeof result === "function" ? result() : result;
    }

Operation
	= leftElement:(Integer / VariableValue) " " operator:Operator " " rightElement:(Integer / VariableValue) {
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

VariableValue "variable value"
	= name:VariableName { return options.data[name]; }

VariableName "variable name"
    = "#" key:[0-9a-zA-Z.]+ { return key.join(""); }

Primitive "primitive"
	= Integer / Boolean

Boolean "boolean"
	= "true" { return true; } / "false" { return false; }

String "string"
    = SingleQuoteString / DoubleQuoteString

SingleQuoteString
    = "'" str:[0-9a-zA-Z.]+ "'" { return str.join(""); }

DoubleQuoteString
    = '"' str:[0-9a-zA-Z.]+ '"' { return str.join(""); }

Integer "integer"
    = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
    = [ \t\n\r]*
