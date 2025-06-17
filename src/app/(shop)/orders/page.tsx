export const revalidate = 0;

import { redirect } from "next/navigation";
import Link from "next/link";

import { IoCardOutline } from "react-icons/io5";

import { auth } from "@/auth.config";
import { Title } from "@/components";
import { getOrdersByUser } from "@/actions";
import { getAllOrders } from "@/actions/order/place-order";

export default async function ListOrderPage() {
  const session = await auth();

  if (!session) redirect("/");

  let ok;
  let orders: any[] = [];

  if (session.user.role === "user" || session.user.role === "distributor") {
    const respuesta = await getOrdersByUser(session.user.id);

    ok = respuesta.ok;
    orders = respuesta.orders || [];
  }

  if (session.user.role === "admin") {
    const respuesta = await getAllOrders();

    ok = respuesta.ok;
    orders = respuesta.orders || [];
  }

  if (!ok) redirect("/");

  return (
    <>
      <Title title="Orders" />

      <div className="mb-10 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                # ID
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Nombre completo
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Estado
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => {
              return (
                <tr
                  key={order.id}
                  className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 uppercase">
                    {order.id.slice(0, 12)}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("es-CL")}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {order.OrderAddress?.firstName}{" "}
                    {order.OrderAddress?.lastName}
                  </td>
                  <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {order.isPaid ? (
                      <>
                        <IoCardOutline className="text-green-800" />
                        <span className="mx-2 text-green-800">Pagada</span>
                      </>
                    ) : (
                      <>
                        <IoCardOutline className="text-red-800" />
                        <span className="mx-2 text-red-800">No Pagada</span>
                      </>
                    )}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 ">
                    <Link
                      href={`/orders/${order.id}`}
                      className="hover:underline"
                    >
                      Ver orden
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
