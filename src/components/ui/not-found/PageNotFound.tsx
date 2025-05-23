import { titleFont } from '@/config/fonts'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const PageNotFound = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row h-[600px] w-full justify-center items-center align-middle">
        <div className="text-center px-5 mx-5">
            <h1 className={`${titleFont.className} antialiased text-9xl`}>404</h1>
            <p className="font-semibold text-xl">Página no encontrada</p>
            <p className="font-light">
                <span>Puedes regresar al </span>
                <Link href="/" className="font-normal hover:underline transition-all">inicio</Link>
            </p>
        </div>

        <div className="px-5 mx-5">
            <Image
                className='p-5 sm:p-0'
                src="/imgs/starman_750x750.png"
                alt="starman"
                width={500}
                height={500}
            />
        </div>
    </div>
  )
}
