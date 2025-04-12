export const revalidate = 60;

import { getPaginatedProducts } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { gender } = params;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProducts({
    page,
    gender: gender as Gender,
  });

  if (products.length === 0) redirect(`/gender/${gender}`);

  const labels: Record<string, string> = {
    men: "para hombres",
    women: "para mujeres",
    kid: "para niños",
    unisex: "para todos",
  };

  const labelSingle: Record<string, string> = {
    men: "en él",
    women: "en ella",
    kid: "en los mas pequeños",
    unisex: "para todos los gustos",
  };

  return (
    <>
      <Title
        title={`Artículos de ${labels[gender]}`}
        subtitle={`Productos pensados ${labelSingle[gender]}`}
        className="mb-2"
      />
      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
