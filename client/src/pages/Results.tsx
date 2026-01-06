import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, CheckCircle2, AlertCircle, 
  Lightbulb, Briefcase, ChevronRight, XCircle
} from "lucide-react";
import { ScoreGauge } from "@/components/ScoreGauge";
import type { AnalysisResponse } from "@shared/routes";
import { Button } from "@/components/ui/button";

// Mock data for development if state is empty (prevents crashing on direct navigation)
const MOCK_DATA: AnalysisResponse = {
  id: 1,
  resumeText: "...",
  jobDescription: "...",
  score: 85,
  missingSkills: ["Docker", "Kubernetes", "GraphQL"],
  suggestions: "• Add more numerical metrics to your work history\n• Highlight your leadership experience in the project section\n• Explicitly mention containerization tools",
  recommendedRoles: ["Senior Frontend Engineer", "Full Stack Developer", "Tech Lead"],
  createdAt: new Date(),
};

export default function Results() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/results/:id");
  const [data, setData] = useState<AnalysisResponse | null>(null);

  useEffect(() => {
    // In a real app with DB, we'd fetch useQuery(["analysis", params.id])
    // Here we'll try to load from session for the demo or use mock
    // If param is 'latest', check session. If ID, fetch (simulated).
    
    const stored = sessionStorage.getItem("lastAnalysis");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Transform date string back to object if needed, though mostly display
        setData(parsed);
      } catch (e) {
        console.error("Failed to parse analysis data", e);
      }
    } else {
      // Fallback for direct link visiting without history
      setData(MOCK_DATA); 
    }
  }, [params?.id]);

  if (!data) return null;

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Upload
          </button>
          <div className="font-display font-bold text-lg">Analysis Report</div>
          <div className="w-20" /> {/* Spacer for balance */}
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          
          {/* Left Column: Score & Summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Score Card */}
            <motion.div variants={item} className="bg-white dark:bg-card rounded-2xl p-8 shadow-lg shadow-black/5 border border-border flex flex-col items-center text-center">
              <h2 className="text-xl font-bold mb-6 text-foreground font-display">ATS Match Score</h2>
              <ScoreGauge score={data.score} />
              
              <div className="mt-6 p-4 bg-secondary/50 rounded-xl w-full">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-bold ${data.score >= 70 ? "text-emerald-600" : "text-amber-600"}`}>
                    {data.score >= 70 ? "Strong Match" : "Needs Improvement"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/80 leading-relaxed">
                  {data.score >= 70 
                    ? "Your resume is well-optimized for this role. Review the suggestions to perfect it." 
                    : "There are significant gaps between your resume and the job description."}
                </p>
              </div>
            </motion.div>

            {/* Recommended Roles */}
            <motion.div variants={item} className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border border-border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 font-display">
                <Briefcase className="w-5 h-5 text-primary" />
                Recommended Roles
              </h3>
              <div className="space-y-3">
                {data.recommendedRoles.map((role, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors group cursor-default">
                    <span className="text-sm font-medium text-foreground">{role}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Missing Skills */}
            <motion.div variants={item} className="bg-white dark:bg-card rounded-2xl p-8 shadow-lg shadow-black/5 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground font-display">Missing Skills</h3>
                  <p className="text-sm text-muted-foreground">Critical keywords found in the job description but missing from your resume</p>
                </div>
              </div>

              {data.missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {data.missingSkills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 font-medium text-sm flex items-center gap-2"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <p className="text-emerald-800 dark:text-emerald-200 font-medium">Great job! No major skills missing.</p>
                </div>
              )}
            </motion.div>

            {/* Improvement Suggestions */}
            <motion.div variants={item} className="bg-white dark:bg-card rounded-2xl p-8 shadow-lg shadow-black/5 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground font-display">Improvement Plan</h3>
                  <p className="text-sm text-muted-foreground">Actionable steps to increase your match score</p>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
                {data.suggestions.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 p-3 rounded-lg hover:bg-secondary/30 transition-colors border-l-2 border-transparent hover:border-primary pl-4">
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
