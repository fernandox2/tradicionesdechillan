"use client";

import React from "react";

import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const images = [
  "/imgs/home-slider/home-slider-3.jpg",
  "/imgs/home-slider/home-slider-1.jpg",
  "/imgs/home-slider/home-slider-2.jpg",
];

export const HomeSlider = () => {
  const [activeSlide, setActiveSlide] = React.useState(0);

  return (
    <div className="relative w-full max-w-[1440px] lg:max-h-[700px] max-h-[500px]">
      {activeSlide === 2 && (
        <Image
          width={59}
          height={120}
          src="/imgs/bandera1.webp"
          className="absolute z-10 top-0 lg:left-72 left-40"
          alt="Bandera Tradiciones"
        />
      )}
      {activeSlide === 1 && (
        <Image
          width={242}
          height={349}
          src="/imgs/home-slider/label.webp"
          className="absolute z-10 lg:top-40 top-10 lg:left-32 left-[100px]"
          alt="Bandera Tradiciones"
        />
      )}
      {activeSlide === 2 && (
        <Image
          width={514}
          height={270}
          src="/imgs/home-slider/label-2.webp"
          className="absolute z-10 top-60 lg:left-20 lg:-translate-x-0 left-1/2 -translate-x-1/2 lg:w-[514px] lg:h-[270px] w-[308px] h-[162px]"
          alt="Bandera Tradiciones"
        />
      )}

      {activeSlide === 0 && (
        <div>
          <Image
            width={59}
            height={129}
            src="/imgs/home-slider/label-4.png"
            className="absolute z-10 top-0 left-1/2 -translate-x-1/2"
            alt="Bandera Tradiciones"
          />

          <Image
            width={696}
            height={181}
            src="/imgs/home-slider/texto.png"
            className="absolute z-10 top-40 left-1/2 -translate-x-1/2"
            alt="Bandera Tradiciones"
          />
        </div>
      )}

      <Swiper
        modules={[Pagination, Autoplay, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        loop={true}
        autoplay={{ delay: 5000 }}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-[500px] lg:h-[700px]">
              <Image
                priority={index === 0}
                src={src}
                alt={`Slide ${index + 1}`}
                width={1440}
                height={700}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1440px"
                className="block w-full h-full object-cover object-bottom"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          position: absolute;
          bottom: 420px !important;
          left: 0;
          right: 0;
          text-align: center;
          z-index: 10 !important;
        }

        @media (min-width: 1024px) {
          .swiper-pagination {
            bottom: 250px !important;
          }
        }

        .swiper-pagination-bullet {
          width: 20px;
          height: 20px;
          margin: 0 20px !important;
          background: rgba(255, 255, 255, 1) !important;
          opacity: 1;
          border-radius: 50%;
          cursor: pointer;
          display: inline-block;
          transition: background-color 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: rgba(210, 55, 20, 1) !important;
        }
      `}</style>
    </div>
  );
};
