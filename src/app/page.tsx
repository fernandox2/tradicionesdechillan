import { redirect } from "next/navigation";

import { getPaginatedProducts } from "@/actions";
import { OurMark, ProductPremium, TopMenu, HomeSlider, ProductFormat, MapSection, Footer, Contact, Blog } from "@/components";
import { getFakeLocales } from "@/data/fake-data";

export const metadata = {
  title: "Fábrica de Longanizas Premium | Sabores Tradicionales",
  description: "Descubre nuestras longanizas artesanales premium, elaboradas con recetas tradicionales que garantizan calidad y autenticidad en cada bocado.",
  openGraph: {
    title: "Fábrica de Longanizas Premium | Sabores Tradicionales",
    description: "Disfruta de longanizas artesanales de alta calidad, preparadas con técnicas tradicionales para ofrecerte un sabor inigualable.",
    url: "https://www.tufabricadelonganizas.cl",
    siteName: "Fábrica de Longanizas Premium",
    images: [
      {
        url: "/imgs/longa-900.webp",
        width: 800,
        height: 600,
        alt: "Fábrica de Longanizas Premium - Sabores Tradicionales",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fábrica de Longanizas Premium | Sabores Tradicionales",
    description: "Saborea nuestras longanizas artesanales premium, una fusión de tradición y calidad en cada porción.",
    images: ["/imgs/longa-900.webp"],
  },
};

interface Props {
  searchParams: {
    page?: string;
  };
}


export default async function HomePage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || "";

  const { products } = await getPaginatedProducts({ page });

  if (products.length === 0) redirect("/");

  const locales = await getFakeLocales()

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col items-center bg-white">
      <TopMenu />

      <HomeSlider />

      <OurMark />

      <ProductPremium />

      <ProductFormat />

      <MapSection mapboxToken={mapboxToken} branches={locales} />

      <Contact />

      <Blog />

      <Footer />
      
    </div>
  );
}
