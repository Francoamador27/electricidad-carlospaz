import type { Metadata, Viewport } from "next";
import AdminShell from "@/components/admin/AdminShell";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Panel Voltis" },
  robots: { index: false, follow: false },
  // App instalable: el manifest y los íconos son solo del panel (el sitio público no los usa).
  manifest: "/admin/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/admin/iconos/icono-192.png", sizes: "192x192", type: "image/png" },
      { url: "/admin/iconos/icono-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/admin/iconos/apple-touch-icon.png", sizes: "180x180" }],
  },
  // iPhone: se abre a pantalla completa desde la pantalla de inicio, con el nombre "Voltis".
  appleWebApp: { capable: true, title: "Voltis", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Usa toda la pantalla del iPhone (notch / isla dinámica); el panel respeta las áreas seguras.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
