"use client";

import React, { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoRemoveOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  onQuantityChanged: (value: number) => void;
}

export const QuantitySelector = ({ quantity, onQuantityChanged  }: Props) => {


  const onValueChanged = (value: number) => {
    if (quantity + value < 1) {
      return;
    }

    onQuantityChanged(quantity + value);

  };
  return (
    <div className="flex">
      <button onClick={() => onValueChanged(-1)}>
        <IoRemoveOutline size={30} />
      </button>

      <span className="w-20 mx-3 p-x5 bg-gray-100 text-center rounded">
        { quantity }
      </span>

      <button onClick={() => onValueChanged(+1)}>
        <IoMdAddCircleOutline size={30} />
      </button>
    </div>
  );
};
