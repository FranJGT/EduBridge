import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduBridge - Math, Pair, and Beyond",
  description:
    "AI-powered math learning from basics to university. Works offline. Powered by Gemma 4.",
  keywords: ["education", "AI tutor", "math", "calculus", "algebra", "offline", "Gemma 4"],
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
  themeColor: "#4F46E5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased light`}
      style={{ colorScheme: "light" }}
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
