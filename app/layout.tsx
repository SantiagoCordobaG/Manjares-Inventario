import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inventario Pastelería",
  description: "MVP de inventario individual con QR y trazabilidad para tortas y pastelería"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
