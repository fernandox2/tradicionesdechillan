"use client";

import Image from "next/image";

import { avenir_book } from "@/config/fonts";
import { useForm, SubmitHandler } from "react-hook-form";

type FormInputs = {
  name: string;
  email: string;
  message: string;
};


export const Contact = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex lg:flex-col-reverse flex-col lg:grid lg:grid-cols-2 gap-4 h-auto md:h-[956px] bg-[#dfdfdf] md:pb-0 pb-10">
      {/* Primera columna */}
      <div className="relative flex flex-col-reverse px-5 justify-center items-center w-full bg-[url('/imgs/img-contacto.webp')] bg-cover bg-center md:h-full h-[700px]">
        <Image
          width={242}
          height={349}
          src="/imgs/bandera3.webp"
          alt="Bandera Tradiciones"
          className="absolute top-0 left-16"
        />
      </div>

      {/* Segunda columna */}
      <div className={`flex flex-col items-center justify-center pt-10 lg:pb-10 xl:pb-0`}>
        {/* Texto */}
        <div
          className={`${avenir_book.className} text-xl text-justify px-10 xl:px-24`}
        >
          <span>
            <span className="font-bold">Comunícate con nosotros: </span>
            <br />
            <br />
            ¿Tienes dudas, sugerencias, quieres ser
            distribuidor o simplemente quieres compartir una buena historia con
            longaniza de por medio? 
            <br />
            <br />
            En <span className="font-bold">Tradiciones de Chillán</span> nos encanta
            escucharte. Escríbenos y te responderemos lo antes posible. Ya sea
            para consultas sobre nuestros productos, puntos de venta, alianzas
            comerciales o saludarnos después de un buen asado… ¡estamos aquí
            para ti! 
            <br />
            <br />
            Porque detrás de cada sabor hay personas, y nos gusta estar
            cerca de las nuestras. 
            <br />
            <br />
            Completa el formulario y hablemos.
          </span>

          {/* Formulario de Contacto*/}

            <form onSubmit={handleSubmit(onSubmit)} className={`${avenir_book.className} flex flex-col space-y-6 mt-10`} noValidate>
            <div className="flex flex-col">
              <input
              type="text"
              placeholder="Nombre Completo"
              {...register("name", { required: "El nombre es obligatorio" })}
              className="p-2 border rounded h-[50px] focus:outline-none"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>
            
            <div className="flex flex-col">
              <input
              type="email"
              placeholder="Correo Electrónico"
              {...register("email", { 
                required: "El email es obligatorio",
                pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Formato de email inválido"
                }
              })}
              className="p-2 border rounded h-[50px] focus:outline-none"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>
            
            <div className="flex flex-col">
              <textarea
              placeholder="Escribe tu mensaje aquí..."
              {...register("message", { required: "El mensaje es obligatorio" })}
              className="p-2 border rounded focus:outline-none"
              rows={4}
              ></textarea>
              {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}
            </div>
            
            <button
              type="submit"
              className="self-end w-[200px] h-14 bg-orange-650 text-white py-2 px-4 rounded mt-4 hover:bg-gray-800"
            >
              Enviar
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};
