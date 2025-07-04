import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'pylearn_progress';

interface LocalProgress {
  [lessonId: number]: {
    completed: boolean;
    progress: number;
    completedAt?: string;
  };
}

export const useLocalProgress = () => {
  const [localProgress, setLocalProgressState] = useState<LocalProgress>({});

  useEffect(() => {
    const loadProgress = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          setLocalProgressState(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load progress from local storage:', error);
      }
    };

    loadProgress();
    
    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        loadProgress();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateLocalProgress = (lessonId: number, data: { completed: boolean; progress: number }) => {
    try {
      const updated = {
        ...localProgress,
        [lessonId]: {
          ...data,
          completedAt: data.completed ? new Date().toISOString() : undefined,
        }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setLocalProgressState(updated);
    } catch (error) {
      console.error('Failed to save progress to local storage:', error);
    }
  };

  const getCompletedLessons = () => {
    return Object.entries(localProgress)
      .filter(([, progress]) => progress.completed)
      .map(([lessonId]) => parseInt(lessonId));
  };

  const isLessonCompleted = (lessonId: number) => {
    return localProgress[lessonId]?.completed || false;
  };

  const getTotalCompletedCount = () => {
    return getCompletedLessons().length;
  };

  return {
    localProgress,
    updateLocalProgress,
    getCompletedLessons,
    isLessonCompleted,
    getTotalCompletedCount,
  };
};