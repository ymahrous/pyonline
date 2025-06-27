import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code, TrendingUp, Smile } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

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
              Master Python programming through engaging lessons, hands-on
              projects, and a community that celebrates your progress. Start
              your coding journey today with our beginner-friendly approach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/lessons">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  Start Learning
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </Link>
              {!isAuthenticated && !isLoading && (
                <Link href="/auth">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl"
                  >
                    Create Free Account
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Why Choose PyOnline?
            </h2>
            <p className="text-lg text-slate-600">
              Learn Python the fun way with our interactive platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="text-2xl text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Interactive Coding
              </h3>
              <p className="text-slate-600">
                Practice Python directly in your browser with our built-in code
                editor
              </p>
            </Card>
            <Card className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-2xl text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Track Progress
              </h3>
              <p className="text-slate-600">
                Monitor your learning journey with detailed progress tracking
              </p>
            </Card>
            <Card className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile className="text-2xl text-amber-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Fun Learning
              </h3>
              <p className="text-slate-600">
                Enjoy memes and engaging content that makes coding enjoyable
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">
            Ready to Start Your Python Journey?
          </h2>
          <p className="text-lg text-slate-600 mt-6">
            Join thousands of learners who are having fun while mastering
            Python!
          </p>
        </div>
      </section>
    </div>
  );
}
