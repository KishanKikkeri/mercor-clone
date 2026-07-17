"use client";

import { useState } from "react";
import { Job } from "@/types/job";
import { ApplicationDialog, SuccessDialog } from "@/features/application";
import { trackApplyClick } from "@/utils/personalizeHelpers";

interface ApplyButtonProps {
  job: Job;
  className?: string;
}

export function ApplyButton({ job, className }: ApplyButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackApplyClick(job);
          setIsDialogOpen(true);
        }}
        className={
          className ??
          "inline-flex items-center justify-center rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-100 active:scale-[0.98] btn-hover-effect w-full sm:w-auto"
        }
      >
        Apply Now
      </button>

      <ApplicationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        job={job}
        onSubmitSuccess={() => {
          setIsDialogOpen(false);
          setIsSuccessOpen(true);
        }}
      />

      <SuccessDialog
        open={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        title="Application Submitted!"
        description={`Your application for the ${job.title} position at ${job.company.name} has been successfully submitted.`}
      />
    </>
  );
}
