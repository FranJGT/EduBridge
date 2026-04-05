import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Funnel_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const funnelSans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduBridge - AI Tutor, Zero Internet",
  description:
    "Offline-first adaptive AI tutor powered by Gemma 4. Reads handwritten work, adapts to student level, works in 140+ languages.",
  keywords: ["education", "AI tutor", "offline", "Gemma 4", "math"],
  authors: [{ name: "EduBridge Team" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EduBridge",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#7D6B3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${funnelSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker"in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js")})}`,
          }}
        />
      </body>
    </html>
  );
}
