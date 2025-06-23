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
    // Enhanced Python code simulation
    try {
      const lines = code.split('\n');
      let result = '';
      let variables: { [key: string]: any } = {};
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        
        // Skip empty lines and comments
        if (!trimmedLine || trimmedLine.startsWith('#')) {
          return;
        }
        
        // Handle variable assignments
        if (trimmedLine.includes('=') && !trimmedLine.includes('==') && !trimmedLine.includes('!=') && !trimmedLine.includes('<=') && !trimmedLine.includes('>=')) {
          const [varName, varValue] = trimmedLine.split('=').map(s => s.trim());
          if (varValue) {
            // Simple evaluation of strings and numbers
            if ((varValue.startsWith('"') && varValue.endsWith('"')) || 
                (varValue.startsWith("'") && varValue.endsWith("'"))) {
              variables[varName] = varValue.slice(1, -1);
            } else if (!isNaN(Number(varValue))) {
              variables[varName] = Number(varValue);
            } else {
              variables[varName] = varValue;
            }
          }
          return;
        }
        
        // Handle print statements
        if (trimmedLine.startsWith('print(')) {
          const match = trimmedLine.match(/print\((.*)\)/);
          if (match) {
            let content = match[1].trim();
            
            // Handle string literals
            if ((content.startsWith('"') && content.endsWith('"')) || 
                (content.startsWith("'") && content.endsWith("'"))) {
              result += content.slice(1, -1) + '\n';
            }
            // Handle variables
            else if (variables.hasOwnProperty(content)) {
              result += variables[content] + '\n';
            }
            // Handle simple expressions like f-strings (basic)
            else if (content.startsWith('f"') || content.startsWith("f'")) {
              let fstring = content.slice(2, -1);
              // Replace variables in f-string
              Object.keys(variables).forEach(varName => {
                const regex = new RegExp(`\\{${varName}\\}`, 'g');
                fstring = fstring.replace(regex, variables[varName]);
              });
              result += fstring + '\n';
            }
            // Handle numbers and simple expressions
            else if (!isNaN(Number(content))) {
              result += content + '\n';
            }
            // Handle simple math operations
            else if (/^[\d\s+\-*/()]+$/.test(content)) {
              try {
                // Basic math evaluation (safe for simple expressions)
                const mathResult = Function('"use strict"; return (' + content + ')')();
                result += mathResult + '\n';
              } catch {
                result += content + '\n';
              }
            }
            else {
              result += content + '\n';
            }
          }
        }
        // Handle other simple statements
        else {
          // For now, just acknowledge the line was processed
          if (trimmedLine.length > 0) {
            result += '# Executed: ' + trimmedLine + '\n';
          }
        }
      });

      if (!result) {
        result = 'Code executed successfully (no output)\n';
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
