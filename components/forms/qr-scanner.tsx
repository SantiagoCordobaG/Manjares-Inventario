"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function QrScanner() {
  const router = useRouter();
  const params = useSearchParams();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState("Listo para escanear");

  const openByCode = useCallback(async (raw: string) => {
    let code = raw;
    if (raw.includes("code=")) {
      try {
        code = new URL(raw).searchParams.get("code") ?? raw;
      } catch {
        code = raw.split("code=")[1] ?? raw;
      }
    }
    if (!code) return;
    const supabase = createClient();
    const { data } = await supabase.from("unidades_inventario").select("id").eq("qr_codigo", code).single();
    if (data?.id) router.push(`/inventario/${data.id}`); else setStatus("QR no encontrado");
  }, [router]);

  useEffect(() => { const code = params.get("code"); if (code) void openByCode(code); }, [openByCode, params]);

  async function start() {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    setStatus("Abriendo cámara...");
    try {
      await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, async (decodedText) => {
        await scanner.stop(); setStatus("QR detectado"); await openByCode(decodedText);
      }, () => undefined);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No fue posible abrir la cámara");
    }
  }
  async function stop() { if (scannerRef.current?.isScanning) await scannerRef.current.stop(); setStatus("Escáner detenido"); }
  return <div className="space-y-4"><div id="qr-reader" className="overflow-hidden rounded-2xl border bg-white" /><p className="text-sm text-muted-foreground">{status}</p><div className="flex gap-2"><Button onClick={start}>Activar cámara</Button><Button variant="outline" onClick={stop}>Detener</Button></div></div>;
}
