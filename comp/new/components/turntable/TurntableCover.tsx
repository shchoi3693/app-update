import { usePlayerStore } from '@/store/usePlayerStore';
import { motion } from 'framer-motion';

export default function TurntableCover() {
  const activeTrack = usePlayerStore(state => state.activeTrack);
  //if (!activeTrack) return null;
  return (
    <motion.div
      layoutId={`album-${activeTrack?.id}`}
      layout
      className="absolute inset-0 z-10 my-auto h-0 w-1/2 pt-[50%]"
      style={{
        left: '6%',
        background: `linear-gradient(to right, ${activeTrack?.palette?.vibrant}, ${activeTrack?.palette?.darkVibrant})`,
      }}
      initial={{ rotate: 0 }}
      animate={{
        rotate: -5,
        transition: { delay: 0.6, duration: 0.4, ease: 'easeInOut' },
      }}
      exit={{
        rotate: 0,
        transition: {
          duration: 0.3,
          ease: 'easeInOut',
        },
      }}
    />
  );
}
