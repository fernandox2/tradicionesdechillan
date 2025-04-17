import { redirect } from "next/navigation";

import { getPaginatedProducts } from "@/actions";
import { OurMark, ProductPremium, TopMenu, HomeSlider, ProductFormat, MapSection, Footer, Contact, Blog } from "@/components";
import { Branch } from "@/interfaces";
import { getFakeLocales } from "@/data/fake-data";

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
