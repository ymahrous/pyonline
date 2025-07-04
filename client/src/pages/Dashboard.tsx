import { Link } from "wouter";
import { lessons } from "@/data/lessons";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { LessonProgress } from "@shared/schema";
import { CheckCircle, TrendingUp, Flame } from "lucide-react";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Show login prompt if not authenticated
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Dashboard Access
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Create an account to track your learning progress and view detailed statistics.
            </p>
            <Button asChild size="lg">
              <Link href="/auth">Login or Sign Up</Link>
            </Button>
            <div className="mt-6">
              <Link href="/lessons">
                <Button variant="outline" size="lg">
                  Continue Without Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data: progressData } = useQuery<LessonProgress[]>({
    queryKey: ["/api/progress"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const completedLessons = progressData?.filter(p => p.completed) || [];
  const totalLessons = lessons.length;
  const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100);
  const completedLessonIds = new Set(completedLessons.map(p => p.lessonId));

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Your Learning Dashboard</h1>
          <p className="text-lg text-slate-600">Track your progress and continue your Python journey</p>
        </div>
        
        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Lessons Completed</h3>
                <p className="text-3xl font-bold text-blue-600">{completedLessons.length}</p>
              </div>
              <CheckCircle className="text-3xl text-blue-600" size={48} />
            </div>
          </Card>
          <Card className="bg-green-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Overall Progress</h3>
                <p className="text-3xl font-bold text-green-600">{progressPercentage}%</p>
              </div>
              <TrendingUp className="text-3xl text-green-600" size={48} />
            </div>
          </Card>
          <Card className="bg-amber-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Current Streak</h3>
                <p className="text-3xl font-bold text-amber-600">3 days</p>
              </div>
              <Flame className="text-3xl text-amber-600" size={48} />
            </div>
          </Card>
        </div>
        
        {/* Progress Detail */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Lesson Progress</h2>
          <div className="space-y-4">
            {lessons.map((lesson) => {
              const isCompleted = completedLessonIds.has(lesson.id);
              return (
                <div key={lesson.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center">
                    <i className={`${lesson.icon} text-xl ${isCompleted ? 'text-green-600' : 'text-slate-400'} mr-3`}></i>
                    <div>
                      <h3 className="font-medium text-slate-800">{lesson.title}</h3>
                      <p className="text-sm text-slate-600">{lesson.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {isCompleted ? (
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    ) : (
                      <Link href={`/lesson/${lesson.id}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Start
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
