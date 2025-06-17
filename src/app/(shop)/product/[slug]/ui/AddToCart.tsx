"use client";

import { useState } from "react";
import { QuantitySelector, SizeSelector } from "@/components";
import { Product, Size } from "@/interfaces";
import { useCartStore } from "@/store";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);

  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [posted, setPosted] = useState(false);

  const addTocart = () => {
    setPosted(true);
    if (!size) return;
    console.log("Agregando al carrito", size, quantity);
    addProductToCart({ product, size, quantity });
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      {posted && !size && (
        <span className="mt-2 text-red-500 fade-in">
          Debe de seleccionar un tamaño
        </span>
      )}

      {/* Selector de Tallas */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChanged={setSize}
      />

      {/* Selector de Cantidad */}
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      {/* Button */}
      <button className="btn-primary my-5" onClick={addTocart}>
        Agregar al carrito
      </button>
    </>
  );
};
