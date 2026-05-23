import { Card, CardContent } from "@/components/ui/card";
export function KpiCard({ title, value, helper }: { title: string; value: string | number; helper?: string }) {
  return <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">{title}</p><p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>{helper && <p className="mt-2 text-xs text-muted-foreground">{helper}</p>}</CardContent></Card>;
}
