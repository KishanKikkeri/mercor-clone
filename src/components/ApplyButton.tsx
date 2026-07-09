import { toast } from "sonner";

interface ApplyButtonProps {
  className?: string;
}

export function ApplyButton({ className }: ApplyButtonProps) {
  return (
    <button
      type="button"
      onClick={() =>
        toast("Applications open soon!", {
          description: "We'll notify you when this feature launches.",
        })
      }
      className={
        className ??
        "inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
      }
    >
      Apply Now
    </button>
  );
}
