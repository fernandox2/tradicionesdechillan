import Image from "next/image";
import { Title } from "@/components";
import Link from "next/link";
import { ProductsInCart } from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/PlaceOrder";

export default function CheckoutPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0 py-10">
      <div className="flex flex-col w-[1000px]">
        <h2 className="text-2xl font-bold mb-2">Verificar Orden</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <span className="text-xl">Ajustar elemento</span>

            <Link href="/cart" className="underline mb-5">
              Editar Carrito
            </Link>

            <ProductsInCart />
          </div>
          <PlaceOrder />
        </div>
      </div>
    </div>
  );
}
