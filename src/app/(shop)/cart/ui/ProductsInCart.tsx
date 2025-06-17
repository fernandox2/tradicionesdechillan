"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useCartStore } from "@/store";
import { mappingSizes, QuantitySelector } from "@/components";
import Link from "next/link";

export const ProductsInCart = () => {
  const updatedProductsQuantity = useCartStore(
    (state) => state.updateProductQuantity
  );
  const removeProductFromCart = useCartStore(
    (state) => state.removeProductFromCart
  );

  const [loaded, setLoaded] = useState(false);

  const productsInCart = useCartStore((state) => state.cart);

  useEffect(() => {
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

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
            src={product.product.images[0]}
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
            <Link
              className="hover:underline cursor-pointer"
              href={`/product/${product.product.slug}`}
            >
              {mappingSizes[product.size] || product.size} - {product.product.title}
            </Link>
            <p>{product.product.price}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChanged={(quantity) =>
                updatedProductsQuantity(product, quantity)
              }
            />
            <button
              className="underline mt-3"
              onClick={() => removeProductFromCart(product)}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
