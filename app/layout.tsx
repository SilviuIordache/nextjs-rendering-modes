import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import TopNav from "./components/TopNav";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Render Modes",
  description: "Demo app for SSG, ISR, SSR, and CSR routes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${manrope.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <TopNav />
        {children}
      </body>
    </html>
  );
}
