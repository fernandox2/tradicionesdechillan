import { NextResponse } from 'next/server';
import { WebpayPlus } from 'transbank-sdk';

export async function POST(request: Request) {
  try {
    const { token_ws } = await request.json();

    // Configuración (asegúrate de que estas variables estén en tu .env)
    const commerceCode = process.env.TRANSBANK_COMMERCE_CODE;
    const apiKey = process.env.TRANSBANK_API_KEY;
    const environment =
      process.env.TRANSBANK_ENVIRONMENT === 'PRODUCTION'
        ? WebpayPlus.production
        : WebpayPlus.integration;

    // Inicializamos la transacción
    const tx = new WebpayPlus.Transaction();

    // Llamamos a commit para confirmar la transacción con el token
    const commitResponse = await tx.commit(token_ws);

    return NextResponse.json({ commitResponse });
  } catch (error: any) {
    console.error('Error en commit API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
