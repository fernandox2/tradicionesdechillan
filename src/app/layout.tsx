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
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    template: "%s - Tradiciones de Chillán",
    default: "Home - Tradiciones de Chillán",
  },
  description: "Cecinas Tradiciones de Chillán",
  icons: {
    icon: "imgs/favicon.ico",
    shortcut: "imgs/favicon.ico",
    apple: "imgs/icono-tradiciones.webp",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <GoogleAnalytics trackingId={process.env.NEXT_PUBLIC_GTM_ID!} />
      <body
        className={`${inter.className} ${avenir_medium.variable} ${nickainley.variable} ${sequel.variable} ${avenir_light.variable}`}
      >
        <Provider>
          <Toaster position="top-right" />
          {children}
        </Provider>
      </body>
    </html>
  );
}
