import { redirect } from "next/navigation";

import { getPaginatedProducts } from "@/actions";
import { OurMark, ProductPremium, TopMenu, HomeSlider, ProductFormat, MapSection, Footer, Contact, Blog, Sidebar } from "@/components";
import { getFakeLocales } from "@/data/fake-data";
import { auth } from "@/auth.config";

export const metadata = {
  title: "Tradiciones de Chillán | Fábrica de Longanizas Premium",
  description: "Descubre nuestras longanizas artesanales premium, elaboradas con recetas tradicionales que garantizan calidad y autenticidad en cada bocado.",
  openGraph: {
    title: "Tradiciones de Chillán | Fábrica de Longanizas Premium",
    description: "Disfruta de longanizas artesanales de alta calidad, preparadas con técnicas tradicionales para ofrecerte un sabor inigualable.",
    url: "https://www.tradicionesdechillan.cl",
    siteName: "Longanizas Tradiciones de Chillán",
    images: [
      {
        url: "/imgs/img-nuestra-marca",
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
    title: "Tradiciones de Chillán | Fábrica de Longanizas Premium",
    description: "Saborea nuestras longanizas artesanales premium, una fusión de tradición y calidad en cada porción.",
    images: ["/imgs/img-nuestra-marca"],
  },
};

interface Props {
  searchParams: {
    page?: string;
  };
}


export default async function HomePage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const session = await auth()

  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || "";

  const { products } = await getPaginatedProducts({ page });

  if (products.length === 0) redirect("/");

  const locales = await getFakeLocales()

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col items-center bg-white">
      <TopMenu />

      <Sidebar session={session} /> 

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
