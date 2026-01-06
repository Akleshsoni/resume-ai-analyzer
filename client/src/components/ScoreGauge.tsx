import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-500";
    if (s >= 60) return "text-amber-500";
    return "text-rose-500";
  };
  
  const getStrokeColor = (s: number) => {
    if (s >= 80) return "#10b981"; // emerald-500
    if (s >= 60) return "#f59e0b"; // amber-500
    return "#f43f5e"; // rose-500
  };

  const circumference = 2 * Math.PI * 40; // r=40
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200 dark:text-gray-800"
        />
        {/* Progress circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="96"
          cy="96"
          r="40"
          stroke={getStrokeColor(score)}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`text-5xl font-bold ${getColor(score)} font-display`}
        >
          {score}
        </motion.span>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">Match</span>
      </div>
    </div>
  );
}
