import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { getAdminSalesOverview, getDashboardStats, getProfile, getRecentAdminMovements, getSalesSeries } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

function movementVariant(tipo: string): "default" | "success" | "warning" | "danger" | "muted" {
  if (tipo === "venta") return "success";
  if (tipo === "traslado") return "warning";
  if (tipo === "vencimiento" || tipo === "perdida") return "danger";
  return "muted";
}

function movementLabel(tipo: string) {
  if (tipo === "venta") return "Venta";
  if (tipo === "traslado") return "Traslado";
  if (tipo === "vencimiento") return "Vencimiento";
  if (tipo === "perdida") return "Perdida";
  return tipo;
}

export default async function DashboardPage() {
  const profile = await getProfile();
  const isAdmin = profile?.rol === "admin";

  const [stats, salesSeries, adminSalesOverview, recentAdminMovements] = await Promise.all([
    getDashboardStats(),
    getSalesSeries(),
    isAdmin ? getAdminSalesOverview() : Promise.resolve(null),
    isAdmin ? getRecentAdminMovements() : Promise.resolve([])
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Resumen operativo de inventario, vencimientos y ventas.</p>
        </div>
        {isAdmin ? <Badge>Vista global administrador</Badge> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Disponibles" value={stats.disponibles} helper="Unidades listas para venta" />
        <KpiCard title="Por vencer" value={stats.porVencer} helper="Vencen en próximos 2 días" />
        <KpiCard title="Vencidas" value={stats.vencidas} helper="Requieren acción" />
        <KpiCard title="Ventas hoy" value={stats.ventasDia} helper={isAdmin ? "Suma de todas las sedes" : "Según movimientos registrados"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ventas por día</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart data={salesSeries} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-800">Revisar unidades próximas a vencer.</div>
            <div className="rounded-xl bg-red-50 p-3 text-red-800">Retirar o corregir unidades vencidas.</div>
            <div className="rounded-xl bg-slate-50 p-3 text-slate-700">Conciliar caja al cierre del día.</div>
          </CardContent>
        </Card>
      </div>

      {isAdmin && adminSalesOverview ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard title="Ventas globales 7 días" value={adminSalesOverview.total.ventasPeriodo} helper="Total de ventas sumadas entre todas las sedes" />
            <KpiCard title="Ingresos estimados 7 días" value={formatCurrency(adminSalesOverview.total.ingresos)} helper="Calculado con el precio de cada unidad vendida" />
            <KpiCard title="Sedes activas en ventas" value={`${adminSalesOverview.total.puntosActivos}/${adminSalesOverview.puntos.length}`} helper="Puntos con al menos una venta en el periodo" />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <CardHeader>
                <CardTitle>Ventas por punto</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <THead>
                    <TR>
                      <TH>Punto</TH>
                      <TH>Ventas hoy</TH>
                      <TH>Ventas 7 días</TH>
                      <TH>Ingresos</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {adminSalesOverview.puntos.map((item) => (
                      <TR key={item.puntoId ?? item.punto}>
                        <TD className="font-medium">{item.punto}</TD>
                        <TD>{item.ventasHoy}</TD>
                        <TD>{item.ventasPeriodo}</TD>
                        <TD>{formatCurrency(item.ingresos)}</TD>
                      </TR>
                    ))}
                    <TR className="bg-slate-50 font-semibold hover:bg-slate-50">
                      <TD>Total</TD>
                      <TD>{adminSalesOverview.total.ventasHoy}</TD>
                      <TD>{adminSalesOverview.total.ventasPeriodo}</TD>
                      <TD>{formatCurrency(adminSalesOverview.total.ingresos)}</TD>
                    </TR>
                  </TBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Movimientos recientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAdminMovements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aún no hay movimientos visibles para mostrar.</p>
                ) : (
                  recentAdminMovements.map((movement) => (
                    <div key={movement.id} className="rounded-2xl border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs text-muted-foreground">{movement.unidadCodigo ?? "Sin QR"}</p>
                          <p className="mt-1 text-sm font-medium">
                            {movement.origen ?? "Sin origen"} {movement.destino ? `-> ${movement.destino}` : ""}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(movement.fecha)} · {movement.usuario ?? "Sistema"}
                          </p>
                        </div>
                        <Badge variant={movementVariant(movement.tipo)}>{movementLabel(movement.tipo)}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
