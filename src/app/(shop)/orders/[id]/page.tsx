import { redirect } from "next/navigation";
import Image from "next/image";

import clsx from "clsx";

import { IoCardOutline } from "react-icons/io5";

import { Title } from "@/components";
import { getOrderById } from "@/actions";
import { currencyFormat } from "@/utils";
import WebpayButton from "@/components/WebpayButton";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: Props) {
  const { id } = params;

  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect("/");
  }

  const address = order?.OrderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0 py-10">
      <div className="flex flex-col w-[1000px]">
        <h2 className="text-2xl font-bold mb-2">{`Orden #${id}`}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <div
              className={clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-us font-bold text-white mb-5",
                {
                  "bg-red-500": !order!.isPaid,
                  "bg-green-700": order!.isPaid,
                }
              )}
            >
              <IoCardOutline size={30} />
              <span className="mx-2">
                {order?.isPaid ? "Pagada" : "Pendiente de Pago"}
              </span>
            </div>

            {/* Items del Carrito */}
            {order &&
              order.OrderItem.map((product) => (
                <div
                  key={product.product.slug + product.size}
                  className="flex mb-5"
                >
                  <Image
                    src={product.product.ProductImage[0].url}
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
                    <p>{product.product.title}</p>
                    <p>
                      {product.price} x {product.quantity}
                    </p>
                    <p className="font-bold">
                      {`Subtotal: ${currencyFormat(
                        product.price * product.quantity
                      )}`}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl font-bold mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              {address && (
                <>
                  <p className="text-xl">
                    {address.firstName} {address.lastName}
                  </p>
                  <p>{address.address}</p>
                  <p>{address.address2}</p>
                  <p>
                    {address.city}, {address.countryId}
                  </p>
                  <p>{address.postalCode}</p>
                  <p>{address.phone}</p>
                </>
              )}
            </div>
            {/* divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>
            <h2 className="text-2xl font-bold mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">
                {order!.itemsInOrder === 1
                  ? "1 artículo"
                  : `${order!.itemsInOrder} artículos`}
              </span>
              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormat(order!.subTotal)}
              </span>
              <span>Impuestos (19%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>
              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">
                {currencyFormat(order!.total)}
              </span>
            </div>

            {!order!.isPaid && (
              <div className="mt-5 mb-2 w-ful">
                <WebpayButton orderId={id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
