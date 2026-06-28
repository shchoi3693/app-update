import Skeleton from './Skeleton';

export default function SkeletonSwiper() {
  return (
    <Skeleton className="grid grid-flow-col grid-cols-[repeat(3,1fr)] gap-x-5 overflow-hidden">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="aspect-square bg-gray-200"></div>
      ))}
    </Skeleton>
  );
}
