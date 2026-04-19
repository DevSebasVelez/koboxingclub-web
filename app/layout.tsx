import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://koboxingclub.com"),
  title: {
    default: "KO Boxing Club — Boxeo en Cuenca, Ecuador",
    template: "%s | KO Boxing Club",
  },
  description:
    "Gimnasio de boxeo profesional en Cuenca, Ecuador. Entrenamientos para todos los niveles con técnica real de ring. KO Boxing Club & KO Boxing Promotions.",
  keywords: [
    "boxeo Cuenca",
    "gimnasio boxeo Ecuador",
    "KO Boxing Club",
    "Fernando Palomeque",
    "boxeo profesional Cuenca",
    "clases de boxeo",
    "KO Boxing Promotions",
    "veladas de boxeo Ecuador",
  ],
  authors: [{ name: "KO Boxing Club" }],
  creator: "KO Boxing Club",
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: "https://koboxingclub.com",
    siteName: "KO Boxing Club",
    title: "KO Boxing Club — Boxeo en Cuenca, Ecuador",
    description:
      "Gimnasio de boxeo profesional en Cuenca, Ecuador. Entrenamientos para todos los niveles con técnica real de ring.",
    images: [
      {
        url: "/images/gallery/image-2.jpg",
        width: 1080,
        height: 1080,
        alt: "KO Boxing Club — Fernando Palomeque en el ring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KO Boxing Club — Boxeo en Cuenca, Ecuador",
    description:
      "Gimnasio de boxeo profesional en Cuenca, Ecuador. Técnica real de ring para todos los niveles.",
    images: ["/images/gallery/image-2.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
