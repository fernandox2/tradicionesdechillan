"use client"

import Image from "next/image"
import dynamic from "next/dynamic"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useRef, useState, useEffect } from "react"
import { avenir_book } from "@/config/fonts"

type FormInputs = { name: string; email: string; message: string; foundBy: string }

const Spinner = () => (
  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z" />
  </svg>
)

export const Contact = ({ id }: { id: string }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [showCaptcha, setShowCaptcha] = useState(false)
  const recaptchaRef = useRef<any>(null)
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""

  const ReCAPTCHA = dynamic(() => import("@/components/RecaptchaClient"), {
    ssr: false,
  });

  const onSubmit = async (data: FormInputs) => {
    const token = await recaptchaRef.current?.executeAsync()
    recaptchaRef.current?.reset()
    if (!token) return alert("Error al validar reCAPTCHA.")
    setLoading(true)
    try {
      await axios.post("/api/contact", { ...data, token })
      setSuccess("¡Su mensaje ha sido enviado exitosamente!")
      reset()
      setTimeout(() => setSuccess(""), 5000)
    } catch {
      alert("Error al enviar el correo.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handler = () => setShowCaptcha(true)
    window.addEventListener("scroll", handler, { once: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <section id={id} className="flex lg:flex-col-reverse flex-col lg:grid lg:grid-cols-2 gap-4 h-auto md:h-[1050px] bg-[#dfdfdf] md:pb-0 pb-10">
      <div className="relative flex flex-col-reverse px-5 justify-center items-center w-full bg-[url('/imgs/img-contacto.webp')] bg-cover bg-center md:h-full h-[700px]">
        <Image width={242} height={349} src="/imgs/bandera3.webp" alt="Bandera Tradiciones" className="absolute top-0 left-16" />
      </div>

      <div className="flex flex-col items-center justify-center pt-10 lg:pb-10 xl:pb-0">
        <div className={`${avenir_book.className} text-xl text-justify px-10 xl:px-24`}>
          <span>
            <span className="font-bold">Comunícate con nosotros: </span><br /><br />
            ¿Tienes dudas, sugerencias, quieres ser distribuidor o simplemente quieres compartir una buena historia con longaniza de por medio?<br /><br />
            En <span className="font-bold">Tradiciones de Chillán</span> nos encanta escucharte. Escríbenos y te responderemos lo antes posible.<br /><br />
            Porque detrás de cada sabor hay personas, y nos gusta estar cerca de las nuestras.<br /><br />
            Completa el formulario y hablemos.
          </span>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6 mt-10" noValidate>
            <input type="text" placeholder="Nombre Completo" {...register("name", { required: "El nombre es obligatorio" })} className="p-2 border rounded h-[50px] focus:outline-none" />
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}

            <input type="email" placeholder="Correo Electrónico" {...register("email", {
              required: "El email es obligatorio",
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Formato de email inválido" }
            })} className="p-2 border rounded h-[50px] focus:outline-none" />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

            <label htmlFor="foundBy" className="sr-only">
              ¿Dónde nos encontraste?
            </label>
            <select
              id="foundBy"
              {...register("foundBy", { required: "Este campo es obligatorio" })}
              className="p-2 border rounded h-[50px] focus:outline-none"
            >
              <option value="">¿Dónde nos encontraste?</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="google">Google</option>
              <option value="recomendacion">Recomendación</option>
              <option value="otro">Otro</option>
            </select>
            {errors.foundBy && <span className="text-red-500 text-sm">{errors.foundBy.message}</span>}

            <textarea placeholder="Escribe tu mensaje aquí..." {...register("message", { required: "El mensaje es obligatorio" })} className="p-2 border rounded focus:outline-none" rows={4} />
            {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}

            {success && <span className="text-green-700 text-md">{success}</span>}

            {showCaptcha && <ReCAPTCHA ref={recaptchaRef} sitekey={siteKey} size="invisible" badge="bottomright" />}

            <button type="submit" disabled={loading} className={`self-end w-[200px] h-14 ${loading ? "bg-gray-400" : "bg-orange-650"} text-white rounded mt-4 hover:bg-gray-800 disabled:cursor-not-allowed flex items-center justify-center gap-2`}>
              {loading ? <>Enviando… <Spinner /></> : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
