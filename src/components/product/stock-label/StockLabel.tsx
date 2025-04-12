"use client";

import { getStockBySlug } from "@/actions";
import { titleFont } from "@/config/fonts";
import React, { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getStock(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStock = async (slug: string) => {
    const inStock = (await getStockBySlug(slug)) ?? 0;
    setStock(inStock);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <h1
          className={`${titleFont.className} antialiased font-bol text-lg bg-gray-200 animate-pulse`}
        >
          &nbsp;
        </h1>
      ) : (
        <h1 className={`${titleFont.className} antialiased font-bol text-lg`}>
          Stock: {stock}
        </h1>
      )}
    </>
  );
};
