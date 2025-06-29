import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CodeEditorProps {
  initialCode: string;
  onCodeRun?: (code: string) => void;
}

declare global {
  interface Window {
    __PYODIDE_INSTANCE__?: any;
    loadPyodide: any;
  }
}

export default function CodeEditor({ initialCode, onCodeRun }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [pyodide, setPyodide] = useState<null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const initPyodide = async () => {
    if ((window as any).__PYODIDE_INSTANCE__) {
      setPyodide((window as any).__PYODIDE_INSTANCE__);
      setLoading(false);
      return;
    }

    const load = async () => {
      const instance = await (window as any).loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
      });
      (window as any).__PYODIDE_INSTANCE__ = instance;
      setPyodide(instance);
      setLoading(false);
    };

    // Load script if needed
    if (!(window as any).loadPyodide) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
      script.onload = load;
      script.onerror = (e) => console.error("Pyodide load error", e);
      document.body.appendChild(script);
    } else {
      load();
    }
  };
    initPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodide) return;

    setOutput("");
    setShowOutput(false);

    pyodide.setStdout({
      batched: (msg: string) => {
        // Ensure newlines are respected
        setOutput((prev) => prev + msg + (msg.endsWith("\n") ? "" : "\n"));
      },
    });

    pyodide.setStderr({
      batched: (msg: string) => {
        setOutput((prev) => prev + "Error: " + msg);
      },
    });

    try {
      await pyodide.runPythonAsync(code);
    } catch (err: any) {
      setOutput("Error: " + err.toString());
    }

    setShowOutput(true);
    if (onCodeRun) onCodeRun(code);
  };

  return(
    <Card className="bg-slate-900 p-6">
      <h3 className="text-white text-lg font-semibold mb-4">Try it yourself:</h3>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-40 bg-slate-800 text-green-400 font-mono p-4 rounded border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="# Write your Python code here..."
      />
      <div className="flex justify-between items-center mt-4">
        {/* {loading ? (<p className="text-slate-400">Loading Python runtime...</p>):( */}
        <Button onClick={runCode} className="bg-green-600 hover:bg-green-700 text-white">
          <Play className="w-4 h-4 mr-2" />
          Run Code
        </Button>
        {/* )} */}
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

// import { Play } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { loadPyodide, PyodideInterface } from "pyodide";
// interface CodeEditorProps {
//   initialCode: string;
//   onCodeRun?: (code: string) => void;
// }

// export default function CodeEditor({ initialCode, onCodeRun }: CodeEditorProps) {
//   const [code, setCode] = useState(initialCode);
//   const [output, setOutput] = useState("");
//   const [showOutput, setShowOutput] = useState(false);
//   const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const initPyodide = async () => {
//       const py = await loadPyodide();
//       setPyodide(py);
//       setLoading(false);
//     };
//     initPyodide();
//   }, []);
//   const runCode = async () => {
//     if (!pyodide) return;
//     setOutput("");
//     setShowOutput(false);
//     pyodide.setStdout({
//       batched: (msg: string) => {
//         // Ensure newlines are respected
//         setOutput((prev) => prev + msg + (msg.endsWith("\n") ? "" : "\n"));
//       },
//     });
//     try {
//       await pyodide.runPythonAsync(code);
//     } catch (err: any) {
//       setOutput("Error: " + err.toString());
//     }
//     setShowOutput(true);
//     if (onCodeRun) onCodeRun(code);
//   };

//   return(
//     <Card className="bg-slate-900 p-6">
//       <h3 className="text-white text-lg font-semibold mb-4">Try it yourself:</h3>
//       <textarea
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         className="w-full h-40 bg-slate-800 text-green-400 font-mono p-4 rounded border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//         placeholder="# Write your Python code here..."
//       />
//       <div className="flex justify-between items-center mt-4">
//         <Button
//           onClick={runCode}
//           className="bg-green-600 hover:bg-green-700 text-white"
//         >
//           <Play className="w-4 h-4 mr-2" />
//           Run Code
//         </Button>
//       </div>
//       {showOutput && (
//         <div className="mt-4 bg-slate-800 text-white p-4 rounded">
//           <h4 className="text-sm text-slate-400 mb-2">Output:</h4>
//           <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
//         </div>
//       )}
//     </Card>
//   );
// }

// const runCode = () => {
  //   try {
  //     const lines = code.split('\n').map(line => line.trimRight());
  //     let result = '';
  //     let variables: { [key: string]: any } = {};
  //     let functions: { [key: string]: { params: string[], body: string[], defaults?: any[] } } = {};
  //     let classes: { [key: string]: { methods: { [key: string]: any }, attributes: { [key: string]: any } } } = {};

  //     // Built-in functions
  //     const builtins = {
  //       len: (obj: any) => {
  //         if (typeof obj === 'string' || Array.isArray(obj)) return obj.length;
  //         if (typeof obj === 'object' && obj !== null) return Object.keys(obj).length;
  //         return 0;
  //       },
  //       str: (obj: any) => String(obj),
  //       int: (obj: any) => {
  //         const num = parseInt(obj);
  //         if (isNaN(num)) throw new Error(`invalid literal for int(): '${obj}'`);
  //         return num;
  //       },
  //       float: (obj: any) => {
  //         const num = parseFloat(obj);
  //         if (isNaN(num)) throw new Error(`could not convert string to float: '${obj}'`);
  //         return num;
  //       },
  //       bool: (obj: any) => Boolean(obj),
  //       list: (obj: any) => Array.isArray(obj) ? obj : [obj],
  //       dict: (obj: any) => obj || {},
  //       type: (obj: any) => {
  //         if (obj === null) return "<class 'NoneType'>";
  //         if (typeof obj === 'string') return "<class 'str'>";
  //         if (typeof obj === 'number') return Number.isInteger(obj) ? "<class 'int'>" : "<class 'float'>";
  //         if (typeof obj === 'boolean') return "<class 'bool'>";
  //         if (Array.isArray(obj)) return "<class 'list'>";
  //         if (typeof obj === 'object') return "<class 'dict'>";
  //         return "<class 'object'>";
  //       },
  //       abs: (num: number) => Math.abs(num),
  //       max: (...args: any[]) => {
  //         if (args.length === 1 && Array.isArray(args[0])) {
  //           return Math.max(...args[0]);
  //         }
  //         return Math.max(...args);
  //       },
  //       min: (...args: any[]) => {
  //         if (args.length === 1 && Array.isArray(args[0])) {
  //           return Math.min(...args[0]);
  //         }
  //         return Math.min(...args);
  //       },
  //       sum: (arr: any[], start = 0) => Array.isArray(arr) ? arr.reduce((a, b) => a + b, start) : start,
  //       round: (num: number, digits = 0) => Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits),
  //       sorted: (arr: any[], reverse = false) => {
  //         const sorted = [...arr].sort();
  //         return reverse ? sorted.reverse() : sorted;
  //       },
  //       reversed: (arr: any[]) => [...arr].reverse(),
  //       enumerate: (arr: any[], start = 0) => arr.map((item, i) => [i + start, item]),
  //       zip: (...arrays: any[][]) => {
  //         const minLength = Math.min(...arrays.map(arr => arr.length));
  //         return Array.from({ length: minLength }, (_, i) => arrays.map(arr => arr[i]));
  //       },
  //       range: (start: number, stop?: number, step = 1) => {
  //         if (stop === undefined) {
  //           stop = start;
  //           start = 0;
  //         }
  //         const result = [];
  //         for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
  //           result.push(i);
  //         }
  //         return result;
  //       }
  //     };

  //     const evaluateExpression = (expr: string, vars: { [key: string]: any }): any => {
  //       expr = expr.trim();
        
  //       // Handle None
  //       if (expr === 'None') return null;
  //       if (expr === 'True') return true;
  //       if (expr === 'False') return false;
        
  //       // String literals (including triple quotes)
  //       if ((expr.startsWith('"') && expr.endsWith('"')) || 
  //           (expr.startsWith("'") && expr.endsWith("'")) ||
  //           (expr.startsWith('"""') && expr.endsWith('"""')) ||
  //           (expr.startsWith("'''") && expr.endsWith("'''"))) {
  //         if (expr.startsWith('"""') || expr.startsWith("'''")) {
  //           return expr.slice(3, -3);
  //         }
  //         return expr.slice(1, -1);
  //       }
        
  //       // F-strings with more complex expressions
  //       if (expr.startsWith('f"') || expr.startsWith("f'")) {
  //         let fstring = expr.slice(2, -1);
  //         fstring = fstring.replace(/\{([^}]+)\}/g, (match, expression) => {
  //           try {
  //             const result = evaluateExpression(expression.trim(), vars);
  //             return String(result);
  //           } catch {
  //             return match;
  //           }
  //         });
  //         return fstring;
  //       }
        
  //       // Numbers (including negative and scientific notation)
  //       if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(expr)) {
  //         return parseFloat(expr);
  //       }
        
  //       // Variables and built-ins
  //       if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr)) {
  //         if (builtins.hasOwnProperty(expr)) return builtins[expr];
  //         if (vars.hasOwnProperty(expr)) return vars[expr];
  //         throw new Error(`name '${expr}' is not defined`);
  //       }
        
  //       // Lists with nested expressions
  //       if (expr.startsWith('[') && expr.endsWith(']')) {
  //         const listContent = expr.slice(1, -1).trim();
  //         if (!listContent) return [];
          
  //         // Handle list comprehensions
  //         if (listContent.includes(' for ')) {
  //           const comprehensionMatch = listContent.match(/^(.+?)\s+for\s+(\w+)\s+in\s+(.+?)(?:\s+if\s+(.+))?$/);
  //           if (comprehensionMatch) {
  //             const [, expression, variable, iterable, condition] = comprehensionMatch;
  //             const iterableValue = evaluateExpression(iterable, vars);
  //             const result = [];
              
  //             for (const item of iterableValue) {
  //               const tempVars = { ...vars, [variable]: item };
  //               if (!condition || evaluateCondition(condition, tempVars)) {
  //                 result.push(evaluateExpression(expression, tempVars));
  //               }
  //             }
  //             return result;
  //           }
  //         }
          
  //         return parseComplexList(listContent, vars);
  //       }
        
  //       // Tuples
  //       if (expr.startsWith('(') && expr.endsWith(')') && expr.includes(',')) {
  //         const tupleContent = expr.slice(1, -1).trim();
  //         return parseComplexList(tupleContent, vars);
  //       }
        
  //       // Dictionaries with complex expressions
  //       if (expr.startsWith('{') && expr.endsWith('}')) {
  //         const dictContent = expr.slice(1, -1).trim();
  //         if (!dictContent) return {};
          
  //         // Handle dict comprehensions
  //         if (dictContent.includes(' for ')) {
  //           const comprehensionMatch = dictContent.match(/^(.+?)\s*:\s*(.+?)\s+for\s+(\w+)\s+in\s+(.+?)(?:\s+if\s+(.+))?$/);
  //           if (comprehensionMatch) {
  //             const [, keyExpr, valueExpr, variable, iterable, condition] = comprehensionMatch;
  //             const iterableValue = evaluateExpression(iterable, vars);
  //             const result: { [key: string]: any } = {};
              
  //             for (const item of iterableValue) {
  //               const tempVars = { ...vars, [variable]: item };
  //               if (!condition || evaluateCondition(condition, tempVars)) {
  //                 const key = evaluateExpression(keyExpr, tempVars);
  //                 const value = evaluateExpression(valueExpr, tempVars);
  //                 result[key] = value;
  //               }
  //             }
  //             return result;
  //           }
  //         }
          
  //         return parseComplexDict(dictContent, vars);
  //       }
        
  //       // Set literals
  //       if (expr.startsWith('{') && expr.endsWith('}') && !expr.includes(':')) {
  //         const setContent = expr.slice(1, -1).trim();
  //         if (!setContent) return new Set();
  //         const items = parseComplexList(setContent, vars);
  //         return new Set(items);
  //       }
        
  //       // Attribute access (object.attribute)
  //       if (expr.includes('.') && !expr.includes('(')) {
  //         const parts = expr.split('.');
  //         let obj = evaluateExpression(parts[0], vars);
  //         for (let i = 1; i < parts.length; i++) {
  //           if (obj && typeof obj === 'object') {
  //             obj = obj[parts[i]];
  //           } else {
  //             throw new Error(`'${typeof obj}' object has no attribute '${parts[i]}'`);
  //           }
  //         }
  //         return obj;
  //       }
        
  //       // Array/dict indexing and slicing
  //       if (expr.includes('[') && expr.includes(']')) {
  //         const match = expr.match(/^(.+?)\[(.+?)\]$/);
  //         if (match) {
  //           const [, objExpr, indexExpr] = match;
  //           const obj = evaluateExpression(objExpr, vars);
            
  //           // Handle slicing
  //           if (indexExpr.includes(':')) {
  //             const sliceParts = indexExpr.split(':');
  //             const start = sliceParts[0] ? evaluateExpression(sliceParts[0], vars) : 0;
  //             const end = sliceParts[1] ? evaluateExpression(sliceParts[1], vars) : obj.length;
  //             const step = sliceParts[2] ? evaluateExpression(sliceParts[2], vars) : 1;
              
  //             if (Array.isArray(obj) || typeof obj === 'string') {
  //               const result = [];
  //               for (let i = start; i < end; i += step) {
  //                 if (i >= 0 && i < obj.length) {
  //                   result.push(obj[i]);
  //                 }
  //               }
  //               return typeof obj === 'string' ? result.join('') : result;
  //             }
  //           } else {
  //             const index = evaluateExpression(indexExpr, vars);
  //             if (Array.isArray(obj) || typeof obj === 'string') {
  //               const actualIndex = index < 0 ? obj.length + index : index;
  //               if (actualIndex < 0 || actualIndex >= obj.length) {
  //                 throw new Error('list index out of range');
  //               }
  //               return obj[actualIndex];
  //             } else if (typeof obj === 'object' && obj !== null) {
  //               return obj[index];
  //             }
  //           }
  //         }
  //       }
        
  //       // Function calls
  //       const funcCallMatch = expr.match(/^(\w+)\(([^)]*)\)$/);
  //       if (funcCallMatch) {
  //         const funcName = funcCallMatch[1];
  //         const argsStr = funcCallMatch[2];
          
  //         // Built-in functions
  //         if (builtins.hasOwnProperty(funcName)) {
  //           const args = argsStr ? parseArgumentList(argsStr, vars) : [];
  //           return builtins[funcName](...args);
  //         }
          
  //         // User-defined functions
  //         if (functions[funcName]) {
  //           const args = argsStr ? parseArgumentList(argsStr, vars) : [];
  //           return callFunction(funcName, args, functions, vars);
  //         }
          
  //         throw new Error(`'${funcName}' is not defined`);
  //       }
        
  //       // Method calls
  //       const methodMatch = expr.match(/^(.+?)\.(\w+)\(([^)]*)\)$/);
  //       if (methodMatch) {
  //         const [, objExpr, methodName, argsStr] = methodMatch;
  //         const obj = evaluateExpression(objExpr, vars);
  //         const args = argsStr ? parseArgumentList(argsStr, vars) : [];
          
  //         return callMethod(obj, methodName, args, vars);
  //       }
        
  //       // Binary operations
  //       const binaryOps = [
  //         { op: '**', fn: (a: any, b: any) => Math.pow(a, b) },
  //         { op: '*', fn: (a: any, b: any) => a * b },
  //         { op: '/', fn: (a: any, b: any) => a / b },
  //         { op: '//', fn: (a: any, b: any) => Math.floor(a / b) },
  //         { op: '%', fn: (a: any, b: any) => a % b },
  //         { op: '+', fn: (a: any, b: any) => a + b },
  //         { op: '-', fn: (a: any, b: any) => a - b }
  //       ];
        
  //       for (const { op, fn } of binaryOps) {
  //         if (expr.includes(op)) {
  //           const parts = expr.split(op);
  //           if (parts.length === 2) {
  //             const left = evaluateExpression(parts[0].trim(), vars);
  //             const right = evaluateExpression(parts[1].trim(), vars);
  //             return fn(left, right);
  //           }
  //         }
  //       }
        
  //       // Parenthesized expressions
  //       if (expr.startsWith('(') && expr.endsWith(')') && !expr.includes(',')) {
  //         return evaluateExpression(expr.slice(1, -1), vars);
  //       }
        
  //       throw new Error(`invalid syntax: ${expr}`);
  //     };

  //     const parseComplexList = (content: string, vars: { [key: string]: any }): any[] => {
  //       const items = [];
  //       let current = '';
  //       let depth = 0;
  //       let inString = false;
  //       let stringChar = '';
        
  //       for (let i = 0; i < content.length; i++) {
  //         const char = content[i];
  //         const prevChar = content[i - 1];
          
  //         if (!inString && (char === '"' || char === "'")) {
  //           inString = true;
  //           stringChar = char;
  //         } else if (inString && char === stringChar && prevChar !== '\\') {
  //           inString = false;
  //           stringChar = '';
  //         }
          
  //         if (!inString) {
  //           if (char === '[' || char === '(' || char === '{') {
  //             depth++;
  //           } else if (char === ']' || char === ')' || char === '}') {
  //             depth--;
  //           } else if (char === ',' && depth === 0) {
  //             items.push(evaluateExpression(current.trim(), vars));
  //             current = '';
  //             continue;
  //           }
  //         }
          
  //         current += char;
  //       }
        
  //       if (current.trim()) {
  //         items.push(evaluateExpression(current.trim(), vars));
  //       }
        
  //       return items;
  //     };

  //     const parseComplexDict = (content: string, vars: { [key: string]: any }): { [key: string]: any } => {
  //       const dict: { [key: string]: any } = {};
  //       let current = '';
  //       let depth = 0;
  //       let inString = false;
  //       let stringChar = '';
        
  //       for (let i = 0; i < content.length; i++) {
  //         const char = content[i];
  //         const prevChar = content[i - 1];
          
  //         if (!inString && (char === '"' || char === "'")) {
  //           inString = true;
  //           stringChar = char;
  //         } else if (inString && char === stringChar && prevChar !== '\\') {
  //           inString = false;
  //           stringChar = '';
  //         }
          
  //         if (!inString) {
  //           if (char === '[' || char === '(' || char === '{') {
  //             depth++;
  //           } else if (char === ']' || char === ')' || char === '}') {
  //             depth--;
  //           } else if (char === ',' && depth === 0) {
  //             const colonIndex = current.indexOf(':');
  //             if (colonIndex !== -1) {
  //               const key = evaluateExpression(current.substring(0, colonIndex).trim(), vars);
  //               const value = evaluateExpression(current.substring(colonIndex + 1).trim(), vars);
  //               dict[key] = value;
  //             }
  //             current = '';
  //             continue;
  //           }
  //         }
          
  //         current += char;
  //       }
        
  //       if (current.trim()) {
  //         const colonIndex = current.indexOf(':');
  //         if (colonIndex !== -1) {
  //           const key = evaluateExpression(current.substring(0, colonIndex).trim(), vars);
  //           const value = evaluateExpression(current.substring(colonIndex + 1).trim(), vars);
  //           dict[key] = value;
  //         }
  //       }
        
  //       return dict;
  //     };

  //     const parseArgumentList = (argsStr: string, vars: { [key: string]: any }): any[] => {
  //       if (!argsStr.trim()) return [];
        
  //       const args = [];
  //       let current = '';
  //       let depth = 0;
  //       let inString = false;
  //       let stringChar = '';
        
  //       for (let i = 0; i < argsStr.length; i++) {
  //         const char = argsStr[i];
  //         const prevChar = argsStr[i - 1];
          
  //         if (!inString && (char === '"' || char === "'")) {
  //           inString = true;
  //           stringChar = char;
  //         } else if (inString && char === stringChar && prevChar !== '\\') {
  //           inString = false;
  //           stringChar = '';
  //         }
          
  //         if (!inString) {
  //           if (char === '(' || char === '[' || char === '{') {
  //             depth++;
  //           } else if (char === ')' || char === ']' || char === '}') {
  //             depth--;
  //           } else if (char === ',' && depth === 0) {
  //             args.push(evaluateExpression(current.trim(), vars));
  //             current = '';
  //             continue;
  //           }
  //         }
          
  //         current += char;
  //       }
        
  //       if (current.trim()) {
  //         args.push(evaluateExpression(current.trim(), vars));
  //       }
        
  //       return args;
  //     };

  //     const callMethod = (obj: any, methodName: string, args: any[], vars: { [key: string]: any }): any => {
  //       if (Array.isArray(obj)) {
  //         switch (methodName) {
  //           case 'append':
  //             obj.push(args[0]);
  //             return null;
  //           case 'extend':
  //             obj.push(...args[0]);
  //             return null;
  //           case 'insert':
  //             obj.splice(args[0], 0, args[1]);
  //             return null;
  //           case 'remove':
  //             const index = obj.indexOf(args[0]);
  //             if (index !== -1) obj.splice(index, 1);
  //             return null;
  //           case 'pop':
  //             return args.length > 0 ? obj.splice(args[0], 1)[0] : obj.pop();
  //           case 'index':
  //             const idx = obj.indexOf(args[0]);
  //             if (idx === -1) throw new Error(`${args[0]} is not in list`);
  //             return idx;
  //           case 'count':
  //             return obj.filter(item => item === args[0]).length;
  //           case 'sort':
  //             obj.sort();
  //             return null;
  //           case 'reverse':
  //             obj.reverse();
  //             return null;
  //           case 'copy':
  //             return [...obj];
  //           case 'clear':
  //             obj.length = 0;
  //             return null;
  //         }
  //       }
        
  //       if (typeof obj === 'string') {
  //         switch (methodName) {
  //           case 'upper':
  //             return obj.toUpperCase();
  //           case 'lower':
  //             return obj.toLowerCase();
  //           case 'strip':
  //             return obj.trim();
  //           case 'split':
  //             return args.length > 0 ? obj.split(args[0]) : obj.split();
  //           case 'join':
  //             return args[0].join(obj);
  //           case 'replace':
  //             return obj.replace(new RegExp(args[0], 'g'), args[1]);
  //           case 'startswith':
  //             return obj.startsWith(args[0]);
  //           case 'endswith':
  //             return obj.endsWith(args[0]);
  //           case 'find':
  //             return obj.indexOf(args[0]);
  //           case 'count':
  //             return (obj.match(new RegExp(args[0], 'g')) || []).length;
  //           case 'isdigit':
  //             return /^\d+$/.test(obj);
  //           case 'isalpha':
  //             return /^[a-zA-Z]+$/.test(obj);
  //           case 'isalnum':
  //             return /^[a-zA-Z0-9]+$/.test(obj);
  //         }
  //       }
        
  //       if (typeof obj === 'object' && obj !== null) {
  //         switch (methodName) {
  //           case 'get':
  //             return obj.hasOwnProperty(args[0]) ? obj[args[0]] : (args[1] !== undefined ? args[1] : null);
  //           case 'keys':
  //             return Object.keys(obj);
  //           case 'values':
  //             return Object.values(obj);
  //           case 'items':
  //             return Object.entries(obj);
  //           case 'pop':
  //             const value = obj[args[0]];
  //             delete obj[args[0]];
  //             return value !== undefined ? value : (args[1] !== undefined ? args[1] : null);
  //           case 'clear':
  //             Object.keys(obj).forEach(key => delete obj[key]);
  //             return null;
  //           case 'copy':
  //             return { ...obj };
  //           case 'update':
  //             Object.assign(obj, args[0]);
  //             return null;
  //         }
  //       }
        
  //       throw new Error(`'${typeof obj}' object has no attribute '${methodName}'`);
  //     };

  //     const evaluateCondition = (condition: string, vars: { [key: string]: any }): boolean => {
  //       condition = condition.trim();
        
  //       // Logical operators
  //       if (condition.includes(' and ')) {
  //         const parts = condition.split(' and ');
  //         return parts.every(part => evaluateCondition(part.trim(), vars));
  //       }
        
  //       if (condition.includes(' or ')) {
  //         const parts = condition.split(' or ');
  //         return parts.some(part => evaluateCondition(part.trim(), vars));
  //       }
        
  //       if (condition.startsWith('not ')) {
  //         return !evaluateCondition(condition.substring(4).trim(), vars);
  //       }
        
  //       // 'in' operator
  //       if (condition.includes(' in ')) {
  //         const parts = condition.split(' in ');
  //         if (parts.length === 2) {
  //           const item = evaluateExpression(parts[0].trim(), vars);
  //           const container = evaluateExpression(parts[1].trim(), vars);
            
  //           if (Array.isArray(container) || typeof container === 'string') {
  //             return container.includes(item);
  //           } else if (typeof container === 'object' && container !== null) {
  //             return container.hasOwnProperty(item);
  //           }
  //         }
  //       }
        
  //       // 'is' operator
  //       if (condition.includes(' is ')) {
  //         const parts = condition.split(' is ');
  //         if (parts.length === 2) {
  //           const left = evaluateExpression(parts[0].trim(), vars);
  //           const right = evaluateExpression(parts[1].trim(), vars);
  //           return left === right;
  //         }
  //       }
        
  //       // Comparison operators
  //       const operators = ['==', '!=', '>=', '<=', '>', '<'];
  //       for (const op of operators) {
  //         if (condition.includes(op)) {
  //           const parts = condition.split(op);
  //           if (parts.length === 2) {
  //             const left = evaluateExpression(parts[0].trim(), vars);
  //             const right = evaluateExpression(parts[1].trim(), vars);
              
  //             switch (op) {
  //               case '==': return left == right;
  //               case '!=': return left != right;
  //               case '>=': return left >= right;
  //               case '<=': return left <= right;
  //               case '>': return left > right;
  //               case '<': return left < right;
  //             }
  //           }
  //         }
  //       }
        
  //       // Single value truthiness
  //       return Boolean(evaluateExpression(condition, vars));
  //     };

  //     const callFunction = (funcName: string, args: any[], functions: { [key: string]: any }, vars: { [key: string]: any }): any => {
  //       if (!functions[funcName]) return undefined;
        
  //       const func = functions[funcName];
  //       const savedVars = { ...vars };
  //       let returnValue = null;
        
  //       // Set parameters
  //       args.forEach((arg, index) => {
  //         if (index < func.params.length) {
  //           vars[func.params[index]] = arg;
  //         }
  //       });
        
  //       // Set default parameters
  //       if (func.defaults) {
  //         func.defaults.forEach((defaultVal: any, index: number) => {
  //           const paramIndex = func.params.length - func.defaults.length + index;
  //           if (paramIndex >= args.length) {
  //             vars[func.params[paramIndex]] = defaultVal;
  //           }
  //         });
  //       }
        
  //       // Execute function body
  //       const funcResult = executeLines(func.body, vars, functions);
  //       result += funcResult.output;
  //       if (funcResult.returnValue !== undefined) {
  //         returnValue = funcResult.returnValue;
  //       }
        
  //       // Restore variables
  //       Object.keys(savedVars).forEach(key => {
  //         vars[key] = savedVars[key];
  //       });
        
  //       return returnValue;
  //     };

  //     const executeLines = (codeLines: string[], vars = variables, funcs = functions): { output: string, returnValue?: any } => {
  //       let output = '';
  //       let returnValue = undefined;
  //       let i = 0;

  //       while (i < codeLines.length) {
  //         const line = codeLines[i].trim();
          
  //         // Skip empty lines and comments
  //         if (!line || line.startsWith('#')) {
  //           i++;
  //           continue;
  //         }

  //         // Handle imports (basic support)
  //         if (line.startsWith('import ') || line.startsWith('from ')) {
  //           // For now, just acknowledge imports without actual implementation
  //           i++;
  //           continue;
  //         }

  //         // Handle return statements
  //         if (line.startsWith('return')) {
  //           if (line.length > 6) {
  //             const returnExpr = line.substring(6).trim();
  //             returnValue = evaluateExpression(returnExpr, vars);
  //           } else {
  //             returnValue = null;
  //           }
  //           break;
  //         }

  //         // Handle function definitions with default parameters
  //         if (line.startsWith('def ')) {
  //           const funcMatch = line.match(/def\s+(\w+)\s*\(([^)]*)\)\s*:/);
  //           if (funcMatch) {
  //             const funcName = funcMatch[1];
  //             const paramsStr = funcMatch[2].trim();
              
  //             const params: string[] = [];
  //             const defaults: any[] = [];
              
  //             if (paramsStr) {
  //               const paramList = paramsStr.split(',').map(p => p.trim());
  //               paramList.forEach(param => {
  //                 if (param.includes('=')) {
  //                   const [name, defaultValue] = param.split('=').map(p => p.trim());
  //                   params.push(name);
  //                   defaults.push(evaluateExpression(defaultValue, vars));
  //                 } else {
  //                   params.push(param);
  //                 }
  //               });
  //             }
              
  //             const funcBody: string[] = [];
  //             i++;
              
  //             // Collect function body
  //             while (i < codeLines.length) {
  //               const bodyLine = codeLines[i];
  //               if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
  //                 if (bodyLine.trim()) {
  //                   funcBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
  //                 }
  //                 i++;
  //               } else {
  //                 break;
  //               }
  //             }
              
  //             funcs[funcName] = { 
  //               params, 
  //               body: funcBody,
  //               defaults: defaults.length > 0 ? defaults : undefined
  //             };
  //             continue;
  //           }
  //         }

  //         // Handle class definitions (basic support)
  //         if (line.startsWith('class ')) {
  //           const classMatch = line.match(/class\s+(\w+)(?:\(([^)]*)\))?\s*:/);
  //           if (classMatch) {
  //             const className = classMatch[1];
  //             const parentClass = classMatch[2];
              
  //             const classBody: string[] = [];
  //             i++;
              
  //             while (i < codeLines.length) {
  //               const bodyLine = codeLines[i];
  //               if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
  //                 if (bodyLine.trim()) {
  //                   classBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
  //                 }
  //                 i++;
  //               } else {
  //                 break;
  //               }
  //             }
              
  //             classes[className] = { methods: {}, attributes: {} };
  //             // For simplicity, we'll just store the class definition
  //             // Full class implementation would be much more complex
  //             continue;
  //           }
  //         }

  //         // Handle global and nonlocal statements
  //         if (line.startsWith('global ') || line.startsWith('nonlocal ')) {
  //           // For now, just acknowledge these statements
  //           i++;
  //           continue;
  //         }

  //         // Handle assert statements
  //         if (line.startsWith('assert ')) {
  //           const assertExpr = line.substring(7).trim();
  //           const parts = assertExpr.split(',');
  //           const condition = parts[0].trim();
  //           const message = parts[1] ? evaluateExpression(parts[1].trim(), vars) : 'AssertionError';
            
  //           if (!evaluateCondition(condition, vars)) {
  //             throw new Error(`AssertionError: ${message}`);
  //           }
  //           i++;
  //           continue;
  //         }

  //         // Handle augmented assignments (+=, -=, etc.)
  //         const augmentedOps = ['+=', '-=', '*=', '/=', '//=', '%=', '**='];
  //         let isAugmented = false;
          
  //         for (const op of augmentedOps) {
  //           if (line.includes(op)) {
  //             const parts = line.split(op);
  //             if (parts.length === 2) {
  //               const varName = parts[0].trim();
  //               const value = evaluateExpression(parts[1].trim(), vars);
  //               const currentValue = vars[varName] || 0;
                
  //               switch (op) {
  //                 case '+=': vars[varName] = currentValue + value; break;
  //                 case '-=': vars[varName] = currentValue - value; break;
  //                 case '*=': vars[varName] = currentValue * value; break;
  //                 case '/=': vars[varName] = currentValue / value; break;
  //                 case '//=': vars[varName] = Math.floor(currentValue / value); break;
  //                 case '%=': vars[varName] = currentValue % value; break;
  //                 case '**=': vars[varName] = Math.pow(currentValue, value); break;
  //               }
                
  //               isAugmented = true;
  //               break;
  //             }
  //           }
  //         }
          
  //         if (isAugmented) {
  //           i++;
  //           continue;
  //         }

  //         // Handle multiple assignments
  //         if (line.includes('=') && !line.includes('==') && !line.includes('!=') && 
  //             !line.includes('<=') && !line.includes('>=')) {
  //           const equalIndex = line.indexOf('=');
  //           const leftSide = line.substring(0, equalIndex).trim();
  //           const rightSide = line.substring(equalIndex + 1).trim();
            
  //           // Multiple variable assignment (a, b = 1, 2)
  //           if (leftSide.includes(',')) {
  //             const varNames = leftSide.split(',').map(v => v.trim());
  //             const values = evaluateExpression(rightSide, vars);
              
  //             if (Array.isArray(values)) {
  //               varNames.forEach((varName, index) => {
  //                 vars[varName] = values[index];
  //               });
  //             } else {
  //               // Try to iterate over the value
  //               const iterableValues = Array.from(values);
  //               varNames.forEach((varName, index) => {
  //                 vars[varName] = iterableValues[index];
  //               });
  //             }
  //           } else {
  //             // Regular assignment
  //             vars[leftSide] = evaluateExpression(rightSide, vars);
  //           }
            
  //           i++;
  //           continue;
  //         }

  //         // Handle for loops with more complex iterables
  //         if (line.startsWith('for ')) {
  //           const forMatch = line.match(/for\s+(.+?)\s+in\s+(.+?):/);
  //           if (forMatch) {
  //             const iterVars = forMatch[1].trim();
  //             const iterableExpr = forMatch[2].trim();
              
  //             let iterable: any[] = [];
              
  //             // Handle range()
  //             if (iterableExpr.startsWith('range(')) {
  //               const rangeMatch = iterableExpr.match(/range\(([^)]+)\)/);
  //               if (rangeMatch) {
  //                 const rangeArgs = parseArgumentList(rangeMatch[1], vars);
  //                 iterable = builtins.range(...rangeArgs);
  //               }
  //             }
  //             // Handle enumerate()
  //             else if (iterableExpr.startsWith('enumerate(')) {
  //               const enumMatch = iterableExpr.match(/enumerate\(([^)]+)\)/);
  //               if (enumMatch) {
  //                 const enumArgs = parseArgumentList(enumMatch[1], vars);
  //                 iterable = builtins.enumerate(...enumArgs);
  //               }
  //             }
  //             // Handle zip()
  //             else if (iterableExpr.startsWith('zip(')) {
  //               const zipMatch = iterableExpr.match(/zip\(([^)]+)\)/);
  //               if (zipMatch) {
  //                 const zipArgs = parseArgumentList(zipMatch[1], vars);
  //                 iterable = builtins.zip(...zipArgs);
  //               }
  //             }
  //             // Handle other iterables
  //             else {
  //               const evaluated = evaluateExpression(iterableExpr, vars);
  //               iterable = Array.isArray(evaluated) ? evaluated : [evaluated];
  //             }

  //             // Find loop body
  //             const loopBody: string[] = [];
  //             i++;
  //             while (i < codeLines.length) {
  //               const bodyLine = codeLines[i];
  //               if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
  //                 if (bodyLine.trim()) {
  //                   loopBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
  //                 }
  //                 i++;
  //               } else {
  //                 break;
  //               }
  //             }

  //             // Execute loop
  //             for (const item of iterable) {
  //               if (iterVars.includes(',')) {
  //                 // Multiple iteration variables
  //                 const varNames = iterVars.split(',').map(v => v.trim());
  //                 if (Array.isArray(item)) {
  //                   varNames.forEach((varName, index) => {
  //                     vars[varName] = item[index];
  //                   });
  //                 }
  //               } else {
  //                 vars[iterVars] = item;
  //               }
                
  //               const loopResult = executeLines(loopBody, vars, funcs);
  //               output += loopResult.output;
                
  //               // Handle break and continue (simplified)
  //               if (loopResult.returnValue === 'break') break;
  //               if (loopResult.returnValue === 'continue') continue;
  //             }
  //             continue;
  //           }
  //         }

  //         // Handle while loops
  //         if (line.startsWith('while ')) {
  //           const condition = line.replace('while ', '').replace(':', '').trim();
            
  //           const loopBody: string[] = [];
  //           i++;
  //           while (i < codeLines.length) {
  //             const bodyLine = codeLines[i];
  //             if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
  //               if (bodyLine.trim()) {
  //                 loopBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
  //               }
  //               i++;
  //             } else {
  //               break;
  //             }
  //           }

  //           let iterations = 0;
  //           while (evaluateCondition(condition, vars) && iterations < 1000) {
  //             const loopResult = executeLines(loopBody, vars, funcs);
  //             output += loopResult.output;
              
  //             if (loopResult.returnValue === 'break') break;
  //             iterations++;
  //           }
  //           continue;
  //         }

  //         // Handle if/elif/else with more complex conditions
  //         if (line.startsWith('if ') || line.startsWith('elif ')) {
  //           const keyword = line.startsWith('if ') ? 'if ' : 'elif ';
  //           const condition = line.replace(keyword, '').replace(':', '').trim();
  //           const conditionResult = evaluateCondition(condition, vars);
            
  //           const ifBody: string[] = [];
  //           i++;
  //           while (i < codeLines.length) {
  //             const bodyLine = codeLines[i];
  //             if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
  //               if (bodyLine.trim()) {
  //                 ifBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
  //               }
  //               i++;
  //             } else {
  //               break;
  //             }
  //           }

  //           if (conditionResult) {
  //             const ifResult = executeLines(ifBody, vars, funcs);
  //             output += ifResult.output;
  //           }
  //           continue;
  //         }

  //         // Handle else statements
  //         if (line === 'else:') {
  //           const elseBody: string[] = [];
  //           i++;
  //           while (i < codeLines.length) {
  //             const bodyLine = codeLines[i];
  //             if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
  //               if (bodyLine.trim()) {
  //                 elseBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
  //               }
  //               i++;
  //             } else {
  //               break;
  //             }
  //           }

  //           const elseResult = executeLines(elseBody, vars, funcs);
  //           output += elseResult.output;
  //           continue;
  //         }

  //         // Handle try-except-finally blocks
  //         if (line.startsWith('try:')) {
  //           const tryBody: string[] = [];
  //           const exceptBlocks: { condition?: string, body: string[] }[] = [];
  //           const finallyBody: string[] = [];
  //           let currentSection = 'try';
            
  //           i++;
  //           while (i < codeLines.length) {
  //             const bodyLine = codeLines[i];
              
  //             if (bodyLine.trim().startsWith('except')) {
  //               currentSection = 'except';
  //               const exceptMatch = bodyLine.trim().match(/except(?:\s+(\w+))?\s*:/);
  //               exceptBlocks.push({ 
  //                 condition: exceptMatch ? exceptMatch[1] : undefined, 
  //                 body: [] 
  //               });
  //               i++;
  //               continue;
  //             } else if (bodyLine.trim() === 'finally:') {
  //               currentSection = 'finally';
  //               i++;
  //               continue;
  //             }
              
  //             if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
  //               if (bodyLine.trim()) {
  //                 const cleanLine = bodyLine.replace(/^    /, '').replace(/^\t/, '');
  //                 if (currentSection === 'try') {
  //                   tryBody.push(cleanLine);
  //                 } else if (currentSection === 'except' && exceptBlocks.length > 0) {
  //                   exceptBlocks[exceptBlocks.length - 1].body.push(cleanLine);
  //                 } else if (currentSection === 'finally') {
  //                   finallyBody.push(cleanLine);
  //                 }
  //               }
  //               i++;
  //             } else {
  //               break;
  //             }
  //           }

  //           try {
  //             const tryResult = executeLines(tryBody, vars, funcs);
  //             output += tryResult.output;
  //           } catch (error) {
  //             let handled = false;
  //             for (const exceptBlock of exceptBlocks) {
  //               // For simplicity, catch all exceptions if no specific type
  //               if (!exceptBlock.condition || exceptBlock.condition === 'Exception') {
  //                 const exceptResult = executeLines(exceptBlock.body, vars, funcs);
  //                 output += exceptResult.output;
  //                 handled = true;
  //                 break;
  //               }
  //             }
  //             if (!handled) throw error;
  //           } finally {
  //             if (finallyBody.length > 0) {
  //               const finallyResult = executeLines(finallyBody, vars, funcs);
  //               output += finallyResult.output;
  //             }
  //           }
  //           continue;
  //         }

  //         // Handle with statements (basic support)
  //         if (line.startsWith('with ')) {
  //           // For now, just skip with statements
  //           const withBody: string[] = [];
  //           i++;
  //           while (i < codeLines.length) {
  //             const bodyLine = codeLines[i];
  //             if (bodyLine.trim() === '' || bodyLine.startsWith('    ') || bodyLine.startsWith('\t')) {
  //               if (bodyLine.trim()) {
  //                 withBody.push(bodyLine.replace(/^    /, '').replace(/^\t/, ''));
  //               }
  //               i++;
  //             } else {
  //               break;
  //             }
  //           }
            
  //           // Execute with body (without actual context management)
  //           const withResult = executeLines(withBody, vars, funcs);
  //           output += withResult.output;
  //           continue;
  //         }

  //         // Handle print statements with multiple arguments and formatting
  //         if (line.startsWith('print(')) {
  //           const match = line.match(/print\((.*)\)/);
  //           if (match) {
  //             const argsStr = match[1].trim();
  //             if (argsStr) {
  //               const args = parseArgumentList(argsStr, vars);
  //               const printOutput = args.map(arg => String(arg)).join(' ');
  //               output += printOutput + '\n';
  //             } else {
  //               output += '\n';
  //             }
  //           }
  //           i++;
  //           continue;
  //         }

  //         // Handle standalone expressions and function calls
  //         try {
  //           const result = evaluateExpression(line, vars);
  //           // Only print non-null results for standalone expressions
  //           if (result !== null && result !== undefined && !line.includes('=')) {
  //             // Don't print results for assignments or method calls that return None
  //             if (typeof result !== 'undefined') {
  //               // Only output if it's not a method call that typically returns None
  //               const methodCallMatch = line.match(/\w+\.\w+\(/);
  //               if (!methodCallMatch) {
  //                 output += String(result) + '\n';
  //               }
  //             }
  //           }
  //         } catch (error) {
  //           // If evaluation fails, it might be a statement we don't handle
  //           // Just continue to next line
  //         }

  //         i++;
  //       }

  //       return { output, returnValue };
  //     };

  //     const executionResult = executeLines(lines);
  //     result = executionResult.output;

  //     if (!result.trim()) {
  //       result = 'Code executed successfully (no output)';
  //     }

  //     setOutput(result.trim());
  //     setShowOutput(true);
  //     onCodeRun?.(code);
  //   } catch (error) {
  //     console.error('Execution error:', error);
  //     setOutput('Error: ' + (error as Error).message);
  //     setShowOutput(true);
  //   }
  // };