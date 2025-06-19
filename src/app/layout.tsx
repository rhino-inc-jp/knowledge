import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css"

import Header from "@/components/layouts/Header"
import Fotter from "@/components/layouts/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Knowledge",
  description: "Case Study Sharing by Rhino inc.",
  icons: {
    icon: '/favicon.png'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header />

        <main className="px-common-5p md:px-common-8p">
          {children}
        </main>

        <Fotter />
      </body>
    </html>
  );
}
