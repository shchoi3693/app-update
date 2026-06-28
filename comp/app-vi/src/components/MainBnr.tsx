'use client';

import { trackQueries } from '@/hooks/useTrack';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function MainBnr() {
  const { data } = useSuspenseQuery(trackQueries.mainPlaylist());

  return (
    <div>
      <Swiper
        slidesPerView={3.5}
        centeredSlides={true}
        loop={true}
        spaceBetween={20}
        modules={[Autoplay]}
        autoplay={{ delay: 1, disableOnInteraction: false }}
        speed={6e3}
        freeMode={true}
        className="[&_.swiper-wrapper]:ease-linear!"
      >
        {data.map((track, i) => (
          <SwiperSlide key={track.album_name} style={{ width: 'auto' }}>
            <div className="aspect-square h-full w-full bg-amber-50"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
