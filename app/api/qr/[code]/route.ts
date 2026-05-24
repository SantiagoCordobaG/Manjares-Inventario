import QRCode from "qrcode";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { code: string } }) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const value = `${appUrl}/escanear?code=${encodeURIComponent(params.code)}`;
  const png = await QRCode.toBuffer(value, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 512,
    color: {
      dark: "#111827",
      light: "#FFFFFF"
    }
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable"
    }
  });
}
