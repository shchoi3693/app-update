import { usePlayerStore } from '@/store/usePlayerStore';
import { motion } from 'framer-motion';

export default function TurntableLp() {
  const activeTrack = usePlayerStore(state => state.activeTrack);

  return (
    <motion.div
      className="absolute inset-0 m-auto"
      style={{
        width: '70%',
        height: '70%',
        background: `linear-gradient(to right, #ddd, #ddd)`,
      }}
      initial={{ left: '-170%' }}
      animate={{
        left: 0,
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 50,
          delay: 1.4,
        },
      }}
      exit={{
        left: '-170%',
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 25,
          duration: 0.3,
        },
      }}
    >
      <motion.div
        className="absolute inset-0 m-auto"
        style={{
          width: '50%',
          height: '50%',
          background: `linear-gradient(to right, ${activeTrack?.palette?.vibrant}, ${activeTrack?.palette?.darkVibrant})`,
        }}
      />
    </motion.div>
  );
}
