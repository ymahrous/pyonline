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
    // Simple simulation of Python print statements
    try {
      const lines = code.split('\n');
      let result = '';
      
      lines.forEach(line => {
        if (line.trim().startsWith('print(')) {
          const match = line.match(/print\((.*)\)/);
          if (match) {
            let content = match[1];
            // Simple string evaluation (very basic)
            if (content.startsWith('"') && content.endsWith('"')) {
              result += content.slice(1, -1) + '\n';
            } else if (content.startsWith("'") && content.endsWith("'")) {
              result += content.slice(1, -1) + '\n';
            } else {
              result += '> ' + content + '\n';
            }
          }
        }
      });

      if (!result) {
        result = 'Code executed successfully (no output)';
      }

      setOutput(result);
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
