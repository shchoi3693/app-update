'use client';

import { useMainPlaylistTracks } from '@/hooks/useTrack';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';
import Skeleton from './ui/Skeleton';
import { useRouter } from 'next/navigation';

export default function MainBnr() {
  const router = useRouter();
  const { data, isLoading, isError } = useMainPlaylistTracks();

  if (isError)
    return (
      <div className="flex h-full items-center justify-center">
        <button
          className="cursor-pointer border border-gray-200 px-6 py-2.5"
          onClick={() => router.refresh()}
        >
          다시 시도
        </button>
      </div>
    );

  if (isLoading)
    return (
      <>
        <Skeleton className="grid grid-flow-col grid-cols-[repeat(3,1fr)] gap-x-5 overflow-hidden">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-gray-150 aspect-square border"></div>
          ))}
        </Skeleton>
      </>
    );

  return (
    <div className="">
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
        {data?.map((track, i) => (
          <SwiperSlide key={track.album_name} style={{ width: 'auto' }}>
            <div className="aspect-square h-full w-full border"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
