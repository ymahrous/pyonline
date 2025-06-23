import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Twitter, Github, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission to backend
    toast({
      title: "Message Sent!",
      description: "Thank you for your message! We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600">Have questions or feedback? We'd love to hear from you!</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Get in Touch</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Send Message
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Other Ways to Reach Us</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="text-blue-600 mr-4" size={20} />
                <span className="text-slate-600">support@pylearn.com</span>
              </div>
              <div className="flex items-center">
                <Twitter className="text-blue-600 mr-4" size={20} />
                <span className="text-slate-600">@PyLearnPlatform</span>
              </div>
              <div className="flex items-center">
                <Github className="text-blue-600 mr-4" size={20} />
                <span className="text-slate-600">github.com/pylearn</span>
              </div>
            </div>
            
            <Card className="mt-8 p-6 bg-blue-50">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Frequently Asked Questions</h3>
              <p className="text-slate-600 text-sm mb-4">
                Before reaching out, check our FAQ section for quick answers to common questions 
                about account management, lesson content, and technical issues.
              </p>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-800 text-sm font-medium p-0">
                View FAQ <ArrowRight className="ml-1" size={16} />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
