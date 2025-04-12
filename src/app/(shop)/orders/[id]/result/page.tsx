import { redirect } from "next/navigation";

import { decrypt } from "@/utils";
import { updateAndPayOrder } from "@/actions";


interface Props {
    params: {
      id: string;
    };
    searchParams :{
        token_ws?: string;
    }
  }

export default async function OrderPayResult ({ params, searchParams }: Props) {

    const { id } = params;
    const { token_ws } = searchParams;

    if (!id || !token_ws) redirect('/');

    if (!process.env.AUTH_SECRET) throw new Error('AUTH_SECRET is not defined');

    const realId = decrypt(id, process.env.AUTH_SECRET);

    // TODO: verificar que el token_ws sea valido en Transbank antes de actualizar la orden

    const { ok } = await updateAndPayOrder(realId, token_ws);

    if (!ok) redirect('/');

    redirect(`/orders/${realId}`);

}