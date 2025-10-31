import type { Metadata } from "next";
import "../styles/globals.css";

import Script from "next/script";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export const metadata: Metadata = {
  title: "Nowledge",
  description: "Case Study Sharing by Rhino inc.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/nnm5oqg.css"
        ></link>

        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7FCQYMH6XY"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7FCQYMH6XY');
          `}
        </Script>
      </head>
      <body className="text-xs relative font-normal not-italic text-black font-noto pt-[179px] md:pt-[260px]">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
