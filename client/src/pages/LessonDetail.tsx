import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import CodeEditor from "@/components/CodeEditor";
import CompletionModal from "@/components/CompletionModal";
import { lessons } from "@/data/lessons";
import type { LessonProgress } from "@shared/schema";

// Local storage utilities for non-authenticated users
const LOCAL_STORAGE_KEY = 'pylearn_progress';

interface LocalProgress {
  [lessonId: number]: {
    completed: boolean;
    progress: number;
    completedAt?: string;
  };
}

const getLocalProgress = (): LocalProgress => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const setLocalProgress = (lessonId: number, data: { completed: boolean; progress: number }) => {
  try {
    const current = getLocalProgress();
    current[lessonId] = {
      ...data,
      completedAt: data.completed ? new Date().toISOString() : undefined,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  } catch (error) {
    console.error('Failed to save progress to local storage:', error);
  }
};

export default function LessonDetail() {
  const [, params] = useRoute("/lesson/:id");
  const lessonId = parseInt(params?.id || "0");
  const lesson = lessons.find(l => l.id === lessonId);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [progress, setProgress] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const { data: lessonProgress } = useQuery<LessonProgress | null>({
    queryKey: ["/api/progress", lessonId],
    enabled: isAuthenticated && !!lessonId,
  });

  // Load progress from local storage for non-authenticated users or when server data isn't available
  useEffect(() => {
    if (!isAuthenticated) {
      const localProgress = getLocalProgress();
      const localLessonProgress = localProgress[lessonId];
      if (localLessonProgress) {
        setProgress(localLessonProgress.completed ? 100 : localLessonProgress.progress);
      }
    }
  }, [lessonId, isAuthenticated]);

  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        await apiRequest("POST", "/api/progress", {
          lessonId,
          completed: true,
        });
      } else {
        // For non-authenticated users, just mark as complete locally
        return Promise.resolve();
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
        queryClient.invalidateQueries({ queryKey: ["/api/progress", lessonId] });
      }
      setProgress(100);
      setShowCompletionModal(true);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Login Required",
          description: "Create an account to save your progress permanently.",
          variant: "default",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to complete lesson. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (lessonProgress?.completed) {
      setProgress(100);
    }
  }, [lessonProgress]);

  const handleCodeRun = () => {
    if (progress < 75) {
      setProgress(75);
      // Save progress to local storage for non-authenticated users
      if (!isAuthenticated) {
        setLocalProgress(lessonId, { completed: false, progress: 75 });
      }
    }
  };

  const handleCompleteLesson = () => {
    if (!isAuthenticated) {
      // For non-authenticated users, save to local storage and show modal
      setProgress(100);
      setLocalProgress(lessonId, { completed: true, progress: 100 });
      setShowCompletionModal(true);
      return;
    }
    completeLessonMutation.mutate();
  };

  const handleNextLesson = () => {
    setShowCompletionModal(false);
    const nextLesson = lessons.find(l => l.id === lessonId + 1);
    if (nextLesson) {
      window.location.href = `/lesson/${nextLesson.id}`;
    }
  };

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Lesson Not Found</h1>
          <Link href="/lessons">
            <Button>Back to Lessons</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextLesson = lessons.find(l => l.id === lessonId + 1);

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/lessons">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lessons
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">{lesson.title}</h1>
          <div className="bg-slate-100 rounded-full h-2 mb-6">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
        
        <div className="mb-8">
          <CodeEditor 
            initialCode={lesson.example}
            onCodeRun={handleCodeRun}
          />
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                💡 <Link href="/auth" className="underline hover:no-underline font-medium">Create a free account</Link> to save your progress and track your achievements!
              </p>
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <div />
            <Button 
              onClick={handleCompleteLesson}
              disabled={completeLessonMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {completeLessonMutation.isPending ? "Completing..." : "Complete Lesson"}
            </Button>
          </div>
        </div>

        <CompletionModal
          open={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          onNextLesson={handleNextLesson}
          hasNextLesson={!!nextLesson}
        />
      </div>
    </div>
  );
}
