import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function About() {
  const features = [
    "Interactive coding environment right in your browser",
    "Progress tracking to keep you motivated",
    "Fun memes and engaging content",
    "Real-world projects to build your portfolio"
  ];

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">About PyLearn</h1>
          <p className="text-lg text-slate-600">Making Python accessible, enjoyable, and effective for everyone</p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <Card className="bg-blue-50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-700">
              At PyLearn, we believe that learning to code should be fun, interactive, and accessible to everyone. 
              Our platform combines structured learning with engaging content to help you master Python programming 
              at your own pace. Whether you're a complete beginner or looking to strengthen your skills, 
              we're here to support your coding journey.
            </p>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">What Makes Us Different</h3>
              <ul className="space-y-3 text-slate-600">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-green-600 mr-3 mt-1 flex-shrink-0" size={20} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">About the Creator</h3>
              <p className="text-slate-600 mb-4">
                PyLearn was created by passionate developers who understand the challenges of learning 
                programming. With years of experience in education and software development, our team 
                is dedicated to creating the best possible learning experience.
              </p>
              <p className="text-slate-600">
                We're constantly improving our platform based on user feedback and the latest 
                educational research to ensure you have the tools you need to succeed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
