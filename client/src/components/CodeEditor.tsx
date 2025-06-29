import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { loadPyodide, PyodideInterface } from "pyodide";
// const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   const initPyodide = async () => {
  //     const py = await loadPyodide();
  //     setPyodide(py);
  //     setLoading(false);
  //   };
  //   initPyodide();
  // }, []);
  // const runCode = async () => {
  //   if (!pyodide) return;
  //   setOutput("");
  //   setShowOutput(false);
  //   pyodide.setStdout({
  //     batched: (msg: string) => {
  //       // Ensure newlines are respected
  //       setOutput((prev) => prev + msg + (msg.endsWith("\n") ? "" : "\n"));
  //     },
  //   });
  //   try {
  //     await pyodide.runPythonAsync(code);
  //   } catch (err: any) {
  //     setOutput("Error: " + err.toString());
  //   }
  //   setShowOutput(true);
  //   if (onCodeRun) onCodeRun(code);
  // };

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
  const [pyodide, setPyodide] = useState<any>(null);
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