export const revalidate = 60;

import { getPaginatedProducts } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { nickainley, sequel } from "@/config/fonts";
import { redirect } from "next/navigation";

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
        <div className="flex flex-col items-start justify-start gap-0 mb-8 px-10 max-w-lg pt-10">
            <h2 className={`${sequel.className} text-4xl max-w-4xl text-orange-650 leading-tight`}>Tienda</h2>
            <h3 className={`${nickainley.className} text-2xl max-w-4xl text-gray-900 leading-tight`}>Bienvenidos a tradiciones de Chillán</h3>
        </div>
      <ProductGrid products={products} />

     <div className="w-full flex items-center justify-center px-10 mb-10">
         <Pagination totalPages={totalPages} />
     </div>
    </>
  );
}
