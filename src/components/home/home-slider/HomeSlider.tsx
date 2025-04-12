'use client'

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const images = [
    '/imgs/home-slider/home-slider-1.webp',
    '/imgs/home-slider/home-slider-1.webp',
    '/imgs/home-slider/home-slider-1.webp',
];

export const HomeSlider = () => {
    return (
        <div style={{ position: 'relative', maxHeight: '700px' }}>
            <Swiper
                modules={[Pagination, Autoplay, A11y]}
                spaceBetween={50}
                slidesPerView={1}
                pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active',
                }}
                loop={true}
                autoplay={{ delay: 5000 }}
            >
                {images.map((src, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={src}
                            alt={`Slide ${index + 1}`}
                            style={{
                                display: 'block',
                                width: '100%',
                                height: '700px',
                                objectFit: 'cover',
                                objectPosition: 'bottom',
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <style jsx global>{`
                .swiper-pagination {
                    position: absolute;
                    bottom: 250px !important; 
                    left: 0;
                    right: 0;
                    text-align: center;
                    z-index: 10 !important;
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