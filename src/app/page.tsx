import Image from "next/image";
import { redirect } from "next/navigation";
import { getPaginatedProducts } from "@/actions";
import {
  OurMark,
  ProductPremium,
  TopMenu,
  ProductFormat,
  Footer,
  Contact,
  Blog,
} from "@/components";
import { getFakeLocales } from "@/data/fake-data";
import dynamicImport from "next/dynamic";
import { getPaginatedArticlesAdmin } from "@/actions/article/article-pagination";
import { Article } from "@/interfaces";

export const metadata = {
  metadataBase: new URL("https://www.tradicionesdechillan.cl"),
  title: "Tradiciones de Chillán | Fábrica de Longanizas Premium",
  description:
    "Descubre nuestras longanizas artesanales premium, elaboradas con recetas tradicionales que garantizan calidad y autenticidad en cada bocado.",
  openGraph: {
    title: "Tradiciones de Chillán | Fábrica de Longanizas Premium",
    description:
      "Disfruta de longanizas artesanales de alta calidad, preparadas con técnicas tradicionales para ofrecerte un sabor inigualable.",
    url: "https://www.tradicionesdechillan.cl",
    siteName: "Longanizas Tradiciones de Chillán",
    images: [
      {
        url: "/imgs/longa-900.png",
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
    description:
      "Saborea nuestras longanizas artesanales premium, una fusión de tradición y calidad en cada porción.",
    images: ["/imgs/longa-900.png"],
  },
};

export const dynamic = "force-static";
export const revalidate = 3600;

interface Props {
  searchParams: { page?: string };
}

export default async function HomePage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN ?? "";

  const locales = await getFakeLocales();

  const articles = await getPaginatedArticlesAdmin({ page: 1, take: 3 });

  const Sidebar = dynamicImport(
    () => import("@/components/ui/sidebar/Sidebar").then((m) => m.Sidebar),
    { ssr: false }
  );

  const DynamicMapComponent = dynamicImport(
    () => import("@/components/home/map/MapSection").then((m) => m.MapSection),
    { ssr: false, loading: () => <p>Cargando mapa…</p> }
  );

  const HomeSlider = dynamicImport(
    () =>
      import("@/components/home/home-slider/HomeSlider").then(
        (m) => m.HomeSlider
      ),
    { ssr: true, loading: () => <div className="h-[300px]">Cargando slider…</div> }
  );

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col items-center bg-white">
      <TopMenu />
      <Sidebar />
      <HomeSlider />
      <OurMark id="nosotros" />
      <ProductPremium />
      <ProductFormat id="productos" />
      <DynamicMapComponent
        mapboxToken={mapboxToken}
        branches={locales}
        id="distribuidores"
      />
      <Contact id="contacto" />
      <Blog id="blog" articles={articles.articles as unknown as Article[]} />
      <Footer />
    </div>
  );
}
