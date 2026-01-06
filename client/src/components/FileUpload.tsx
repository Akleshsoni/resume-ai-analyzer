import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        onFileSelect(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div
        onClick={() => !selectedFile && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          "relative group cursor-pointer transition-all duration-300 ease-out",
          "border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center overflow-hidden",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : selectedFile 
              ? "border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-900/10" 
              : "border-border hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900/50"
        )}
      >
        <input
          type="file"
          accept=".pdf"
          ref={inputRef}
          onChange={handleChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1 font-display">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                </p>
              </div>
              <button
                onClick={clearFile}
                className="mt-4 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Remove File
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4"
            >
              <div className={clsx(
                "w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors duration-300",
                isDragging ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
              )}>
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1 font-display">
                  Upload your Resume
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Drag & drop your PDF here, or click to browse files
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/70 bg-secondary/50 px-3 py-1.5 rounded-full">
                <FileText className="w-3.5 h-3.5" />
                <span>PDF Format Required</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
