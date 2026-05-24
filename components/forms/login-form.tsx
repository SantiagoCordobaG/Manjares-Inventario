"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true); setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    window.location.assign("/dashboard");
  }

  return <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2">
      <Button type="button" variant="secondary" className="w-full" onClick={() => { setEmail("admin@pasteleria.com"); setPassword("TuPasswordSegura123"); setError(null); }}>
        Usar admin demo
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={() => { setEmail("punto.lopez@pasteleria.com"); setPassword("LopezDemo123"); setError(null); }}>
        Usar sucursal demo
      </Button>
    </div>
    <div className="space-y-2">
      <Label>Email</Label>
      <Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@pasteleria.com" />
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label>Contraseña</Label>
        <button type="button" className="text-xs font-medium text-muted-foreground hover:text-foreground" onClick={() => setShowPassword((value) => !value)}>
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      <Input type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>
    {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <Button className="w-full shadow-sm" disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}</Button>
  </form>;
}
