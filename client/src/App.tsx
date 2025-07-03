import Faq from "@/pages/Faq";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Terms from "@/pages/Terms";
import Lessons from "@/pages/Lessons";
import Contact from "@/pages/Contact";
import { Switch, Route } from "wouter";
import Projects from "@/pages/Projects";
import AuthPage from "@/pages/AuthPage";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import { queryClient } from "./lib/queryClient";
import LessonDetail from "@/pages/LessonDetail";
import Navigation from "@/components/Navigation";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/lessons" component={Lessons} />
              <Route path="/lesson/:id" component={LessonDetail} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/projects" component={Projects} />
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/terms-and-conditions" component={Terms} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/faq" component={Faq} />
              <Route path="/auth" component={AuthPage} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
