"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import clsx from "clsx";

import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { placeOrder } from "@/actions";

export const PlaceOrder = () => {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);

  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productToOrder = cart.map((product) => {
      return {
        productId: product.product.id,
        quantity: product.quantity,
        size: product.size,
      };
    });

    const resp = await placeOrder(productToOrder, address);

    if (!resp.ok) {
      setErrorMessage(resp.message);
      setIsPlacingOrder(false);
      return;
    }

    clearCart();

    router.replace(`/orders/${resp.order?.id}`);
  };

  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl font-bold mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.city}</p>
        <p>{address.postalCode}</p>
        <p>{address.phone}</p>
      </div>
      {/* divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>
      <h2 className="text-2xl font-bold mb-2">Resumen de orden</h2>
      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
        </span>
        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>
        <span>Impuestos (19%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>
        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">
          {currencyFormat(total)}
        </span>
      </div>
      <div className="mt-5 mb-2 w-ful">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            Al hacer clic en Realizar pedido, aceptas nuestros{" "}
            <a href="#" className="underline">
              términos y condiciones.
            </a>
          </span>
        </p>

        <p className="text-red-500 pb-2">{errorMessage}</p>

        <button
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
          onClick={onPlaceOrder}
        >
          Realizar pedido
        </button>
      </div>
    </div>
  );
};
