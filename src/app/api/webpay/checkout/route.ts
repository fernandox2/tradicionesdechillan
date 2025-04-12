import { encrypt } from '@/utils';
import { NextResponse } from 'next/server';
import { WebpayPlus } from 'transbank-sdk';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    // Configuración (asegúrate de tener estas variables en tu .env)
    const commerceCode = process.env.TRANSBANK_COMMERCE_CODE;
    const apiKey = process.env.TRANSBANK_API_KEY;
    const environment =
      process.env.TRANSBANK_ENVIRONMENT === 'PRODUCTION'
        ? WebpayPlus.production
        : WebpayPlus.integration;

    // Inicializamos la transacción
    const tx = new WebpayPlus.Transaction();

    // Datos de la transacción
    const buyOrder = orderId;
    const sessionId = orderId; // Puedes generar un sessionId distinto si lo requieres
    const amount = 1000; // Ajusta el monto según la orden
    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${encrypt(orderId, process.env.AUTH_SECRET!)}/result`;

    // Crea la transacción (el método create puede variar según la versión del SDK)
    const createResponse = await tx.create(buyOrder, sessionId, amount, returnUrl);

    // Retornamos token y url para luego enviarlo como POST
    return NextResponse.json({ token: createResponse.token, url: createResponse.url });
  } catch (error: any) {
    console.error('Error en checkout API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
