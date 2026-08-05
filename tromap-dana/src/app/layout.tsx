import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TroProvider } from "@/components/providers/TroProvider";
import NewDataNotification from "@/components/providers/NewDataNotification";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tromapdana.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "TroMapDana - Tìm Nhà Trọ Đà Nẵng",
    template: "%s | TroMapDana",
  },
  description: "Bản đồ nhà trọ Đà Nẵng - Hỗ trợ sinh viên tìm trọ nhanh chóng, dễ dàng. Khám phá các nhà trọ xung quanh bạn với bản đồ trực quan.",
  keywords: [
    "nhà trọ Đà Nẵng",
    "tìm trọ Đà Nẵng",
    "trọ sinh viên",
    "phòng trọ",
    "bản đồ nhà trọ",
    "thuê nhà Đà Nẵng",
    "nhà trọ gần trường",
    "trọ giá rẻ Đà Nẵng",
  ],
  authors: [{ name: "TroMapDana" }],
  creator: "TroMapDana",
  publisher: "TroMapDana",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: BASE_URL,
    siteName: "TroMapDana",
    title: "TroMapDana - Tìm Nhà Trọ Đà Nẵng",
    description: "Bản đồ nhà trọ Đà Nẵng - Hỗ trợ sinh viên tìm trọ nhanh chóng, dễ dàng",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TroMapDana - Bản đồ nhà trọ Đà Nẵng",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TroMapDana - Tìm Nhà Trọ Đà Nẵng",
    description: "Bản đồ nhà trọ Đà Nẵng - Hỗ trợ sinh viên tìm trọ nhanh chóng",
    images: ["/og-image.png"],
    creator: "@tromapdana",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "vi-VN": BASE_URL,
    },
  },
  geo: {
    placename: "Da Nang, Vietnam",
    position: "16.0544;108.2022",
    region: "VN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#00B4D8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Theme script to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('tro-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased h-screen w-screen overflow-hidden">
        <ThemeProvider>
          <ToastProvider>
            <TroProvider>
              <NewDataNotification />
              {children}
            </TroProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
