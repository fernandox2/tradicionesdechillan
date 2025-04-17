import { Inter, Montserrat_Alternates } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({ subsets: ["latin"] });

export const titleFont = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const avenir_medium = localFont({
  src: '../app/fonts/avenir/Avenir-Medium-09.ttf',
  variable: '--font-avenir',
});

export const avenir_black = localFont({
  src: '../app/fonts/avenir/Avenir-Black-03.ttf',
  variable: '--font-avenir-black',
});

export const avenir_light = localFont({
  src: '../app/fonts/avenir/Avenir-Light-07.ttf',
  variable: '--font-avenir-light',
});

export const avenir_book = localFont({
  src: '../app/fonts/avenir/Avenir-Book-01.ttf',
  variable: '--font-avenir-book',
});


export const nickainley = localFont({
  src: '../app/fonts/Nickainley-Normal.otf',
  variable: '--font-nickainley',
});

export const sequel = localFont({
  src: '../app/fonts/Sequel_Demo.ttf',
  variable: '--font-sequel',
});

