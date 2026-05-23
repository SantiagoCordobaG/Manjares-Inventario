import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccessDenied({
  title = "Sin acceso",
  message = "Tu perfil no tiene permisos para ver esta seccion."
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <Card className="border-amber-200 bg-amber-50/60">
        <CardHeader>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-amber-900/80">{message}</p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Volver al dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
