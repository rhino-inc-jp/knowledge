import type { Metadata } from "next";
import "../styles/globals.css";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export const metadata: Metadata = {
  title: "Knowledge",
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
      </head>
      <body className="text-xs relative font-normal not-italic text-black font-noto pt-[179px] md:pt-[260px]">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
