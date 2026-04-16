import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { SyncIndicator } from '../components/SyncIndicator';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger 
} from '../components/ui/sheet';
import { 
  ArrowLeft, Clock, BookOpen, ChevronRight, CheckCircle2, 
  PlayCircle, Brain, Target, ShieldCheck, Bookmark, ChevronLeft, Menu
} from 'lucide-react';
import { modules } from '../utils/mockData';
import { logStudySession, getOfflineProgress, hasReviewHoursRemaining } from '../utils/offlineStorage';

export function LessonModule() {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [canContinue, setCanContinue] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const module = modules.find(m => m.id === moduleId);
  const sections = module?.lessonContent?.sections || [];
  const currentSection = sections[currentSectionIndex];

  useEffect(() => {
    setCanContinue(hasReviewHoursRemaining());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  useEffect(() => {
    return () => {
      if (module && elapsedTime > 0) {
        logStudySession(module.id, elapsedTime);
      }
    };
  }, [module, elapsedTime]);

  const handleMarkComplete = () => {
    if (currentSection) {
      setCompletedSections(prev => new Set([...prev, currentSection.id]));
    }
  };

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!module || !currentSection) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Module Not Found</CardTitle>
            <CardDescription>The requested module could not be loaded.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')} variant="default">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canContinue) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-red-200">
          <CardHeader>
            <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <CardTitle className="text-red-700">Review Hours Limit Reached</CardTitle>
            <CardDescription className="text-red-600">
              You have exhausted your allocated review hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/profile')} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Purchase Additional Hours
            </Button>
            <Button onClick={() => navigate('/dashboard')} variant="ghost" className="w-full mt-2">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentSectionIndex + 1) / sections.length) * 100;

  const SidebarContent = () => (
    <div className="p-2 space-y-1">
      {sections.map((section, idx) => {
        const isActive = idx === currentSectionIndex;
        const isCompleted = completedSections.has(section.id);
        return (
          <button
            key={section.id}
            onClick={() => {
              setCurrentSectionIndex(idx);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
              isActive 
                ? 'bg-blue-50 ring-1 ring-blue-500 shadow-sm' 
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {isCompleted ? (
                <CheckCircle2 className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-emerald-500'}`} />
              ) : (
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'border-blue-600 text-blue-600' : 'border-slate-300 text-slate-400'
                }`}>
                  {idx + 1}
                </div>
              )}
            </div>
            <div>
              <p className={`text-sm font-medium leading-tight ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                {section.title}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center">
                <Clock className="w-3 h-3 mr-1" /> {section.readingTime} min
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden flex items-center gap-2">
                  <Menu className="w-4 h-4" />
                  <span className="text-xs">Topics</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-blue-600" />
                    Course Contents
                  </SheetTitle>
                  <CardDescription className="text-xs">
                    {completedSections.size} of {sections.length} sections completed
                  </CardDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)]">
                  <SidebarContent />
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="font-bold text-slate-900 text-sm sm:text-lg truncate max-w-[150px] sm:max-w-none">
                {module.title}
              </h1>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-sm hidden sm:inline-flex">
                  {module.domain}
                </Badge>
                {module.cognitiveLevel === 'higher' ? (
                  <span className="flex items-center text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    <Brain className="w-3 h-3 mr-1" /> 9 pts
                  </span>
                ) : (
                  <span className="flex items-center text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    <Target className="w-3 h-3 mr-1" /> 3 pts
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <SyncIndicator />
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Session Time</span>
              <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-mono font-medium text-xs sm:text-sm">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-1 rounded-none bg-slate-100" />
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6 p-4 md:p-6 lg:p-8">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-80 shrink-0">
          <Card className="sticky top-24 border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
                Course Contents
              </CardTitle>
              <CardDescription className="text-xs">
                {completedSections.size} of {sections.length} sections completed
              </CardDescription>
            </CardHeader>
            <Separator />
            <ScrollArea className="h-[calc(100vh-250px)]">
              <SidebarContent />
            </ScrollArea>
          </Card>
        </aside>

        {/* Section Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <Card className="flex-1 border-slate-200 shadow-sm flex flex-col">
            <CardHeader className="border-b bg-white/50 pb-6">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <span>Section {currentSectionIndex + 1}</span>
                <span>•</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {currentSection.readingTime} min read</span>
              </div>
              <CardTitle className="text-2xl md:text-3xl text-slate-900 font-bold leading-tight">
                {currentSection.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 flex-1">
              <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:text-slate-800">
                <div className="whitespace-pre-wrap text-slate-700 text-base md:text-lg">
                  {currentSection.content}
                </div>
              </div>

              {/* Completion Area */}
              <div className="mt-12 pt-8 border-t flex flex-col items-center">
                {!completedSections.has(currentSection.id) ? (
                  <Button 
                    onClick={handleMarkComplete}
                    size="lg"
                    className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Mark Section as Complete
                  </Button>
                ) : (
                  <div className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-6 py-3 rounded-full">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Completed! Great job.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0}
              className="px-4 md:px-8 bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Previous</span>
            </Button>
            
            {currentSectionIndex < sections.length - 1 ? (
              <Button
                size="lg"
                onClick={handleNext}
                className="flex-1 md:flex-none md:px-8 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next <span className="hidden sm:inline">Section</span> <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => navigate(`/review/${moduleId}`)}
                className="flex-1 md:flex-none md:px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Start</span> Quiz
              </Button>
            )}
          </div>
        </main>
        
      </div>
    </div>
  );
}
