import { Inter, Montserrat_Alternates } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const titleFont = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-title",
});

export const avenir_medium = localFont({
  src: "../app/fonts/avenir/Avenir-Medium-09.ttf",
  variable: "--font-avenir",
  display: "swap",
});

export const avenir_black = localFont({
  src: "../app/fonts/avenir/Avenir-Black-03.ttf",
  variable: "--font-avenir-black",
  display: "swap",
});

export const avenir_light = localFont({
  src: "../app/fonts/avenir/Avenir-Light-07.ttf",
  variable: "--font-avenir-light",
  display: "swap",
});

export const avenir_book = localFont({
  src: "../app/fonts/avenir/Avenir-Book-01.ttf",
  variable: "--font-avenir-book",
  display: "swap",
});

export const nickainley = localFont({
  src: "../app/fonts/Nickainley-Normal.otf",
  variable: "--font-nickainley",
  display: "swap",
});

export const sequel = localFont({
  src: "../app/fonts/Sequel_Demo.ttf",
  variable: "--font-sequel",
  display: "swap",
});
