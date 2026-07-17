"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function SuccessDialog({
  open,
  onOpenChange,
  title = "Application Submitted!",
  description = "Thank you for applying. We will review your application and get back to you soon.",
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center flex flex-col items-center justify-center p-8 gap-4">
        <DialogHeader className="items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-center max-w-xs mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 w-full">
          <Button
            type="button"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-2.5 transition-all duration-200"
            onClick={() => onOpenChange(false)}
          >
            Close Window
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
