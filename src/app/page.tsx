import { redirect } from "next/navigation";

import { getPaginatedProducts } from "@/actions";
import { OurMark, Pagination, ProductGrid, Title, TopMenu } from "@/components";
import { HomeSlider } from "@/components";

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProducts({ page });

  if (products.length === 0) redirect("/");

  return (
    <>
        <TopMenu />

        <HomeSlider />

        <OurMark />

    </>
  );
}
