import QRCode from "qrcode";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { code: string } }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const value = `${appUrl}/escanear?code=${encodeURIComponent(params.code)}`;
  const svg = await QRCode.toString(value, { type: "svg", margin: 1, width: 256 });
  return new NextResponse(svg, { headers: { "content-type": "image/svg+xml", "cache-control": "public, max-age=31536000" } });
}
