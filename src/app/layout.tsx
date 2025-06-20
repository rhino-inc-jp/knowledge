import type { Metadata } from "next";
import "../styles/globals.scss"

import Header from "@/components/layouts/Header"
import Fotter from "@/components/layouts/Footer";

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
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/nnm5oqg.css"></link>
      </head>
      <body>
        <Header />

        <main>
          {children}
        </main>

        <Fotter />
      </body>
    </html>
  );
}
