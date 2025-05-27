import Image from "next/image";

import { getPaginatedArticlesAdmin } from "@/actions/article/article-pagination";
import { Blog } from "./ui/Blog";
import { Article } from "@/interfaces";
import { Pagination } from "@/components";
import { Filters } from "./ui/Filters";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: {
    page?: string;
    take?: string;
    query?: string;
  };
}

export default async function BlogPage({ searchParams: _ }: Props) {
  const searchParams = _;
  const page = parseInt(searchParams.page || "1", 10);
  const take = parseInt(searchParams.take || "6", 10);
  const query = searchParams.query || "";

  const { articles, totalArticles, totalPages } =
    await getPaginatedArticlesAdmin({ page, take, query });

  return (
    <div className="flex relative flex-col gap-20 items-center justify-start min-h-[1300px] px-5 py-20 max-w-[1440px] mx-auto bg-black/20">
      <div className="absolute inset-0 ">
        <Image
          src={"/imgs/background-blog.jpg"}
          alt={"Background Blog"}
          layout="fill"
          objectFit="cover"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

        <Filters />


      <Image
        src={"/imgs/bandera4.webp"}
        alt={"Nuestro Blog"}
        width={242}
        height={349}
        className="absolute top-1/2 left-0 transform -translate-y-1/2"
      />

      <Blog articles={articles as unknown as Article[]} className="absolute top-1/2 transform -translate-y-1/2 ml-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"/>

      <Pagination totalPages={totalPages} className="absolute bottom-10" />
    </div>
  );
}
