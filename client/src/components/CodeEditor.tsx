
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

interface CodeEditorProps {
  initialCode: string;
  onCodeRun?: (code: string) => void;
}

export default function CodeEditor({ initialCode, onCodeRun }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  const runCode = () => {
    try {
      const lines = code.split('\n').map(line => line.trimRight());
      let result = '';
      let variables: { [key: string]: any } = {};
      let functions: { [key: string]: { params: string[], body: string[] } } = {};

      const evaluateExpression = (expr: string, vars: { [key: string]: any }): any => {
        expr = expr.trim();
        
        // String literals
        if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
          return expr.slice(1, -1);
        }
        
        // F-strings
        if (expr.startsWith('f"') || expr.startsWith("f'")) {
          let fstring = expr.slice(2, -1);
          // Replace variables in f-string
          fstring = fstring.replace(/\{([^}]+)\}/g, (match, varName) => {
            const cleanVarName = varName.trim();
            if (vars.hasOwnProperty(cleanVarName)) {
              return String(vars[cleanVarName]);
            }
            return match;
          });
          return fstring;
        }
        
        // Numbers
        if (/^-?\d+(\.\d+)?$/.test(expr)) {
          return parseFloat(expr);
        }
        
        // Variables
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr) && vars.hasOwnProperty(expr)) {
          return vars[expr];
        }
        
        // Lists
        if (expr.startsWith('[') && expr.endsWith(']')) {
          const listContent = expr.slice(1, -1).trim();
          if (!listContent) return [];
          return listContent.split(',').map(item => evaluateExpression(item.trim(), vars));
        }
        
        // Dictionaries
        if (expr.startsWith('{') && expr.endsWith('}')) {
          const dictContent = expr.slice(1, -1).trim();
          if (!dictContent) return {};
          const dict: { [key: string]: any } = {};
          const pairs = dictContent.split(',');
          pairs.forEach(pair => {
            const colonIndex = pair.indexOf(':');
            if (colonIndex !== -1) {
              const key = pair.substring(0, colonIndex).trim();
              const value = pair.substring(colonIndex + 1).trim();
              const keyEval = evaluateExpression(key, vars);
              const valueEval = evaluateExpression(value, vars);
              dict[keyEval] = valueEval;
            }
          });
          return dict;
        }
        
        // Mathematical expressions
        if (/^[\d\s+\-*/%().]+$/.test(expr)) {
          try {
            // Replace variables in math expressions
            let mathExpr = expr;
            Object.keys(vars).forEach(varName => {
              const regex = new RegExp(`\\b${varName}\\b`, 'g');
              mathExpr = mathExpr.replace(regex, String(vars[varName]));
            });
            return Function('"use strict"; return (' + mathExpr + ')')();
          } catch {
            return expr;
          }
        }
        
        // Function calls
        const funcCallMatch = expr.match(/^(\w+)\(([^)]*)\)$/);
        if (funcCallMatch) {
          const funcName = funcCallMatch[1];
          const argsStr = funcCallMatch[2];
          
          if (functions[funcName]) {
            const args = argsStr ? argsStr.split(',').map(arg => evaluateExpression(arg.trim(), vars)) : [];
            return callFunction(funcName, args, functions, vars);
          }
        }
        
        // Method calls on objects (like .get())
        const methodMatch = expr.match(/^(\w+)\.(\w+)\(([^)]*)\)$/);
        if (methodMatch) {
          const objName = methodMatch[1];
          const methodName = methodMatch[2];
          const argsStr = methodMatch[3];
          
          if (vars[objName] && methodName === 'get') {
            const args = argsStr ? argsStr.split(',').map(arg => evaluateExpression(arg.trim(), vars)) : [];
            const obj = vars[objName];
            if (typeof obj === 'object' && obj !== null) {
              return obj[args[0]] !== undefined ? obj[args[0]] : (args[1] !== undefined ? args[1] : undefined);
            }
          }
        }
        
        return expr;
      };

      const evaluateCondition = (condition: string, vars: { [key: string]: any }): boolean => {
        condition = condition.trim();
        
        // Handle modulo operations for even/odd checks
        if (condition.includes('%')) {
          // Replace variables first
          let evalCondition = condition;
          Object.keys(vars).forEach(varName => {
            const regex = new RegExp(`\\b${varName}\\b`, 'g');
            evalCondition = evalCondition.replace(regex, String(vars[varName]));
          });
          
          try {
            return Boolean(Function('"use strict"; return (' + evalCondition + ')')());
          } catch {
            return false;
          }
        }
        
        // Comparison operators
        const operators = ['==', '!=', '>=', '<=', '>', '<'];
        for (const op of operators) {
          if (condition.includes(op)) {
            const parts = condition.split(op);
            if (parts.length === 2) {
              const left = evaluateExpression(parts[0].trim(), vars);
              const right = evaluateExpression(parts[1].trim(), vars);
              
              switch (op) {
                case '==': return left == right;
                case '!=': return left != right;
                case '>=': return left >= right;
                case '<=': return left <= right;
                case '>': return left > right;
                case '<': return left < right;
              }
            }
          }
        }
        
        return Boolean(evaluateExpression(condition, vars));
      };

      const callFunction = (funcName: string, args: any[], functions: { [key: string]: any }, vars: { [key: string]: any }): any => {
        if (!functions[funcName]) return undefined;
        
        const func = functions[funcName];
        const savedVars = { ...vars };
        let returnValue = undefined;
        
        // Set parameters
        args.forEach((arg, index) => {
          if (index < func.params.length) {
            vars[func.params[index]] = arg;
          }
        });
        
        // Execute function body
        const funcResult = executeLines(func.body, vars, functions);
        result += funcResult.output;
        if (funcResult.returnValue !== undefined) {
          returnValue = funcResult.returnValue;
        }
        
        // Restore variables (simple scope simulation)
        Object.keys(savedVars).forEach(key => {
          vars[key] = savedVars[key];
        });
        
        return returnValue;
      };

      const executeLines = (codeLines: string[], vars = variables, funcs = functions): { output: string, returnValue?: any } => {
        let output = '';
        let returnValue = undefined;
        let i = 0;

        while (i < codeLines.length) {
          const line = codeLines[i].trim();
          
          // Skip empty lines and comments
          if (!line || line.startsWith('#')) {
            i++;
            continue;
          }

          // Handle imports (just ignore them)
          if (line.startsWith('import ') || line.startsWith('from ')) {
            i++;
            continue;
          }

          // Handle return statements
          if (line.startsWith('return ')) {
            const returnExpr = line.substring(7).trim();
            returnValue = evaluateExpression(returnExpr, vars);
            break;
          }

          // Handle function definitions
          if (line.startsWith('def ')) {
            const funcMatch = line.match(/def\s+(\w+)\s*\(([^)]*)\)\s*:/);
            if (funcMatch) {
              const funcName = funcMatch[1];
              const params = funcMatch[2] ? funcMatch[2].split(',').map(p => p.trim()).filter(p => p) : [];
              const funcBody: string[] = [];
              
              i++;
              // Collect function body (indented lines)
              while (i < codeLines.length) {
                const bodyLine = codeLines[i];
                if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
                  if (bodyLine.trim()) {
                    funcBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
                  }
                  i++;
                } else {
                  break;
                }
              }
              
              funcs[funcName] = { params, body: funcBody };
              continue;
            }
          }

          // Handle variable assignments
          if (line.includes('=') && !line.includes('==') && !line.includes('!=') && 
              !line.includes('<=') && !line.includes('>=')) {
            const equalIndex = line.indexOf('=');
            const varName = line.substring(0, equalIndex).trim();
            const varValue = line.substring(equalIndex + 1).trim();
            
            if (varValue) {
              vars[varName] = evaluateExpression(varValue, vars);
            }
            i++;
            continue;
          }

          // Handle for loops
          if (line.startsWith('for ')) {
            const forMatch = line.match(/for\s+(\w+)\s+in\s+(.+):/);
            if (forMatch) {
              const iterVar = forMatch[1];
              const iterableExpr = forMatch[2].trim();
              
              let iterable: any[] = [];
              
              // Handle range()
              if (iterableExpr.startsWith('range(')) {
                const rangeMatch = iterableExpr.match(/range\(([^)]+)\)/);
                if (rangeMatch) {
                  const rangeArgs = rangeMatch[1].split(',').map(a => {
                    const trimmed = a.trim();
                    return vars[trimmed] !== undefined ? vars[trimmed] : parseInt(trimmed);
                  });
                  if (rangeArgs.length === 1) {
                    iterable = Array.from({length: rangeArgs[0]}, (_, idx) => idx);
                  } else if (rangeArgs.length === 2) {
                    iterable = Array.from({length: rangeArgs[1] - rangeArgs[0]}, (_, idx) => idx + rangeArgs[0]);
                  }
                }
              }
              // Handle lists and variables
              else {
                const evaluated = evaluateExpression(iterableExpr, vars);
                iterable = Array.isArray(evaluated) ? evaluated : [evaluated];
              }

              // Find loop body
              const loopBody: string[] = [];
              i++;
              while (i < codeLines.length) {
                const bodyLine = codeLines[i];
                if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
                  if (bodyLine.trim()) {
                    loopBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
                  }
                  i++;
                } else {
                  break;
                }
              }

              // Execute loop
              for (const item of iterable) {
                vars[iterVar] = item;
                const loopResult = executeLines(loopBody, vars, funcs);
                output += loopResult.output;
              }
              continue;
            }
          }

          // Handle if statements
          if (line.startsWith('if ')) {
            const condition = line.replace('if ', '').replace(':', '').trim();
            const conditionResult = evaluateCondition(condition, vars);
            
            // Find if body
            const ifBody: string[] = [];
            i++;
            while (i < codeLines.length) {
              const bodyLine = codeLines[i];
              if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
                if (bodyLine.trim()) {
                  ifBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
                }
                i++;
              } else {
                break;
              }
            }

            if (conditionResult) {
              const ifResult = executeLines(ifBody, vars, funcs);
              output += ifResult.output;
            }
            continue;
          }

          // Handle elif statements
          if (line.startsWith('elif ')) {
            const condition = line.replace('elif ', '').replace(':', '').trim();
            const conditionResult = evaluateCondition(condition, vars);
            
            // Find elif body
            const elifBody: string[] = [];
            i++;
            while (i < codeLines.length) {
              const bodyLine = codeLines[i];
              if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
                if (bodyLine.trim()) {
                  elifBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
                }
                i++;
              } else {
                break;
              }
            }

            if (conditionResult) {
              const elifResult = executeLines(elifBody, vars, funcs);
              output += elifResult.output;
            }
            continue;
          }

          // Handle else statements
          if (line === 'else:') {
            // Find else body
            const elseBody: string[] = [];
            i++;
            while (i < codeLines.length) {
              const bodyLine = codeLines[i];
              if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
                if (bodyLine.trim()) {
                  elseBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
                }
                i++;
              } else {
                break;
              }
            }

            const elseResult = executeLines(elseBody, vars, funcs);
            output += elseResult.output;
            continue;
          }

          // Handle try-except blocks
          if (line.startsWith('try:')) {
            const tryBody: string[] = [];
            const exceptBody: string[] = [];
            const finallyBody: string[] = [];
            let currentSection = 'try';
            
            i++;
            while (i < codeLines.length) {
              const bodyLine = codeLines[i];
              
              if (bodyLine.trim().startsWith('except')) {
                currentSection = 'except';
                i++;
                continue;
              } else if (bodyLine.trim() === 'finally:') {
                currentSection = 'finally';
                i++;
                continue;
              }
              
              if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
                if (bodyLine.trim()) {
                  const cleanLine = bodyLine.replace(/^    /, '').replace(/^\t/, '');
                  if (currentSection === 'try') {
                    tryBody.push(cleanLine);
                  } else if (currentSection === 'except') {
                    exceptBody.push(cleanLine);
                  } else if (currentSection === 'finally') {
                    finallyBody.push(cleanLine);
                  }
                }
                i++;
              } else {
                break;
              }
            }

            try {
              const tryResult = executeLines(tryBody, vars, funcs);
              output += tryResult.output;
            } catch (error) {
              const exceptResult = executeLines(exceptBody, vars, funcs);
              output += exceptResult.output;
            } finally {
              if (finallyBody.length > 0) {
                const finallyResult = executeLines(finallyBody, vars, funcs);
                output += finallyResult.output;
              }
            }
            continue;
          }

          // Handle print statements
          if (line.startsWith('print(')) {
            const match = line.match(/print\((.*)\)/);
            if (match) {
              let content = match[1].trim();
              const evaluated = evaluateExpression(content, vars);
              output += evaluated + '\n';
            }
            i++;
            continue;
          }

          // Handle function calls
          const funcCallMatch = line.match(/^(\w+)\(([^)]*)\)$/);
          if (funcCallMatch) {
            const funcName = funcCallMatch[1];
            const argsStr = funcCallMatch[2];
            
            if (funcs[funcName]) {
              const args = argsStr ? argsStr.split(',').map(arg => evaluateExpression(arg.trim(), vars)) : [];
              callFunction(funcName, args, funcs, vars);
            }
            i++;
            continue;
          }

          // Handle method calls (like append, split, etc.)
          const methodCallMatch = line.match(/^(\w+)\.(\w+)\(([^)]*)\)$/);
          if (methodCallMatch) {
            const objName = methodCallMatch[1];
            const methodName = methodCallMatch[2];
            const argsStr = methodCallMatch[3];
            
            if (vars[objName]) {
              const args = argsStr ? argsStr.split(',').map(arg => evaluateExpression(arg.trim(), vars)) : [];
              
              if (methodName === 'append' && Array.isArray(vars[objName])) {
                vars[objName].push(args[0]);
              } else if (methodName === 'split' && typeof vars[objName] === 'string') {
                const delimiter = args[0] || ' ';
                vars[objName] = vars[objName].split(delimiter);
              } else if (methodName === 'lower' && typeof vars[objName] === 'string') {
                vars[objName] = vars[objName].toLowerCase();
              }
            }
            i++;
            continue;
          }

          // Skip other unhandled statements
          i++;
        }

        return { output, returnValue };
      };

      const executionResult = executeLines(lines);
      result = executionResult.output;

      if (!result.trim()) {
        result = 'Code executed successfully (no output)';
      }

      setOutput(result.trim());
      setShowOutput(true);
      onCodeRun?.(code);
    } catch (error) {
      setOutput('Error: ' + (error as Error).message);
      setShowOutput(true);
    }
  };

  return (
    <Card className="bg-slate-900 p-6">
      <h3 className="text-white text-lg font-semibold mb-4">Try it yourself:</h3>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-40 bg-slate-800 text-green-400 font-mono p-4 rounded border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="# Write your Python code here..."
      />
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={runCode}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Play className="w-4 h-4 mr-2" />
          Run Code
        </Button>
      </div>
      {showOutput && (
        <div className="mt-4 bg-slate-800 text-white p-4 rounded">
          <h4 className="text-sm text-slate-400 mb-2">Output:</h4>
          <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </Card>
  );
}
