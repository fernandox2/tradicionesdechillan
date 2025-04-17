import type { Metadata } from "next";

import "./globals.css";

import { avenir_light, avenir_medium, inter, nickainley, sequel } from "@/config/fonts";
import { Provider } from "@/components";


export const metadata: Metadata = {
  title: {
    template: "%s - Tradiciones de Chillán",
    default: "Home - Tradiciones de Chillán",
  },
  description: "Cecinas Tradiciones de Chillán",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${avenir_medium.variable} ${nickainley.variable} ${sequel.variable} ${avenir_light.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
