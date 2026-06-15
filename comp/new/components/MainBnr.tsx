'use client';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';
import { useMainPlaylistTracks } from '@/hooks/useTrack';

export default function MainBnr() {
  const { data, isLoading, isError } = useMainPlaylistTracks();
  if (isLoading) return <div>loading</div>;
  if (isError) return <div>error</div>;

  return (
    <div className="">
      <Swiper
        slidesPerView={'auto'}
        centeredSlides={true}
        loop={true}
        spaceBetween={20}
        modules={[Autoplay]}
        autoplay={{ delay: 1, disableOnInteraction: false }}
        speed={6e3}
        freeMode={true}
        className="[&_.swiper-wrapper]:ease-linear!"
      >
        {data?.map((track, i) => (
          <SwiperSlide key={track.album_name} style={{ width: 'auto' }}>
            <div className="h-20 w-20 border"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
