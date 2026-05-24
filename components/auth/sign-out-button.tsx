"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type SignOutButtonProps = {
  className?: string;
  compact?: boolean;
};

export function SignOutButton({ className, compact = false }: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setLoading(false);
      setError("No fue posible cerrar la sesion. Intenta de nuevo.");
      return;
    }

    window.location.assign("/login");
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        type="button"
        variant={compact ? "ghost" : "outline"}
        className={cn(
          compact
            ? "h-auto w-full flex-col gap-1 rounded-xl py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            : "w-full justify-start gap-2"
        )}
        disabled={loading}
        onClick={handleSignOut}
      >
        <LogOut className={compact ? "h-5 w-5" : "h-4 w-4"} />
        <span>{loading ? "Saliendo..." : "Cerrar sesion"}</span>
      </Button>
      {!compact && error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
