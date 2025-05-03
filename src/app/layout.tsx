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

import { MapboxScripts } from "@/components/home/map/MapboxScript";
import GoogleAnalytics from "@/components/Analytics";

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
      <head>
        <GoogleAnalytics trackingId={process.env.NEXT_PUBLIC_GTM_ID ?? ""} />
        <MapboxScripts />
      </head>

      <body
        className={`${inter.className} ${avenir_medium.variable} ${nickainley.variable} ${sequel.variable} ${avenir_light.variable}`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
