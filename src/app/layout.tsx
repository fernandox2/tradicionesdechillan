import type { Metadata } from "next";

import "./globals.css";

import {
  avenir_light,
  avenir_medium,
  inter,
  nickainley,
  sequel,
} from "@/config/fonts";
import { Provider } from "@/components";

import Script from "next/script";

export const metadata: Metadata = {
  title: {
    template: "%s - Tradiciones de Chillán",
    default: "Home - Tradiciones de Chillán",
  },
  description: "Cecinas Tradiciones de Chillán",
  icons: {
    icon: "imgs/favicon.ico",
    shortcut: "imgs/favicon.ico",
    apple: "imgs/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} ${avenir_medium.variable} ${nickainley.variable} ${sequel.variable} ${avenir_light.variable}`}
      >
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID}'+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
          `}
        </Script>

        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
