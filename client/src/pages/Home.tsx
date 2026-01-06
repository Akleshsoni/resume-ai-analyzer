import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Loader2, Briefcase } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { useAnalyzeResume } from "@/hooks/use-analysis";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { mutate: analyze, isPending } = useAnalyzeResume();

  const handleAnalyze = () => {
    if (!file) {
      toast({
        title: "Missing Resume",
        description: "Please upload your resume in PDF format.",
        variant: "destructive",
      });
      return;
    }
    
    if (!jobDescription.trim()) {
      toast({
        title: "Missing Job Description",
        description: "Please paste the job description you want to target.",
        variant: "destructive",
      });
      return;
    }

    analyze(
      { resume: file, jobDescription },
      {
        onSuccess: (data) => {
          // Pass the data via history state or just store locally (simple app approach)
          // For wouter, we can't easily pass state via push. 
          // We'll use localStorage for this simple demo or global state.
          // Let's assume we navigate to results and refetch or pass ID if we had an ID.
          // The backend response has the ID of the analysis record.
          // Let's assume the API returns the stored analysis object including an ID.
          if (data && 'id' in data) {
             setLocation(`/results/${data.id}`);
          } else {
             // Fallback for demo if API doesn't save to DB yet (pure stateless)
             // We'll store in sessionStorage
             sessionStorage.setItem("lastAnalysis", JSON.stringify(data));
             setLocation("/results/latest");
          }
        },
        onError: (error) => {
          toast({
            title: "Analysis Failed",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />

      <main className="container max-w-5xl mx-auto px-4 py-12 md:py-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Career Assistant</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight font-display"
          >
            Optimize Your Resume for <span className="text-gradient">Your Dream Job</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Upload your resume and a job description. Our AI will analyze the match, identify missing skills, and give you actionable advice to get hired.
          </motion.p>
        </div>

        {/* Main Interaction Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl shadow-black/5 border border-border/50">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 font-display">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">1</span>
                Upload Resume
              </h2>
              <FileUpload onFileSelect={setFile} selectedFile={file} />
            </div>
          </motion.div>

          {/* Right Column: Job Description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl shadow-black/5 border border-border/50 h-full">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 font-display">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">2</span>
                Job Description
              </h2>
              <div className="relative">
                <Briefcase className="absolute top-3 left-3 w-5 h-5 text-muted-foreground" />
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here (responsibilities, requirements, skills)..."
                  className="w-full min-h-[280px] p-4 pl-10 rounded-xl bg-secondary/30 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm leading-relaxed placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <button
            onClick={handleAnalyze}
            disabled={isPending}
            className="
              relative group overflow-hidden
              px-10 py-5 rounded-xl font-bold text-lg tracking-wide
              bg-gradient-to-r from-primary to-blue-600
              text-white shadow-xl shadow-primary/25
              hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1
              active:translate-y-0 active:shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              transition-all duration-300 ease-out
            "
          >
            <span className="relative z-10 flex items-center gap-3">
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  Analyze Match
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            {/* Glow effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
          </button>
        </motion.div>

        {/* Features Grid (Social Proof / Info) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {[
            { title: "ATS Check", desc: "See how well you pass automated screening tools." },
            { title: "Skill Gap Analysis", desc: "Identify exactly which keywords you're missing." },
            { title: "Smart Suggestions", desc: "Get AI-generated advice to improve your application." }
          ].map((item, i) => (
            <div key={i} className="p-4">
              <h3 className="text-lg font-bold text-foreground mb-2 font-display">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
