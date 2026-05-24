"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  disabled?: boolean;
  disabledMessage?: string;
};

export function LoginForm({ disabled = false, disabledMessage }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (disabled) return;

    setLoading(true); setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setError(error.message);
      window.location.assign("/dashboard");
    } catch {
      setLoading(false);
      setError("Falta configurar Supabase en este deploy. Revisa las variables de entorno públicas en Vercel.");
    }
  }

  return <form onSubmit={onSubmit} className="space-y-4">
    {disabledMessage && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{disabledMessage}</p>}
    <div className="grid gap-3 sm:grid-cols-2">
      <Button type="button" variant="secondary" className="w-full" disabled={disabled} onClick={() => { setEmail("admin@pasteleria.com"); setPassword("TuPasswordSegura123"); setError(null); }}>
        Usar admin demo
      </Button>
      <Button type="button" variant="outline" className="w-full" disabled={disabled} onClick={() => { setEmail("punto.lopez@pasteleria.com"); setPassword("LopezDemo123"); setError(null); }}>
        Usar sucursal demo
      </Button>
    </div>
    <div className="space-y-2">
      <Label>Email</Label>
      <Input type="email" autoComplete="email" required disabled={disabled} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@pasteleria.com" />
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label>Contraseña</Label>
        <button type="button" disabled={disabled} className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60" onClick={() => setShowPassword((value) => !value)}>
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      <Input type={showPassword ? "text" : "password"} autoComplete="current-password" required disabled={disabled} value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>
    {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <Button className="w-full shadow-sm" disabled={loading || disabled}>{loading ? "Ingresando..." : "Ingresar"}</Button>
  </form>;
}
