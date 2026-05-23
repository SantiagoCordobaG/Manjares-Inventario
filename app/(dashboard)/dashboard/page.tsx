import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { getDashboardStats, getSalesSeries } from "@/lib/data";

export default async function DashboardPage() {
  const [stats, salesSeries] = await Promise.all([getDashboardStats(), getSalesSeries()]);
  return <div className="space-y-6">
    <div><h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1><p className="text-muted-foreground">Resumen operativo de inventario, vencimientos y ventas.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard title="Disponibles" value={stats.disponibles} helper="Unidades listas para venta" />
      <KpiCard title="Por vencer" value={stats.porVencer} helper="Vencen en próximos 2 días" />
      <KpiCard title="Vencidas" value={stats.vencidas} helper="Requieren acción" />
      <KpiCard title="Ventas hoy" value={stats.ventasDia} helper="Según movimientos registrados" />
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2"><CardHeader><CardTitle>Ventas por día</CardTitle></CardHeader><CardContent><SalesChart data={salesSeries} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Alertas</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="rounded-xl bg-amber-50 p-3 text-amber-800">Revisar unidades próximas a vencer.</div><div className="rounded-xl bg-red-50 p-3 text-red-800">Retirar o corregir unidades vencidas.</div><div className="rounded-xl bg-slate-50 p-3 text-slate-700">Conciliar caja al cierre del día.</div></CardContent></Card>
    </div>
  </div>;
}
