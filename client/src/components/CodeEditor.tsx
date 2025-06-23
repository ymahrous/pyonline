
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
      const lines = code.split('\n');
      let result = '';
      let variables: { [key: string]: any } = {};
      let functions: { [key: string]: { params: string[], body: string[] } } = {};
      let i = 0;

      const executeLines = (codeLines: string[], startIndex = 0, endIndex?: number): { output: string, nextIndex: number } => {
        let output = '';
        let currentIndex = startIndex;
        const maxIndex = endIndex !== undefined ? endIndex : codeLines.length;

        while (currentIndex < maxIndex) {
          const line = codeLines[currentIndex].trim();
          
          // Skip empty lines and comments
          if (!line || line.startsWith('#')) {
            currentIndex++;
            continue;
          }

          // Handle function definitions
          if (line.startsWith('def ')) {
            const funcMatch = line.match(/def\s+(\w+)\s*\(([^)]*)\)\s*:/);
            if (funcMatch) {
              const funcName = funcMatch[1];
              const params = funcMatch[2].split(',').map(p => p.trim()).filter(p => p);
              const funcBody: string[] = [];
              
              currentIndex++;
              // Collect function body (indented lines)
              while (currentIndex < codeLines.length) {
                const bodyLine = codeLines[currentIndex];
                if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
                  if (bodyLine.trim()) {
                    funcBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
                  }
                  currentIndex++;
                } else {
                  break;
                }
              }
              
              functions[funcName] = { params, body: funcBody };
              continue;
            }
          }

          // Handle function calls
          if (line.includes('(') && line.includes(')') && !line.startsWith('print(') && !line.includes('=')) {
            const funcCallMatch = line.match(/(\w+)\s*\(([^)]*)\)/);
            if (funcCallMatch) {
              const funcName = funcCallMatch[1];
              const args = funcCallMatch[2].split(',').map(a => a.trim()).filter(a => a);
              
              if (functions[funcName]) {
                const func = functions[funcName];
                const savedVars = { ...variables };
                
                // Set parameters
                args.forEach((arg, index) => {
                  if (index < func.params.length) {
                    const paramName = func.params[index];
                    variables[paramName] = evaluateExpression(arg, variables);
                  }
                });
                
                // Execute function body
                const funcResult = executeLines(func.body);
                output += funcResult.output;
                
                // Restore variables (simple scope simulation)
                variables = savedVars;
              }
            }
            currentIndex++;
            continue;
          }

          // Handle variable assignments
          if (line.includes('=') && !line.includes('==') && !line.includes('!=') && 
              !line.includes('<=') && !line.includes('>=') && !line.includes('+=') && 
              !line.includes('-=') && !line.includes('*=') && !line.includes('/=')) {
            const [varName, varValue] = line.split('=').map(s => s.trim());
            if (varValue) {
              variables[varName] = evaluateExpression(varValue, variables);
            }
            currentIndex++;
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
                  const rangeArgs = rangeMatch[1].split(',').map(a => parseInt(a.trim()));
                  if (rangeArgs.length === 1) {
                    iterable = Array.from({length: rangeArgs[0]}, (_, i) => i);
                  } else if (rangeArgs.length === 2) {
                    iterable = Array.from({length: rangeArgs[1] - rangeArgs[0]}, (_, i) => i + rangeArgs[0]);
                  }
                }
              }
              // Handle lists
              else if (iterableExpr.startsWith('[') && iterableExpr.endsWith(']')) {
                const listContent = iterableExpr.slice(1, -1);
                iterable = listContent.split(',').map(item => evaluateExpression(item.trim(), variables));
              }
              // Handle variables
              else if (variables[iterableExpr]) {
                iterable = Array.isArray(variables[iterableExpr]) ? variables[iterableExpr] : [variables[iterableExpr]];
              }

              // Find loop body
              const loopBody: string[] = [];
              currentIndex++;
              while (currentIndex < codeLines.length) {
                const bodyLine = codeLines[currentIndex];
                if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
                  if (bodyLine.trim()) {
                    loopBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
                  }
                  currentIndex++;
                } else {
                  break;
                }
              }

              // Execute loop
              for (const item of iterable) {
                variables[iterVar] = item;
                const loopResult = executeLines(loopBody);
                output += loopResult.output;
              }
              continue;
            }
          }

          // Handle if statements
          if (line.startsWith('if ')) {
            const condition = line.replace('if ', '').replace(':', '').trim();
            const conditionResult = evaluateCondition(condition, variables);
            
            // Find if body
            const ifBody: string[] = [];
            currentIndex++;
            while (currentIndex < codeLines.length) {
              const bodyLine = codeLines[currentIndex];
              if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
                if (bodyLine.trim()) {
                  ifBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
                }
                currentIndex++;
              } else {
                break;
              }
            }

            if (conditionResult) {
              const ifResult = executeLines(ifBody);
              output += ifResult.output;
            }
            continue;
          }

          // Handle print statements
          if (line.startsWith('print(')) {
            const match = line.match(/print\((.*)\)/);
            if (match) {
              let content = match[1].trim();
              const evaluated = evaluateExpression(content, variables);
              output += evaluated + '\n';
            }
            currentIndex++;
            continue;
          }

          // Handle try-except blocks
          if (line.startsWith('try:')) {
            const tryBody: string[] = [];
            const exceptBody: string[] = [];
            let inExcept = false;
            
            currentIndex++;
            while (currentIndex < codeLines.length) {
              const bodyLine = codeLines[currentIndex];
              if (bodyLine.trim().startsWith('except')) {
                inExcept = true;
                currentIndex++;
                continue;
              }
              
              if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
                if (bodyLine.trim()) {
                  const cleanLine = bodyLine.replace(/^    /, '').replace(/^\t/, '');
                  if (inExcept) {
                    exceptBody.push(cleanLine);
                  } else {
                    tryBody.push(cleanLine);
                  }
                }
                currentIndex++;
              } else {
                break;
              }
            }

            try {
              const tryResult = executeLines(tryBody);
              output += tryResult.output;
            } catch (error) {
              const exceptResult = executeLines(exceptBody);
              output += exceptResult.output;
            }
            continue;
          }

          // Handle other statements
          currentIndex++;
        }

        return { output, nextIndex: currentIndex };
      };

      const evaluateExpression = (expr: string, vars: { [key: string]: any }): any => {
        expr = expr.trim();
        
        // String literals
        if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
          return expr.slice(1, -1);
        }
        
        // F-strings
        if (expr.startsWith('f"') || expr.startsWith("f'")) {
          let fstring = expr.slice(2, -1);
          Object.keys(vars).forEach(varName => {
            const regex = new RegExp(`\\{${varName}\\}`, 'g');
            fstring = fstring.replace(regex, vars[varName]);
          });
          return fstring;
        }
        
        // Numbers
        if (!isNaN(Number(expr))) {
          return Number(expr);
        }
        
        // Variables
        if (vars.hasOwnProperty(expr)) {
          return vars[expr];
        }
        
        // Lists
        if (expr.startsWith('[') && expr.endsWith(']')) {
          const listContent = expr.slice(1, -1);
          if (!listContent.trim()) return [];
          return listContent.split(',').map(item => evaluateExpression(item.trim(), vars));
        }
        
        // Dictionaries
        if (expr.startsWith('{') && expr.endsWith('}')) {
          const dictContent = expr.slice(1, -1);
          if (!dictContent.trim()) return {};
          const dict: { [key: string]: any } = {};
          const pairs = dictContent.split(',');
          pairs.forEach(pair => {
            const [key, value] = pair.split(':');
            if (key && value) {
              const keyEval = evaluateExpression(key.trim(), vars);
              const valueEval = evaluateExpression(value.trim(), vars);
              dict[keyEval] = valueEval;
            }
          });
          return dict;
        }
        
        // Simple math expressions
        if (/^[\d\s+\-*/()%]+$/.test(expr)) {
          try {
            return Function('"use strict"; return (' + expr + ')')();
          } catch {
            return expr;
          }
        }
        
        // String formatting
        if (expr.includes('%')) {
          Object.keys(vars).forEach(varName => {
            expr = expr.replace(new RegExp(`\\b${varName}\\b`, 'g'), vars[varName]);
          });
        }
        
        return expr;
      };

      const evaluateCondition = (condition: string, vars: { [key: string]: any }): boolean => {
        // Replace variables in condition
        let evalCondition = condition;
        Object.keys(vars).forEach(varName => {
          evalCondition = evalCondition.replace(new RegExp(`\\b${varName}\\b`, 'g'), vars[varName]);
        });
        
        // Handle common comparisons
        if (evalCondition.includes('==')) {
          const [left, right] = evalCondition.split('==').map(s => s.trim());
          return evaluateExpression(left, vars) == evaluateExpression(right, vars);
        }
        if (evalCondition.includes('!=')) {
          const [left, right] = evalCondition.split('!=').map(s => s.trim());
          return evaluateExpression(left, vars) != evaluateExpression(right, vars);
        }
        if (evalCondition.includes('>=')) {
          const [left, right] = evalCondition.split('>=').map(s => s.trim());
          return evaluateExpression(left, vars) >= evaluateExpression(right, vars);
        }
        if (evalCondition.includes('<=')) {
          const [left, right] = evalCondition.split('<=').map(s => s.trim());
          return evaluateExpression(left, vars) <= evaluateExpression(right, vars);
        }
        if (evalCondition.includes('>')) {
          const [left, right] = evalCondition.split('>').map(s => s.trim());
          return evaluateExpression(left, vars) > evaluateExpression(right, vars);
        }
        if (evalCondition.includes('<')) {
          const [left, right] = evalCondition.split('<').map(s => s.trim());
          return evaluateExpression(left, vars) < evaluateExpression(right, vars);
        }
        
        // Handle modulo operations for even/odd checks
        if (evalCondition.includes('%')) {
          try {
            return Boolean(Function('"use strict"; return (' + evalCondition + ')')());
          } catch {
            return false;
          }
        }
        
        return Boolean(evaluateExpression(evalCondition, vars));
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
