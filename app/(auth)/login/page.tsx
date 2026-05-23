import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-grid p-4">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-medium text-muted-foreground">Inventario Pastelería</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Ingresa a tu cuenta</h1>
          <p className="mt-2 text-sm text-muted-foreground">Control individual de tortas con QR, vencimientos y caja.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
