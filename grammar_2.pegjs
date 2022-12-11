{
	const computeBooleanOperation = (leftElement, rightElement, operator) => {
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
}

Expression
    = RecursiveBooleanOperation

Factor
	= "(" expression:Expression ")" { return expression; }

RecursiveBooleanOperation
	= leftElement:Boolean booleanItems:(BooleanOperator Boolean)* {
    	return booleanItems.reduce((currentValue, booleanItem) => {
        	return computeBooleanOperation(currentValue, booleanItem[1], booleanItem[0]);
        }, leftElement);
    }

Operation
	= BooleanBooleanOperation

Operator
	= IntegerOperator / BooleanOperator

AssociationOperator
	= "AND" / "OR"

BooleanBooleanOperation
	= leftElement:Boolean operator:BooleanOperator rightElement:Boolean {
        return computeBooleanOperation(leftElement, rightElement, operator);
    }

IntegerIntegerOperation
	= leftElement:Integer operator:IntegerOperator rightElement:Integer {
        switch (operator) {
            case "+":
                return leftElement + rightElement;
            case "-":
                return leftElement - rightElement;
        }
    }

BooleanOperator
    = "==" / "!=" / "<" / "<=" / ">" / ">="

IntegerOperator
	= "+" / "-"

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
    = str:[0-9a-zA-Z.]+ { return str.join(""); }

Integer "integer"
    = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
    = [ \t\n\r]*
