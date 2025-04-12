"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";

export const ProductsInCart = () => {

  const [loaded, setLoaded] = useState(false);

  const productsInCart = useCartStore((state) => state.cart);

  useEffect(() => {
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded) {
    return <p>Loading ...</p>;
  }

  return (
    <>
      {productsInCart.map((product) => (
        <div
          key={`${product.product.slug} - ${product.product.id}`}
          className="flex mb-5"
        >
          <Image
            src={`/products/${product.product.images[0]}`}
            width={100}
            height={100}
            style={{
              width: 100,
              height: 100,
            }}
            alt={product.product.title}
            className="mr-5 rounded"
          />
          <div>
            <span>
              {product.size} - {product.product.title} ({product.quantity})
            </span>

            <p className="font-bold">
              {currencyFormat(product.product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
