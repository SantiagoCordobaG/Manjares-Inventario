import { cn } from "@/lib/utils";
export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "warning" | "success" | "danger" | "muted" }) {
  const variants = { default: "bg-primary text-primary-foreground", warning: "bg-amber-100 text-amber-800", success: "bg-emerald-100 text-emerald-800", danger: "bg-red-100 text-red-800", muted: "bg-muted text-muted-foreground" };
  return <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)} {...props} />;
}
