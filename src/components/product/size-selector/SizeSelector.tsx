import type { Size } from "@/interfaces";
import clsx from "clsx";
import React from "react";

interface Props {
  selectedSize?: Size;
  availableSizes: Size[];

  onSizeChanged: (size: Size) => void;
}

export const mappingSizes: Record<Size, string> = {
  NINE_HUNDRED_GRAMS: "900g",
  FOUR_HUNDRED_FIFTY_GRAMS: "450g",
  TWO_HUNDRED_FIFTY_GRAMS: "250g",
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
  XXXL: "XXXL"
}

export const SizeSelector = ({
  selectedSize,
  availableSizes,
  onSizeChanged,
}: Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Formatos disponibles</h3>

      <div className="flex">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChanged(size)}
            className={clsx("mx-2 hover:underline text-lg", {
              underline: size === selectedSize,
            })}
          >
            {mappingSizes[size] || size}
          </button>
        ))}
      </div>
    </div>
  );
};
