import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrScanner } from "@/components/forms/qr-scanner";
export default function EscanearPage() { return <div className="mx-auto max-w-xl space-y-6"><div><h1 className="text-3xl font-semibold tracking-tight">Escanear QR</h1><p className="text-muted-foreground">Usa la cámara del celular para buscar una torta y registrar acciones.</p></div><Card><CardHeader><CardTitle>Cámara</CardTitle></CardHeader><CardContent><Suspense><QrScanner /></Suspense></CardContent></Card></div>; }
