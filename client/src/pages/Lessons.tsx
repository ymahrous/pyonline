import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { lessons } from "@/data/lessons";
import { useAuth } from "@/hooks/useAuth";
import type { LessonProgress } from "@shared/schema";
import { useLocalProgress } from "@/hooks/useLocalProgress";

export default function Lessons() {
  const { isAuthenticated } = useAuth();
  const { isLessonCompleted, getCompletedLessons } = useLocalProgress();

  const { data: progressData } = useQuery<LessonProgress[]>({
    queryKey: ["/api/progress"],
    enabled: isAuthenticated,
  });

  const completedLessons = new Set(
    progressData?.filter(p => p.completed).map(p => p.lessonId) || []
  );

  const getLocalCompletedLessons = () => {
    return lessons.filter(lesson => isLessonCompleted(parseInt(lesson.id)));
  };

  const totalLessons = lessons.length;
  const completedCount = isAuthenticated 
    ? completedLessons.size 
    : getLocalCompletedLessons().length;
  const progressPercentage = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Python Lessons</h1>
          <p className="text-lg text-slate-600 mb-8">Master Python step by step with our comprehensive curriculum</p>

          {!isAuthenticated && (
            <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-blue-800">
                <Link href="/auth" className="underline hover:no-underline font-medium">Create a free account</Link> to track your progress and save your achievements across all lessons!
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => {
            const isCompleted = isAuthenticated ? completedLessons.has(lesson.id) : isLessonCompleted(parseInt(lesson.id));
            return (
              <Card key={lesson.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <i className={`${lesson.icon} text-2xl text-blue-600 mr-3`}></i>
                  <h3 className="text-xl font-semibold text-slate-800 flex-1">{lesson.title}</h3>
                  {isCompleted && (
                    <CheckCircle className="text-green-600 w-6 h-6" />
                  )}
                </div>
                <p className="text-slate-600 mb-4">{lesson.description}</p>
                {isCompleted && (
                  <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
                    Completed
                  </Badge>
                )}
                <Link href={`/lesson/${lesson.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}