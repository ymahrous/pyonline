import { Button } from "@/components/ui/button";
// import { celebrationMemes } from "@/data/lessons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CompletionModalProps {
  open: boolean;
  onClose: () => void;
  onNextLesson: () => void;
  hasNextLesson: boolean;
}

export default function CompletionModal({ open, onClose, onNextLesson, hasNextLesson }: CompletionModalProps) {
  // const [memeUrl, setMemeUrl] = useState("");
  // useEffect(() => {
  //   if (open) {
  //     const randomMeme = celebrationMemes[Math.floor(Math.random() * celebrationMemes.length)];
  //     setMemeUrl(randomMeme);
  //   }
  // }, [open]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-slate-800">
            🎉 Lesson Complete!
          </DialogTitle>
        </DialogHeader>
        <div className="text-center">
          {/* <div className="mb-6">
            <img
              src={memeUrl}
              alt="Congratulations on completing the lesson!"
              className="rounded-lg w-full h-64 object-cover"
            />
          </div> */}
          <p className="text-lg text-slate-600 mb-6">
            Great job! You've successfully completed this lesson. Keep up the excellent work!
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            {hasNextLesson && (
              <Button
                onClick={onNextLesson}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next Lesson
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
