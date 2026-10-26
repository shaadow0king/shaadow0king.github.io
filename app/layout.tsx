import type { Metadata, Viewport } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL("https://shaadow0king.github.io/"),
  title: "Gevork Akopyan — QA Engineer",
  description:
    "QA Engineer CV: professional experience, technical skills, tools and contact information.",
  icons: {
    icon: `${basePath}/assets/img/favicon.ico`,
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Gevork Akopyan — QA Engineer",
    description: "QA Engineer, 4+ years in mobile apps & games: Glam AI, Playrix, Playgendary. Belgrade.",
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["en_US"],
    images: [{ url: "./og-cover.png", width: 1200, height: 630, alt: "Gevork Akopyan — QA Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gevork Akopyan — QA Engineer",
    description: "QA Engineer, 4+ years in mobile apps & games: Glam AI, Playrix, Playgendary. Belgrade.",
    images: ["./og-cover.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&display=swap" rel="stylesheet" />
        <noscript>
          <style>{".boot{display:none}"}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
