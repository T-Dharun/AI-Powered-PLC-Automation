export function tokenize(stCode) {
    if (!stCode) return [];

    const tokens = [];
    const tokenPatterns = [
        { type: "KEYWORD", regex: /^(VAR|END_VAR|IF|THEN|ELSE|END_IF|ELSIF|FOR|TO|DO|END_FOR|WHILE|END_WHILE|TON|TOF|TP|CTU|CTD|CTUD)\b/ },
        { type: "GATE", regex: /^(AND|OR|NOT|NAND|NOR|XOR)\b/ },
        { type: "TIME", regex: /^[T][#]?[0-9]+[s]/ },
        { type: "IDENTIFIER", regex: /^[A-Za-z_][A-Za-z0-9_]*/ },
        { type: "ASSIGN", regex: /^(:=)/ },
        { type: "NUMBER", regex: /^\b\d+(\.\d+)?\b/ },
        { type: "BOOLEAN", regex: /^(TRUE|FALSE)\b/ }, // \b for word boundary
        { type: "TYPE", regex: /^(BOOL|INT|REAL|DINT|TIMER|COUNTER)\b/ }, // \b for word boundary
        { type: "MEMORY", regex: /^%[IQMWDCT][WFDX]?[0-9]+(\.[0-9]+)?/ },
        { type: "OPERATOR", regex: /^(NOT|AND|OR|XOR|>=|<=|>|==|<|=|\+|-|\*|\/)/ }, // Added more operators
        { type: "COLON", regex: /^:/ },
        { type: "SYMBOL", regex: /^[();]/ }
    ];

    let position = 0;
    let line = 1;
    let column = 1;
    while (position < stCode.length) {
        if (stCode[position] === "\n") {
            line++;
            column = 1;
            position++;
            continue;
        }

        if (/\s/.test(stCode[position])) {
            column++;
            position++;
            continue;
        }

        let matchFound = false;

        for (const { type, regex } of tokenPatterns) {
            const match = stCode.slice(position).match(regex);
            if (match) {
                tokens.push({
                    type,
                    value: match[0],
                    line
                });
                position += match[0].length;
                column += match[0].length;
                matchFound = true;
                break;
            }
        }
        if (!matchFound) {
            throw new Error(`Compilation Error: Unexpected token '${stCode[position]}' at line ${line}`);
        }
    }

    return tokens;
}



export function parseTokens(tokens) {
    const ast = { variables: {}, rules: [] };
    let index = 0;

    function parseIfStatement() {
        index++; // Skip "IF"

        const conditionTokens = [];
        let parenCount = 0; // Handle nested parentheses

        while (index < tokens.length) {
            const token = tokens[index];
            if (token.value === "THEN" && parenCount === 0) {
                break; // End of the condition
            }

            if (token.value === "(") {
                parenCount++;
            } else if (token.value === ")") {
                parenCount--;
                if (parenCount < 0) {
                    throw new Error(`Compilation Error: Unbalanced parentheses in IF condition at line ${token.line}`);
                }
            }

            conditionTokens.push(token);
            index++;
        }

        if (parenCount !== 0) {
            throw new Error(`Compilation Error: Unbalanced parentheses in IF condition at line ${tokens[index - 1].line}`);
        }

        if (!tokens[index] || tokens[index].value !== "THEN") {
            throw new Error(`Compilation Error: Missing THEN in IF statement at line ${tokens[index - 1].line}`);
        }
        index++; // Skip "THEN"

        const thenBlock = parseStatements();



        let elsif=[];
        if (tokens[index].value === "ELSIF") {
            index++; // Skip "elsIF"

            const elsifconditionTokens = [];
            let parenCount = 0; // Handle nested parentheses

            while (index < tokens.length) {
                const token = tokens[index];
                if (token.value === "THEN" && parenCount === 0) {
                    break; // End of the condition
                }

                if (token.value === "(") {
                    parenCount++;
                } else if (token.value === ")") {
                    parenCount--;
                    if (parenCount < 0) {
                        throw new Error(`Compilation Error: Unbalanced parentheses in IF condition at line ${token.line}`);
                    }
                }

                elsifconditionTokens.push(token);
                index++;
            }

            if (parenCount !== 0) {
                throw new Error(`Compilation Error: Unbalanced parentheses in IF condition at line ${tokens[index - 1].line}`);
            }

            if (!tokens[index] || tokens[index].value !== "THEN") {
                throw new Error(`Compilation Error: Missing THEN in IF statement at line ${tokens[index - 1].line}`);
            }
            index++; // Skip "THEN"

            const thenBlock = parseStatements();
            elsif= { type: "ELSIF", condition: elsifconditionTokens, then: thenBlock, else: null };   
        }

        let elseBlock = null;
        if (index < tokens.length && tokens[index].value === "ELSE") {
            index++; // Skip "ELSE"
            elseBlock = parseStatements();
        }

        if (!tokens[index] || tokens[index].value !== "END_IF") {
            throw new Error(`Compilation Error: Missing END_IF in IF statement at line ${tokens[index - 1].line}`);
        }
        index++; // Skip "END_IF"

        return { type: "IF", condition: conditionTokens, then: thenBlock,elsif:elsif, else: elseBlock };
    }


    function parseStatements() {
        const statements = [];
        while (index < tokens.length) {  // Keep checking for tokens
            const token = tokens[index];
            if (token.type === "KEYWORD") {
                if (token.value === "IF") {
                    statements.push(parseIfStatement());
                } else if (token.value === "WHILE") {
                    statements.push(parseWhileLoop()); // Correctly handle WHILE
                } else if (token.value === "FOR") {
                    statements.push(parseForLoop());
                } else if (token.value === "CASE") {
                    statements.push(parseCaseStatement());
                } else if (token.value === "ELSIF" || token.value === "ELSE" || token.value === "END_IF" || token.value === "END_WHILE" || token.value === "END_FOR" || token.value === "END_CASE") {
                    break; // End of a block
                }
            } else if (token.type === "IDENTIFIER" || token.type === "MEMORY") { // Handle both IDENTIFIER and MEMORY
                statements.push(parseAssignment());
            } else if (token.type === "SYMBOL" && token.value === ';') {
                index++; // Skip semicolon
                continue; // Move to the next statement
            } else {
                throw new Error(`Compilation Error: Unexpected token '${token.value}' at line ${token.line}`);
            }
        }
        return statements;
    }


    function parseAssignment() {
        let variable = tokens[index].value;
        index++;

        if (!tokens[index] || tokens[index].type !== "ASSIGN") {
            throw new Error(`Compilation Error: Expected ':=' in assignment at line ${tokens[index - 1].line}`);
        }

        index++; // Skip ':='

        const valueTokens = []; // Store tokens of the expression
        let parenCount = 0;   // Handle parentheses in expressions

        while (index < tokens.length) {
            const token = tokens[index];

            if (token.type === "SYMBOL" && token.value === ";" && parenCount === 0) {
                index++; // Skip semicolon
                break; // End of assignment
            } else if (token.type === "KEYWORD" && (token.value === "IF" || token.value === "WHILE" || token.value === "FOR" || token.value === "CASE" || token.value === "ELSE" || token.value === "END_IF" || token.value === "END_WHILE" || token.value === "END_FOR" || token.value === "END_CASE") && parenCount === 0) {
                break; // End of assignment (within a block)
            } else if (index === tokens.length && parenCount === 0) {
                break; // End of tokens (end of file)
            }

            valueTokens.push(token); // Add the token to the expression
            index++;

            if (token.value === "(") {
                parenCount++;
            } else if (token.value === ")") {
                parenCount--;
                if (parenCount < 0) {
                    throw new Error(`Compilation Error: Unbalanced parentheses in assignment at line ${token.line}`);
                }
            }

        }

        return { type: "ASSIGNMENT", variable, value: valueTokens }; // Return the array of tokens
    }
    function parseWhileLoop() {
        index++; // Skip "WHILE"
        const conditionTokens = [];
        let parenCount = 0;

        while (index < tokens.length) {
            const token = tokens[index];

            if (token.value === "DO" && parenCount === 0) {
                break; // End of the condition
            }

            if (token.value === "(") {
                parenCount++;
            } else if (token.value === ")") {
                parenCount--;
                if (parenCount < 0) {
                    throw new Error(`Compilation Error: Unbalanced parentheses in WHILE condition at line ${token.line}`);
                }
            }

            conditionTokens.push(token);
            index++;
        }

        if (parenCount !== 0) {
            throw new Error(`Compilation Error: Unbalanced parentheses in WHILE condition at line ${tokens[index - 1].line}`);
        }

        if (!tokens[index] || tokens[index].value !== "DO") {
            throw new Error(`Compilation Error: Missing DO in WHILE loop at line ${tokens[index - 1].line}`);
        }
        index++; // Skip "DO"

        const body = parseStatements();

        if (index < tokens.length && tokens[index].value === "END_WHILE") { // Check if END_WHILE exists
            index++; // Skip "END_WHILE"
        }

        return { type: "WHILE", condition: conditionTokens, body: body };
    }



    function parseForLoop() {
        index++; // Skip "FOR"

        const loopVariable = tokens[index].value;
        index++;

        if (!tokens[index] || !(tokens[index].value == ":=" || tokens[index].value == "=")) { // Correct: Expect "=" not ":="
            throw new Error(`Compilation Error: Expected ':= or =' in FOR loop at line ${tokens[index - 1].line}`);
        }
        index++; // Skip "="

        const startValueTokens = [];
        while (index < tokens.length && tokens[index].value !== "TO") {
            startValueTokens.push(tokens[index]);
            index++;
        }

        if (!tokens[index] || tokens[index].value !== "TO") {
            throw new Error(`Compilation Error: Missing 'TO' in FOR loop at line ${tokens[index - 1].line}`);
        }
        index++; // Skip "TO"

        const endValueTokens = [];
        while (index < tokens.length && tokens[index].value !== "DO") {
            endValueTokens.push(tokens[index]);
            index++;
        }

        if (!tokens[index] || tokens[index].value !== "DO") {
            throw new Error(`Compilation Error: Missing 'DO' in FOR loop at line ${tokens[index - 1].line}`);
        }
        index++; // Skip "DO"

        const body = parseStatements();

        if (!tokens[index] || tokens[index].value !== "END_FOR") {
            throw new Error(`Compilation Error: Missing 'END_FOR' in FOR loop at line ${tokens[index - 1].line}`);
        }
        index++; // Skip "END_FOR"

        return { type: "FOR", loopVariable, startValue: startValueTokens, endValue: endValueTokens, body };
    }


    while (index < tokens.length) {
        const token = tokens[index];
        if (token.type === "KEYWORD" && token.value === "VAR") {
            index++;
            while (index < tokens.length && tokens[index].value !== "END_VAR") {
                let varName = tokens[index].value;
                index++;
                let address =0;
                if (tokens[index] && tokens[index].value === "AT") {

                index++; // Skip "AT"
                    address = tokens[index].value;
                    index++;
                }
                

                if (!tokens[index] || tokens[index].type !== "COLON") {
                    throw new Error(`Compilation Error: Expected ':' before type at line ${tokens[index - 1].line}`);
                }

                index++; // Skip ":"
                let type = tokens[index].value;
                index++;

                let initialValue = null;

                if (tokens[index] && tokens[index].value === ":=") {
                    index++; // Skip ":="
                    while (index < tokens.length && tokens[index].type !== "SYMBOL" && !(tokens[index].type === "KEYWORD" && (tokens[index].value === "IF" || tokens[index].value === "WHILE" || tokens[index].value === "FOR" || tokens[index].value === "END_VAR"))) {
                        initialValue = (tokens[index].value); // Push the value, not the whole token
                        index++;
                    }
                } else if (type === "BOOL") {  // Default TRUE for BOOL if no initial value
                    initialValue = "TRUE"; // Store as array for consistency (even if single value)
                }
                else if (type === "INT") {
                    initialValue = 0;
                }
                else {
                    initialValue = 0;
                }

                ast.variables[varName] = { type, address, value: initialValue }; // Store as array

                if (tokens[index] && tokens[index].value === ';') {
                    index++; // Skip semicolon
                }

            }
            if (index == tokens.length) {
                throw new Error(`Compilation Error: Expected 'END_VAR' in variable declaration at line ${tokens[index - 1].line + 1}`);
            }
            index++; // Skip "END_VAR"
        } else if (token.type === "KEYWORD" && token.value === "IF") {
            ast.rules.push(parseIfStatement());
        } else if (token.type === "KEYWORD" && token.value === "WHILE") {
            ast.rules.push(parseWhileLoop());
        } else if (token.type === "KEYWORD" && token.value === "FOR") {
            ast.rules.push(parseForLoop());
        } else if (token.type === "IDENTIFIER" || token.type === "MEMORY") { // Top-level assignment
            ast.rules.push(parseAssignment());
        } else {
            index++;
        }
    }

    return ast;
}