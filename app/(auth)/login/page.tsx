import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CakeSlice, QrCode, ShieldCheck, Store } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(17,24,39,0.08),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] p-4">
      <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-slate-900/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-4rem] h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col justify-between rounded-[2rem] border border-white/60 bg-slate-950 px-7 py-8 text-white shadow-2xl shadow-slate-950/10 sm:px-10 sm:py-10">
            <div className="space-y-6">
              <Badge className="w-fit bg-white/10 text-white hover:bg-white/10">Manjares Inventario</Badge>
              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">Controla tus tortas por sede, QR y estado en una sola pantalla.</h1>
                <p className="max-w-xl text-base leading-7 text-white/75">Accede con un usuario admin o una cuenta de sucursal para probar el flujo real en dashboard, inventario, escaneo y caja.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Card className="border-white/10 bg-white/5 shadow-none">
                  <CardContent className="p-4">
                    <QrCode className="mb-3 h-5 w-5 text-amber-300" />
                    <p className="text-sm font-medium">QR unico</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">Cada unidad física se rastrea por código.</p>
                  </CardContent>
                </Card>
                <Card className="border-white/10 bg-white/5 shadow-none">
                  <CardContent className="p-4">
                    <Store className="mb-3 h-5 w-5 text-emerald-300" />
                    <p className="text-sm font-medium">4 sedes</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">Guaduales, Lopez, Villa Colombia y Limonar.</p>
                  </CardContent>
                </Card>
                <Card className="border-white/10 bg-white/5 shadow-none">
                  <CardContent className="p-4">
                    <ShieldCheck className="mb-3 h-5 w-5 text-sky-300" />
                    <p className="text-sm font-medium">Roles</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">Admin y sucursal con permisos separados.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <CakeSlice className="h-4 w-4" />
                <span>Accesos de demo</span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-white/70 sm:grid-cols-2">
                <p><span className="font-medium text-white">Admin:</span> admin@pasteleria.com</p>
                <p><span className="font-medium text-white">Clave:</span> TuPasswordSegura123</p>
                <p><span className="font-medium text-white">Sucursal:</span> punto.lopez@pasteleria.com</p>
                <p><span className="font-medium text-white">Clave:</span> LopezDemo123</p>
              </div>
            </div>
          </section>
          <section className="flex items-center">
            <div className="w-full rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-8">
              <div className="mb-8">
                <p className="text-sm font-medium text-muted-foreground">Inventario Pastelería</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Ingresa a tu cuenta</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Usa los accesos de demo para revisar la experiencia completa y probar el flujo de tu sede.</p>
              </div>
              <LoginForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
