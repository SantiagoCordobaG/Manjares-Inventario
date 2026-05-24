import { LoginForm } from "@/components/forms/login-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMissingSupabaseBrowserEnv } from "@/lib/supabase/env";
import { CakeSlice, QrCode, ShieldCheck, Store } from "lucide-react";

type LoginPageProps = {
  searchParams?: {
    config?: string;
  };
};

const highlights = [
  {
    icon: QrCode,
    title: "QR por unidad",
    description: "Cada torta queda identificada y rastreable en tiempo real."
  },
  {
    icon: Store,
    title: "Control por sedes",
    description: "Lopez, Limonar, Guaduales y Villa Colombia en la misma operación."
  },
  {
    icon: ShieldCheck,
    title: "Permisos por rol",
    description: "Admin, producción y punto con acceso según su trabajo."
  }
];

export default function LoginPage({ searchParams }: LoginPageProps) {
  const missingEnv = getMissingSupabaseBrowserEnv();
  const hasSupabaseConfigError = searchParams?.config === "supabase" || missingEnv.length > 0;
  const configMessage = missingEnv.length > 0
    ? `Faltan variables en Vercel: ${missingEnv.join(", ")}. Agrégalas y vuelve a desplegar la app.`
    : "Vercel no pudo inicializar Supabase en el middleware. Revisa las variables públicas del proyecto y luego vuelve a desplegar.";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-amber-50">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_32%)]" />
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:26px_26px]" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="space-y-6">
                <Badge className="w-fit bg-white/10 text-white">Manjares Inventario</Badge>
                <div className="space-y-4">
                  <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                    Controla producción, traslados y ventas desde una sola vista.
                  </h1>
                  <p className="max-w-xl text-base leading-7 text-slate-300">
                    Entra con tu usuario administrador o de punto para registrar movimientos reales, escanear QR y seguir cada unidad desde que se produce hasta que se vende.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {highlights.map((item) => (
                    <Card key={item.title} className="border-white/10 bg-white/5 text-white shadow-none">
                      <CardContent className="space-y-3 p-4">
                        <item.icon className="h-5 w-5 text-amber-300" />
                        <div>
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-300">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <CakeSlice className="h-4 w-4 text-amber-300" />
                  <span>Accesos de demo</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Administrador</p>
                    <p className="mt-2 text-sm font-medium">admin@pasteleria.com</p>
                    <p className="text-sm text-slate-300">TuPasswordSegura123</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Sucursal Lopez</p>
                    <p className="mt-2 text-sm font-medium">punto.lopez@pasteleria.com</p>
                    <p className="text-sm text-slate-300">LopezDemo123</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="mx-auto flex h-full w-full max-w-md items-center">
              <div className="w-full space-y-8">
                <div className="space-y-3">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Inventario Pasteleria</p>
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Ingresa a tu cuenta</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Usa los accesos de demo para validar dashboard, inventario, QR, caja y movimientos entre sedes.
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <LoginForm disabled={hasSupabaseConfigError} disabledMessage={hasSupabaseConfigError ? configMessage : undefined} />
                </div>

                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">Recomendado para demo</p>
                  <p className="mt-1">
                    Prueba primero con la cuenta admin para revisar ventas globales, movimientos recientes y visibilidad entre puntos.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
