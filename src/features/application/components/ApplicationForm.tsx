"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Job } from "@/types/job";
import { applicationSchema } from "../schemas/application";
import { Application } from "../types/application";
import { ResumeUpload } from "./ResumeUpload";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ApplicationFormProps {
  job: Job;
  onSubmitSuccess?: () => void;
}

export function ApplicationForm({ job, onSubmitSuccess }: ApplicationFormProps) {
  const form = useForm<Application>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      portfolioUrl: "",
      coverLetter: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (data: Application) => {
    console.log("Application Data:", data);
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Full Name + Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">
                  Full Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    className="rounded-lg border-slate-200 focus-visible:ring-purple-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">
                  Email Address <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="rounded-lg border-slate-200 focus-visible:ring-purple-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Phone (full width) */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-semibold">
                Phone Number <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="rounded-lg border-slate-200 focus-visible:ring-purple-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Row 3: LinkedIn + Portfolio */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">
                  LinkedIn URL{" "}
                  <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    className="rounded-lg border-slate-200 focus-visible:ring-purple-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portfolioUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">
                  Portfolio URL{" "}
                  <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://myportfolio.com"
                    className="rounded-lg border-slate-200 focus-visible:ring-purple-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Row 4: Cover Letter */}
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-semibold">
                Cover Letter <span className="text-slate-400 font-normal text-xs">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Introduce yourself and tell us why you are a great fit for this role..."
                  className="min-h-[110px] rounded-lg border-slate-200 focus-visible:ring-purple-500 resize-y"
                  {...field}
                />
              </FormControl>
              <div className="flex justify-between items-center mt-1">
                <FormMessage className="text-xs" />
                <span className="text-xs text-slate-400 ml-auto">
                  {field.value?.length ?? 0} / 1000
                </span>
              </div>
            </FormItem>
          )}
        />

        {/* Resume Upload */}
        <ResumeUpload />

        {/* Submit */}
        <div className="pt-1">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.99]"
          >
            {isSubmitting ? "Submitting…" : "Submit Application"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
