import Image from "next/image";
import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSummary } from "./ui/OrderSummary";
import { nickainley, sequel } from "@/config/fonts";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

export default function CartPage() {
  productsInCart.length === 0 ? redirect("/empty") : null;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col max-w-7xl py-20">
        <div className="flex flex-col items-start justify-start gap-0 mb-8 px-10 max-w-lg">
          <h2
            className={`${sequel.className} text-4xl max-w-4xl text-orange-650 leading-tight`}
          >
            Carrito
          </h2>
          <h3
            className={`${nickainley.className} text-2xl max-w-4xl text-gray-900 leading-tight`}
          >
            en los mejores lugares de Chile
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Agregar mas productos</span>
            <Link href="/shop" className="underline mb-5">
              Continúa comprando
            </Link>

            {/* Items del Carrito */}
            <ProductsInCart />
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <OrderSummary />

            <div className="mt-5 mb-2 w-ful">
              <Link
                className="flex btn-primary justify-center"
                href="/checkout/address"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
