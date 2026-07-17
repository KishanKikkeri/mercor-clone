"use client";

import { Job } from "@/types/job";
import { ApplicationForm } from "./ApplicationForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
  onSubmitSuccess?: () => void;
}

export function ApplicationDialog({
  open,
  onOpenChange,
  job,
  onSubmitSuccess,
}: ApplicationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto p-6 rounded-xl">
        <DialogHeader className="space-y-1 mb-4">
          <DialogTitle className="text-xl font-bold text-slate-900">
            Apply for {job.title}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            at {job.company.name} • {job.location} • {job.employmentType}
          </DialogDescription>
        </DialogHeader>

        <ApplicationForm job={job} onSubmitSuccess={onSubmitSuccess} />
      </DialogContent>
    </Dialog>
  );
}
