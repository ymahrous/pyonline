import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CodeEditor from "../components/CodeEditor";
import { Calculator, ListChecks, Dice1, Worm } from "lucide-react";

export default function Projects() {
  const [activeProject, setActiveProject] = useState<any>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const handleStartProject = (project: any) => {
    setActiveProject(project);
    setIsEditorOpen(true);
  };
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setActiveProject(null);
  };

  const projects = [
    {
      id: 1,
      title: "Calculator App",
      description: "Build a fully functional calculator with a graphical user interface using tkinter.",
      icon: Calculator,
      color: "blue",
      skills: [
        "GUI development with tkinter",
        "Event handling and user input",
        "Mathematical operations in Python"
      ],
    starterCode: `def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

print("Calculator")
print("2 + 3 =", add(2, 3))
print("5 - 2 =", subtract(5, 2))`,
    },
    {
      id: 2,
      title: "To-Do List",
      description: "Create a command-line to-do list application with file persistence.",
      icon: ListChecks,
      color: "green",
      skills: [
        "File I/O operations",
        "Data persistence",
        "Command-line interfaces"
      ],
    starterCode: ``,
    },
    {
      id: 3,
      title: "Guess the Number Game",
      description: "Build an interactive number guessing game with different difficulty levels.",
      icon: Dice1,
      color: "purple",
      skills: [
        "Random number generation",
        "Loops and conditional statements",
        "User input validation"
      ],
       starterCode: `secret_number = 7\nguess = 5
      if guess == secret_number:
        print("You guessed it!")
      else:
        print("Wrong guess. Try again!")`,
    },
    {
      id: 4,
      title: "Simple Web Scraper",
      description: "Learn web scraping by extracting data from websites using requests and BeautifulSoup.",
      icon: Worm,
      color: "red",
      skills: [
        "HTTP requests with requests library",
        "HTML parsing with BeautifulSoup",
        "Data extraction and processing"
      ],
      starterCode: 'print("Simulated Web Scraper")\nprint("Fetching data from https://example.com...")\nprint("Title: Example Domain")',
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        icon: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700"
      },
      green: {
        icon: "text-green-600",
        button: "bg-green-600 hover:bg-green-700"
      },
      purple: {
        icon: "text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700"
      },
      red: {
        icon: "text-red-600",
        button: "bg-red-600 hover:bg-red-700"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Python Projects</h1>
          <p className="text-lg text-slate-600">Build real-world applications and strengthen your Python skills</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => {
            const IconComponent = project.icon;
            const colorClasses = getColorClasses(project.color);
            
            return (
              <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <IconComponent className={`text-2xl ${colorClasses.icon} mr-3`} size={32} />
                  <h3 className="text-xl font-semibold text-slate-800">{project.title}</h3>
                </div>
                <p className="text-slate-600 mb-4">{project.description}</p>
                <div className="mb-4">
                  <h4 className="font-medium text-slate-800 mb-2">What you'll learn:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {project.skills.map((skill, index) => (
                      <li key={index}>• {skill}</li>
                    ))}
                  </ul>
                </div>
                <Button onClick={() => handleStartProject(project)} className={`w-full ${colorClasses.button} text-white`}>Start Project</Button>
              </Card>
            );
          })}
        </div>
      </div>
      {isEditorOpen && activeProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{activeProject.title}</h2>
              <button
                onClick={handleCloseEditor}
                className="text-red-600 hover:underline"
              >
                Close
              </button>
            </div>
            <CodeEditor initialCode={activeProject.starterCode} />
          </div>
        </div>
      )}
    </div>
  );
}
