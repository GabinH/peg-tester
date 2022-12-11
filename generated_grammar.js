"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.SyntaxError = void 0;
function peg$padEnd(str, targetLength, padString) {
    padString = padString || ' ';
    if (str.length > targetLength) {
        return str;
    }
    targetLength -= str.length;
    padString += padString.repeat(targetLength);
    return str + padString.slice(0, targetLength);
}
class SyntaxError extends Error {
    static buildMessage(expected, found) {
        function hex(ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
        }
        function literalEscape(s) {
            return s
                .replace(/\\/g, "\\\\")
                .replace(/"/g, "\\\"")
                .replace(/\0/g, "\\0")
                .replace(/\t/g, "\\t")
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/[\x00-\x0F]/g, (ch) => "\\x0" + hex(ch))
                .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x" + hex(ch));
        }
        function classEscape(s) {
            return s
                .replace(/\\/g, "\\\\")
                .replace(/\]/g, "\\]")
                .replace(/\^/g, "\\^")
                .replace(/-/g, "\\-")
                .replace(/\0/g, "\\0")
                .replace(/\t/g, "\\t")
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/[\x00-\x0F]/g, (ch) => "\\x0" + hex(ch))
                .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x" + hex(ch));
        }
        function describeExpectation(expectation) {
            switch (expectation.type) {
                case "literal":
                    return "\"" + literalEscape(expectation.text) + "\"";
                case "class":
                    const escapedParts = expectation.parts.map((part) => {
                        return Array.isArray(part)
                            ? classEscape(part[0]) + "-" + classEscape(part[1])
                            : classEscape(part);
                    });
                    return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
                case "any":
                    return "any character";
                case "end":
                    return "end of input";
                case "other":
                    return expectation.description;
            }
        }
        function describeExpected(expected1) {
            const descriptions = expected1.map(describeExpectation);
            let i;
            let j;
            descriptions.sort();
            if (descriptions.length > 0) {
                for (i = 1, j = 1; i < descriptions.length; i++) {
                    if (descriptions[i - 1] !== descriptions[i]) {
                        descriptions[j] = descriptions[i];
                        j++;
                    }
                }
                descriptions.length = j;
            }
            switch (descriptions.length) {
                case 1:
                    return descriptions[0];
                case 2:
                    return descriptions[0] + " or " + descriptions[1];
                default:
                    return descriptions.slice(0, -1).join(", ")
                        + ", or "
                        + descriptions[descriptions.length - 1];
            }
        }
        function describeFound(found1) {
            return found1 ? "\"" + literalEscape(found1) + "\"" : "end of input";
        }
        return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    }
    constructor(message, expected, found, location) {
        super();
        this.message = message;
        this.expected = expected;
        this.found = found;
        this.location = location;
        this.name = "SyntaxError";
        if (typeof Object.setPrototypeOf === "function") {
            Object.setPrototypeOf(this, SyntaxError.prototype);
        }
        else {
            this.__proto__ = SyntaxError.prototype;
        }
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, SyntaxError);
        }
    }
    format(sources) {
        let str = 'Error: ' + this.message;
        if (this.location) {
            let src = null;
            let k;
            for (k = 0; k < sources.length; k++) {
                if (sources[k].source === this.location.source) {
                    src = sources[k].text.split(/\r\n|\n|\r/g);
                    break;
                }
            }
            let s = this.location.start;
            let loc = this.location.source + ':' + s.line + ':' + s.column;
            if (src) {
                let e = this.location.end;
                let filler = peg$padEnd('', s.line.toString().length, ' ');
                let line = src[s.line - 1];
                let last = s.line === e.line ? e.column : line.length + 1;
                str += '\n --> ' + loc + '\n' + filler + ' |\n' + s.line + ' | ' + line + '\n' + filler + ' | ' +
                    peg$padEnd('', s.column - 1, ' ') +
                    peg$padEnd('', last - s.column, '^');
            }
            else {
                str += '\n at ' + loc;
            }
        }
        return str;
    }
}
exports.SyntaxError = SyntaxError;
function peg$parse(input, options) {
    options = options !== undefined ? options : {};
    const peg$FAILED = {};
    const peg$source = options.grammarSource;
    const peg$startRuleFunctions = { Expression: peg$parseExpression };
    let peg$startRuleFunction = peg$parseExpression;
    const peg$c0 = " => ";
    const peg$c1 = peg$literalExpectation(" => ", false);
    const peg$c2 = function (name, value) { return () => (options.output[name] = value); };
    const peg$c3 = "if (";
    const peg$c4 = peg$literalExpectation("if (", false);
    const peg$c5 = ")";
    const peg$c6 = peg$literalExpectation(")", false);
    const peg$c7 = "then (";
    const peg$c8 = peg$literalExpectation("then (", false);
    const peg$c9 = "else if (";
    const peg$c10 = peg$literalExpectation("else if (", false);
    const peg$c11 = "else (";
    const peg$c12 = peg$literalExpectation("else (", false);
    const peg$c13 = function (ifElement, thenElement, elseIfElements, elseElement) {
        let result;
        if (ifElement) {
            result = thenElement;
        }
        else if (elseIfElements && elseIfElements.length > 0) {
            const elseIfElement = elseIfElements.find((element) => {
                return element[3];
            });
            if (elseIfElement) {
                result = elseIfElement[9];
            }
        }
        if (!result) {
            result = elseElement;
        }
        return typeof result[0] === "function" ? result[0]() : result;
    };
    const peg$c14 = " ";
    const peg$c15 = peg$literalExpectation(" ", false);
    const peg$c16 = function (leftElement, operator, rightElement) {
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
    };
    const peg$c17 = "==";
    const peg$c18 = peg$literalExpectation("==", false);
    const peg$c19 = "!=";
    const peg$c20 = peg$literalExpectation("!=", false);
    const peg$c21 = "<";
    const peg$c22 = peg$literalExpectation("<", false);
    const peg$c23 = "<=";
    const peg$c24 = peg$literalExpectation("<=", false);
    const peg$c25 = ">";
    const peg$c26 = peg$literalExpectation(">", false);
    const peg$c27 = ">=";
    const peg$c28 = peg$literalExpectation(">=", false);
    const peg$c29 = peg$otherExpectation("variable value");
    const peg$c30 = function (name) { return options.data[name]; };
    const peg$c31 = peg$otherExpectation("variable name");
    const peg$c32 = "#";
    const peg$c33 = peg$literalExpectation("#", false);
    const peg$c34 = /^[0-9a-zA-Z.]/;
    const peg$c35 = peg$classExpectation([["0", "9"], ["a", "z"], ["A", "Z"], "."], false, false);
    const peg$c36 = function (key) { return key.join(""); };
    const peg$c37 = peg$otherExpectation("primitive");
    const peg$c38 = peg$otherExpectation("boolean");
    const peg$c39 = "true";
    const peg$c40 = peg$literalExpectation("true", false);
    const peg$c41 = function () { return true; };
    const peg$c42 = "false";
    const peg$c43 = peg$literalExpectation("false", false);
    const peg$c44 = function () { return false; };
    const peg$c45 = peg$otherExpectation("string");
    const peg$c46 = "'";
    const peg$c47 = peg$literalExpectation("'", false);
    const peg$c48 = function (str) { return str.join(""); };
    const peg$c49 = "\"";
    const peg$c50 = peg$literalExpectation("\"", false);
    const peg$c51 = peg$otherExpectation("integer");
    const peg$c52 = /^[0-9]/;
    const peg$c53 = peg$classExpectation([["0", "9"]], false, false);
    const peg$c54 = function () { return parseInt(text(), 10); };
    const peg$c55 = peg$otherExpectation("whitespace");
    const peg$c56 = /^[ \t\n\r]/;
    const peg$c57 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false);
    let peg$currPos = 0;
    let peg$savedPos = 0;
    const peg$posDetailsCache = [{ line: 1, column: 1 }];
    let peg$maxFailPos = 0;
    let peg$maxFailExpected = [];
    let peg$silentFails = 0;
    let peg$result;
    if (options.startRule !== undefined) {
        if (!(options.startRule in peg$startRuleFunctions)) {
            throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }
        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }
    function text() {
        return input.substring(peg$savedPos, peg$currPos);
    }
    function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
    }
    function expected(description, location1) {
        location1 = location1 !== undefined
            ? location1
            : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location1);
    }
    function error(message, location1) {
        location1 = location1 !== undefined
            ? location1
            : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildSimpleError(message, location1);
    }
    function peg$literalExpectation(text1, ignoreCase) {
        return { type: "literal", text: text1, ignoreCase: ignoreCase };
    }
    function peg$classExpectation(parts, inverted, ignoreCase) {
        return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }
    function peg$anyExpectation() {
        return { type: "any" };
    }
    function peg$endExpectation() {
        return { type: "end" };
    }
    function peg$otherExpectation(description) {
        return { type: "other", description: description };
    }
    function peg$computePosDetails(pos) {
        let details = peg$posDetailsCache[pos];
        let p;
        if (details) {
            return details;
        }
        else {
            p = pos - 1;
            while (!peg$posDetailsCache[p]) {
                p--;
            }
            details = peg$posDetailsCache[p];
            details = {
                line: details.line,
                column: details.column
            };
            while (p < pos) {
                if (input.charCodeAt(p) === 10) {
                    details.line++;
                    details.column = 1;
                }
                else {
                    details.column++;
                }
                p++;
            }
            peg$posDetailsCache[pos] = details;
            return details;
        }
    }
    function peg$computeLocation(startPos, endPos) {
        const startPosDetails = peg$computePosDetails(startPos);
        const endPosDetails = peg$computePosDetails(endPos);
        return {
            source: peg$source,
            start: {
                offset: startPos,
                line: startPosDetails.line,
                column: startPosDetails.column
            },
            end: {
                offset: endPos,
                line: endPosDetails.line,
                column: endPosDetails.column
            }
        };
    }
    function peg$fail(expected1) {
        if (peg$currPos < peg$maxFailPos) {
            return;
        }
        if (peg$currPos > peg$maxFailPos) {
            peg$maxFailPos = peg$currPos;
            peg$maxFailExpected = [];
        }
        peg$maxFailExpected.push(expected1);
    }
    function peg$buildSimpleError(message, location1) {
        return new SyntaxError(message, [], "", location1);
    }
    function peg$buildStructuredError(expected1, found, location1) {
        return new SyntaxError(SyntaxError.buildMessage(expected1, found), expected1, found, location1);
    }
    function peg$parseExpression() {
        let s0, s1;
        s0 = [];
        s1 = peg$parsePrimitive();
        if (s1 === peg$FAILED) {
            s1 = peg$parseMutation();
            if (s1 === peg$FAILED) {
                s1 = peg$parseStatement();
            }
        }
        while (s1 !== peg$FAILED) {
            s0.push(s1);
            s1 = peg$parsePrimitive();
            if (s1 === peg$FAILED) {
                s1 = peg$parseMutation();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseStatement();
                }
            }
        }
        return s0;
    }
    function peg$parseMutation() {
        let s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
            s2 = peg$parseVariableName();
            if (s2 !== peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c0) {
                    s3 = peg$c0;
                    peg$currPos += 4;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c1);
                    }
                }
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseInteger();
                    if (s4 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c2(s2, s4);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseStatement() {
        let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26;
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c3) {
                s2 = peg$c3;
                peg$currPos += 4;
            }
            else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c4);
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseOperation();
                    if (s4 === peg$FAILED) {
                        s4 = peg$parseBoolean();
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parse_();
                        if (s5 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 41) {
                                s6 = peg$c5;
                                peg$currPos++;
                            }
                            else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c6);
                                }
                            }
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parse_();
                                if (s7 !== peg$FAILED) {
                                    if (input.substr(peg$currPos, 6) === peg$c7) {
                                        s8 = peg$c7;
                                        peg$currPos += 6;
                                    }
                                    else {
                                        s8 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c8);
                                        }
                                    }
                                    if (s8 !== peg$FAILED) {
                                        s9 = peg$parse_();
                                        if (s9 !== peg$FAILED) {
                                            s10 = peg$parseExpression();
                                            if (s10 !== peg$FAILED) {
                                                s11 = peg$parse_();
                                                if (s11 !== peg$FAILED) {
                                                    if (input.charCodeAt(peg$currPos) === 41) {
                                                        s12 = peg$c5;
                                                        peg$currPos++;
                                                    }
                                                    else {
                                                        s12 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c6);
                                                        }
                                                    }
                                                    if (s12 !== peg$FAILED) {
                                                        s13 = [];
                                                        s14 = peg$currPos;
                                                        s15 = peg$parse_();
                                                        if (s15 !== peg$FAILED) {
                                                            if (input.substr(peg$currPos, 9) === peg$c9) {
                                                                s16 = peg$c9;
                                                                peg$currPos += 9;
                                                            }
                                                            else {
                                                                s16 = peg$FAILED;
                                                                if (peg$silentFails === 0) {
                                                                    peg$fail(peg$c10);
                                                                }
                                                            }
                                                            if (s16 !== peg$FAILED) {
                                                                s17 = peg$parse_();
                                                                if (s17 !== peg$FAILED) {
                                                                    s18 = peg$parseOperation();
                                                                    if (s18 === peg$FAILED) {
                                                                        s18 = peg$parseBoolean();
                                                                    }
                                                                    if (s18 !== peg$FAILED) {
                                                                        s19 = peg$parse_();
                                                                        if (s19 !== peg$FAILED) {
                                                                            if (input.charCodeAt(peg$currPos) === 41) {
                                                                                s20 = peg$c5;
                                                                                peg$currPos++;
                                                                            }
                                                                            else {
                                                                                s20 = peg$FAILED;
                                                                                if (peg$silentFails === 0) {
                                                                                    peg$fail(peg$c6);
                                                                                }
                                                                            }
                                                                            if (s20 !== peg$FAILED) {
                                                                                s21 = peg$parse_();
                                                                                if (s21 !== peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 6) === peg$c7) {
                                                                                        s22 = peg$c7;
                                                                                        peg$currPos += 6;
                                                                                    }
                                                                                    else {
                                                                                        s22 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) {
                                                                                            peg$fail(peg$c8);
                                                                                        }
                                                                                    }
                                                                                    if (s22 !== peg$FAILED) {
                                                                                        s23 = peg$parse_();
                                                                                        if (s23 !== peg$FAILED) {
                                                                                            s24 = peg$parseExpression();
                                                                                            if (s24 !== peg$FAILED) {
                                                                                                s25 = peg$parse_();
                                                                                                if (s25 !== peg$FAILED) {
                                                                                                    if (input.charCodeAt(peg$currPos) === 41) {
                                                                                                        s26 = peg$c5;
                                                                                                        peg$currPos++;
                                                                                                    }
                                                                                                    else {
                                                                                                        s26 = peg$FAILED;
                                                                                                        if (peg$silentFails === 0) {
                                                                                                            peg$fail(peg$c6);
                                                                                                        }
                                                                                                    }
                                                                                                    if (s26 !== peg$FAILED) {
                                                                                                        s15 = [s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26];
                                                                                                        s14 = s15;
                                                                                                    }
                                                                                                    else {
                                                                                                        peg$currPos = s14;
                                                                                                        s14 = peg$FAILED;
                                                                                                    }
                                                                                                }
                                                                                                else {
                                                                                                    peg$currPos = s14;
                                                                                                    s14 = peg$FAILED;
                                                                                                }
                                                                                            }
                                                                                            else {
                                                                                                peg$currPos = s14;
                                                                                                s14 = peg$FAILED;
                                                                                            }
                                                                                        }
                                                                                        else {
                                                                                            peg$currPos = s14;
                                                                                            s14 = peg$FAILED;
                                                                                        }
                                                                                    }
                                                                                    else {
                                                                                        peg$currPos = s14;
                                                                                        s14 = peg$FAILED;
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    peg$currPos = s14;
                                                                                    s14 = peg$FAILED;
                                                                                }
                                                                            }
                                                                            else {
                                                                                peg$currPos = s14;
                                                                                s14 = peg$FAILED;
                                                                            }
                                                                        }
                                                                        else {
                                                                            peg$currPos = s14;
                                                                            s14 = peg$FAILED;
                                                                        }
                                                                    }
                                                                    else {
                                                                        peg$currPos = s14;
                                                                        s14 = peg$FAILED;
                                                                    }
                                                                }
                                                                else {
                                                                    peg$currPos = s14;
                                                                    s14 = peg$FAILED;
                                                                }
                                                            }
                                                            else {
                                                                peg$currPos = s14;
                                                                s14 = peg$FAILED;
                                                            }
                                                        }
                                                        else {
                                                            peg$currPos = s14;
                                                            s14 = peg$FAILED;
                                                        }
                                                        while (s14 !== peg$FAILED) {
                                                            s13.push(s14);
                                                            s14 = peg$currPos;
                                                            s15 = peg$parse_();
                                                            if (s15 !== peg$FAILED) {
                                                                if (input.substr(peg$currPos, 9) === peg$c9) {
                                                                    s16 = peg$c9;
                                                                    peg$currPos += 9;
                                                                }
                                                                else {
                                                                    s16 = peg$FAILED;
                                                                    if (peg$silentFails === 0) {
                                                                        peg$fail(peg$c10);
                                                                    }
                                                                }
                                                                if (s16 !== peg$FAILED) {
                                                                    s17 = peg$parse_();
                                                                    if (s17 !== peg$FAILED) {
                                                                        s18 = peg$parseOperation();
                                                                        if (s18 === peg$FAILED) {
                                                                            s18 = peg$parseBoolean();
                                                                        }
                                                                        if (s18 !== peg$FAILED) {
                                                                            s19 = peg$parse_();
                                                                            if (s19 !== peg$FAILED) {
                                                                                if (input.charCodeAt(peg$currPos) === 41) {
                                                                                    s20 = peg$c5;
                                                                                    peg$currPos++;
                                                                                }
                                                                                else {
                                                                                    s20 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) {
                                                                                        peg$fail(peg$c6);
                                                                                    }
                                                                                }
                                                                                if (s20 !== peg$FAILED) {
                                                                                    s21 = peg$parse_();
                                                                                    if (s21 !== peg$FAILED) {
                                                                                        if (input.substr(peg$currPos, 6) === peg$c7) {
                                                                                            s22 = peg$c7;
                                                                                            peg$currPos += 6;
                                                                                        }
                                                                                        else {
                                                                                            s22 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) {
                                                                                                peg$fail(peg$c8);
                                                                                            }
                                                                                        }
                                                                                        if (s22 !== peg$FAILED) {
                                                                                            s23 = peg$parse_();
                                                                                            if (s23 !== peg$FAILED) {
                                                                                                s24 = peg$parseExpression();
                                                                                                if (s24 !== peg$FAILED) {
                                                                                                    s25 = peg$parse_();
                                                                                                    if (s25 !== peg$FAILED) {
                                                                                                        if (input.charCodeAt(peg$currPos) === 41) {
                                                                                                            s26 = peg$c5;
                                                                                                            peg$currPos++;
                                                                                                        }
                                                                                                        else {
                                                                                                            s26 = peg$FAILED;
                                                                                                            if (peg$silentFails === 0) {
                                                                                                                peg$fail(peg$c6);
                                                                                                            }
                                                                                                        }
                                                                                                        if (s26 !== peg$FAILED) {
                                                                                                            s15 = [s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26];
                                                                                                            s14 = s15;
                                                                                                        }
                                                                                                        else {
                                                                                                            peg$currPos = s14;
                                                                                                            s14 = peg$FAILED;
                                                                                                        }
                                                                                                    }
                                                                                                    else {
                                                                                                        peg$currPos = s14;
                                                                                                        s14 = peg$FAILED;
                                                                                                    }
                                                                                                }
                                                                                                else {
                                                                                                    peg$currPos = s14;
                                                                                                    s14 = peg$FAILED;
                                                                                                }
                                                                                            }
                                                                                            else {
                                                                                                peg$currPos = s14;
                                                                                                s14 = peg$FAILED;
                                                                                            }
                                                                                        }
                                                                                        else {
                                                                                            peg$currPos = s14;
                                                                                            s14 = peg$FAILED;
                                                                                        }
                                                                                    }
                                                                                    else {
                                                                                        peg$currPos = s14;
                                                                                        s14 = peg$FAILED;
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    peg$currPos = s14;
                                                                                    s14 = peg$FAILED;
                                                                                }
                                                                            }
                                                                            else {
                                                                                peg$currPos = s14;
                                                                                s14 = peg$FAILED;
                                                                            }
                                                                        }
                                                                        else {
                                                                            peg$currPos = s14;
                                                                            s14 = peg$FAILED;
                                                                        }
                                                                    }
                                                                    else {
                                                                        peg$currPos = s14;
                                                                        s14 = peg$FAILED;
                                                                    }
                                                                }
                                                                else {
                                                                    peg$currPos = s14;
                                                                    s14 = peg$FAILED;
                                                                }
                                                            }
                                                            else {
                                                                peg$currPos = s14;
                                                                s14 = peg$FAILED;
                                                            }
                                                        }
                                                        if (s13 !== peg$FAILED) {
                                                            s14 = peg$parse_();
                                                            if (s14 !== peg$FAILED) {
                                                                if (input.substr(peg$currPos, 6) === peg$c11) {
                                                                    s15 = peg$c11;
                                                                    peg$currPos += 6;
                                                                }
                                                                else {
                                                                    s15 = peg$FAILED;
                                                                    if (peg$silentFails === 0) {
                                                                        peg$fail(peg$c12);
                                                                    }
                                                                }
                                                                if (s15 !== peg$FAILED) {
                                                                    s16 = peg$parse_();
                                                                    if (s16 !== peg$FAILED) {
                                                                        s17 = peg$parseExpression();
                                                                        if (s17 !== peg$FAILED) {
                                                                            s18 = peg$parse_();
                                                                            if (s18 !== peg$FAILED) {
                                                                                if (input.charCodeAt(peg$currPos) === 41) {
                                                                                    s19 = peg$c5;
                                                                                    peg$currPos++;
                                                                                }
                                                                                else {
                                                                                    s19 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) {
                                                                                        peg$fail(peg$c6);
                                                                                    }
                                                                                }
                                                                                if (s19 !== peg$FAILED) {
                                                                                    s20 = peg$parse_();
                                                                                    if (s20 !== peg$FAILED) {
                                                                                        peg$savedPos = s0;
                                                                                        s1 = peg$c13(s4, s10, s13, s17);
                                                                                        s0 = s1;
                                                                                    }
                                                                                    else {
                                                                                        peg$currPos = s0;
                                                                                        s0 = peg$FAILED;
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    peg$currPos = s0;
                                                                                    s0 = peg$FAILED;
                                                                                }
                                                                            }
                                                                            else {
                                                                                peg$currPos = s0;
                                                                                s0 = peg$FAILED;
                                                                            }
                                                                        }
                                                                        else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                        }
                                                                    }
                                                                    else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                }
                                                                else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            }
                                                            else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        }
                                                        else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    }
                                                    else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                }
                                                else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            }
                                            else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseOperation() {
        let s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parseInteger();
        if (s1 === peg$FAILED) {
            s1 = peg$parseVariableValue();
        }
        if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 32) {
                s2 = peg$c14;
                peg$currPos++;
            }
            else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c15);
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parseOperator();
                if (s3 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 32) {
                        s4 = peg$c14;
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c15);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseInteger();
                        if (s5 === peg$FAILED) {
                            s5 = peg$parseVariableValue();
                        }
                        if (s5 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c16(s1, s3, s5);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseOperator() {
        let s0;
        if (input.substr(peg$currPos, 2) === peg$c17) {
            s0 = peg$c17;
            peg$currPos += 2;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c18);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c19) {
                s0 = peg$c19;
                peg$currPos += 2;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c20);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 60) {
                    s0 = peg$c21;
                    peg$currPos++;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c22);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c23) {
                        s0 = peg$c23;
                        peg$currPos += 2;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c24);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 62) {
                            s0 = peg$c25;
                            peg$currPos++;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c26);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c27) {
                                s0 = peg$c27;
                                peg$currPos += 2;
                            }
                            else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c28);
                                }
                            }
                        }
                    }
                }
            }
        }
        return s0;
    }
    function peg$parseVariableValue() {
        let s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseVariableName();
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c30(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c29);
            }
        }
        return s0;
    }
    function peg$parseVariableName() {
        let s0, s1, s2, s3;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 35) {
            s1 = peg$c32;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c33);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c34.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c35);
                }
            }
            if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    if (peg$c34.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c35);
                        }
                    }
                }
            }
            else {
                s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c36(s2);
                s0 = s1;
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c31);
            }
        }
        return s0;
    }
    function peg$parsePrimitive() {
        let s0, s1;
        peg$silentFails++;
        s0 = peg$parseInteger();
        if (s0 === peg$FAILED) {
            s0 = peg$parseString();
            if (s0 === peg$FAILED) {
                s0 = peg$parseBoolean();
            }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c37);
            }
        }
        return s0;
    }
    function peg$parseBoolean() {
        let s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 4) === peg$c39) {
            s1 = peg$c39;
            peg$currPos += 4;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c40);
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c41();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5) === peg$c42) {
                s1 = peg$c42;
                peg$currPos += 5;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c43);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c44();
            }
            s0 = s1;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c38);
            }
        }
        return s0;
    }
    function peg$parseString() {
        let s0, s1;
        peg$silentFails++;
        s0 = peg$parseSingleQuoteString();
        if (s0 === peg$FAILED) {
            s0 = peg$parseDoubleQuoteString();
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c45);
            }
        }
        return s0;
    }
    function peg$parseSingleQuoteString() {
        let s0, s1, s2, s3;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 39) {
            s1 = peg$c46;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c47);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c34.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c35);
                }
            }
            if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    if (peg$c34.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c35);
                        }
                    }
                }
            }
            else {
                s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 39) {
                    s3 = peg$c46;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c47);
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c48(s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseDoubleQuoteString() {
        let s0, s1, s2, s3;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
            s1 = peg$c49;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c50);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c34.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c35);
                }
            }
            if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    if (peg$c34.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c35);
                        }
                    }
                }
            }
            else {
                s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 34) {
                    s3 = peg$c49;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c50);
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c48(s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseInteger() {
        let s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        if (peg$c52.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c53);
            }
        }
        if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                if (peg$c52.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c53);
                    }
                }
            }
        }
        else {
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c54();
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c51);
            }
        }
        return s0;
    }
    function peg$parse_() {
        let s0, s1;
        peg$silentFails++;
        s0 = [];
        if (peg$c56.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c57);
            }
        }
        while (s1 !== peg$FAILED) {
            s0.push(s1);
            if (peg$c56.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c57);
                }
            }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c55);
            }
        }
        return s0;
    }
    options.output = {};
    peg$result = peg$startRuleFunction();
    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
    }
    else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
            peg$fail(peg$endExpectation());
        }
        throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length
            ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
            : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
    }
}
exports.parse = peg$parse;
