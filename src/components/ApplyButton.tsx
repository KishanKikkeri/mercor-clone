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
        "inline-flex items-center justify-center rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-100 active:scale-[0.98] btn-hover-effect"
      }
    >
      Apply Now
    </button>
  );
}
