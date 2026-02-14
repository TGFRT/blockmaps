import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "GeoGuide - Tu guía de mapas con IA",
    description: "Encuentra lugares y negocios con la potencia de Gemini y Google Maps",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
