"use client";

import { Upload } from "lucide-react";

export function ResumeUpload() {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700 block">
        Resume / CV <span className="text-slate-400 font-normal text-xs">(Optional)</span>
      </label>
      <div className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-all duration-200 hover:border-purple-400 hover:bg-purple-50/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors duration-200 group-hover:bg-purple-100 group-hover:text-purple-600">
          <Upload className="h-6 w-6 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <p className="text-sm font-medium text-slate-700">Upload Resume</p>
          <p className="text-xs text-slate-500">
            Supported formats: <span className="font-semibold text-slate-600">PDF, DOC, DOCX</span>
          </p>
          <p className="text-xs text-slate-400">Maximum size: 5 MB</p>
        </div>

        <p className="mt-3 text-xs text-slate-400 italic">No file selected</p>

        {/* Disabled input placeholder for future milestone */}
        <input
          type="file"
          disabled
          className="absolute inset-0 cursor-not-allowed opacity-0"
          accept=".pdf,.doc,.docx"
          aria-label="Resume upload (not yet available)"
        />
      </div>
    </div>
  );
}
