import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code, TrendingUp, Smile } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
              Learn Python from Scratch:
              <span className="text-blue-600"> Fun, Simple, Interactive!</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Master Python programming through engaging lessons, hands-on projects, and a community that celebrates your progress. Start your coding journey today with our beginner-friendly approach.
            </p>
            <Link href="/lessons">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl">
                Start Learning
                <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose PyLearn?</h2>
            <p className="text-lg text-slate-600">Learn Python the fun way with our interactive platform</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="text-2xl text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Interactive Coding</h3>
              <p className="text-slate-600">Practice Python directly in your browser with our built-in code editor</p>
            </Card>
            <Card className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-2xl text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Track Progress</h3>
              <p className="text-slate-600">Monitor your learning journey with detailed progress tracking</p>
            </Card>
            <Card className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile className="text-2xl text-amber-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Fun Learning</h3>
              <p className="text-slate-600">Enjoy memes and engaging content that makes coding enjoyable</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Meme Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Learning Python Like...</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Developer coding Python" 
              className="rounded-xl shadow-lg w-full h-64 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Happy developer" 
              className="rounded-xl shadow-lg w-full h-64 object-cover" 
            />
          </div>
          <p className="text-lg text-slate-600 mt-6">Join thousands of learners who are having fun while mastering Python!</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <i className="fab fa-python text-2xl text-python-yellow mr-2"></i>
                <span className="text-xl font-bold">PyLearn</span>
              </div>
              <p className="text-slate-400">Making Python learning fun and accessible for everyone.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/lessons" className="hover:text-white transition-colors">Lessons</Link></li>
                <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reddit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Stack Overflow</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <i className="fab fa-youtube text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 PyLearn. All rights reserved. Made with ❤️ for Python learners.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
