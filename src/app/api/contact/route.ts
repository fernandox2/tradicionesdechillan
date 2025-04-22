import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import axios from "axios";
import { NextApiResponse } from "next";

export async function POST(request: Request, res: NextApiResponse) {
  const { name, email, message, foundBy, token } = await request.json();

  const verifyRes = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      },
    }
  );

  const { success } = verifyRes.data;

  if (!success) {
    return res.status(400).json({ error: "Falló la validación de reCAPTCHA" });
  }

  const transporter = nodemailer.createTransport({
    host: "mail.tradicionesdechillan.cl",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const adminMailOptions = {
    from: '"Formulario Web" <contacto@tradicionesdechillan.cl>',
    to: "contacto@tradicionesdechillan.cl",
    subject: `Nuevo contacto de ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #e65100;">Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>¿Donde nos encontraste?:</strong> ${foundBy}</p>
        <p><strong>Mensaje:</strong></p>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px;">
          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
        <hr style="margin-top: 30px;">
        <p style="font-size: 12px; color: #999;">Este mensaje fue enviado desde el formulario de contacto de Tradiciones de Chillán.</p>
      </div>
    `,
  };

  const userMailOptions = {
    from: '"Tradiciones de Chillán" <contacto@tradicionesdechillan.cl>',
    to: email,
    subject: "Gracias por contactarnos",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #e65100;">¡Gracias por escribirnos, ${name}!</h2>
        <p>Hemos recibido tu mensaje y te responderemos a la brevedad.</p>
        <p><strong>Tu mensaje:</strong></p>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px;">
          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
        <p style="margin-top: 20px;">Saludos cordiales,<br>El equipo de <strong>Tradiciones de Chillán</strong></p>
        <hr style="margin-top: 30px;">
        <p style="font-size: 12px; color: #999;">Este es un mensaje automático. No respondas a este correo.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json(
      { message: "Correos enviados correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al enviar correos:", error);
    return NextResponse.json(
      { message: "Error al enviar correos" },
      { status: 500 }
    );
  }
}
