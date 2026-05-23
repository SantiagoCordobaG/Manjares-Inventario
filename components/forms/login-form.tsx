"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true); setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/dashboard"); router.refresh();
  }

  return <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2"><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@pasteleria.com" /></div>
    <div className="space-y-2"><Label>Contraseña</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
    {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <Button className="w-full" disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}</Button>
  </form>;
}
