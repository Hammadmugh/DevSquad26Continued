'use client';

import { gamesOnSale } from "@/data";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from "next/image";
import { useRef } from "react";

interface GamesOnSaleProps {
  title: string;
}

export default function GamesOnSale({ title }: GamesOnSaleProps) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1">
        <p className="text-white font-medium text-[18px] ">{title}</p>
        <Image src={"/gameOnSale.png"} alt="game" width={9} height={9}/>
        </div>
        <div className="flex gap-1">
          <button ref={prevRef}><Image src="/right-btn.png" width={30} height={30} alt="prev" className="rotate-180 cursor-pointer" /></button>
          <button ref={nextRef}><Image src="/right-btn.png" width={30} height={30} alt="next" className="cursor-pointer" /></button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        loop={true}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        pagination={{ clickable: true }}
        slidesPerView={1}
        spaceBetween={16}
        breakpoints={{
          337: {slidesPerView: 1.5},
          640: { slidesPerView: 4 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        onSwiper={(swiper) => {
          setTimeout(() => {
            if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
              (swiper.params.navigation as any).prevEl = prevRef.current;
              (swiper.params.navigation as any).nextEl = nextRef.current;
              swiper.navigation.destroy();
              swiper.navigation.init();
              swiper.navigation.update();
            }
          });
        }}
      >
        {gamesOnSale.map(game => (
          <SwiperSlide key={game.id} className="flex justify-center">
            <div className="flex flex-col w-[213px] gap-2">
              <div className="w-[190px] h-[284px] rounded-md overflow-hidden">
                <Image src={game.image} alt={game.name} width={200} height={284} className="object-cover"/>
              </div>
              <span className="text-white font-medium text-sm">{game.name}</span>
              <div className="flex gap-2 items-center">
                <div className="bg-[#0074E4] text-white px-2 py-1 rounded">{game.discount}</div>
                <span className="line-through text-gray-400">₹{game.originalPrice}</span>
                <span className="text-white font-medium">₹{game.discountedPrice}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}