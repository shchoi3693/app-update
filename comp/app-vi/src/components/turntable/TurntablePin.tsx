import { motion, PanInfo, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';

export default function TurntablePin() {
  const pinWrapper = useRef<HTMLDivElement>(null);
  const rotateRaw = useMotionValue(0);
  const rotate = useSpring(rotateRaw, { stiffness: 500, damping: 30 });

  const startAngle = useRef(0);
  const pivotX = useRef(0);
  const pivotY = useRef(0);
  const getAngle = (x: number, y: number) =>
    Math.floor((Math.atan2(y - pivotY.current, x - pivotX.current) * 180) / Math.PI);

  const handlePinStart = (event: PointerEvent, info: PanInfo) => {
    if (!pinWrapper.current) return;

    const rect = pinWrapper.current.getBoundingClientRect();
    pivotX.current = rect.left + rect.width / 2;
    pivotY.current = rect.top;

    startAngle.current = getAngle(info.point.x, info.point.y) - rotateRaw.get();
  };

  const handlePin = (event: PointerEvent, info: PanInfo) => {
    if (!pinWrapper.current) return;
    let relativeAngle = getAngle(info.point.x, info.point.y) - startAngle.current;
    if (relativeAngle < 8) {
      relativeAngle = 0;
    } else if (relativeAngle > 14) {
      relativeAngle = 25;
    }
    rotateRaw.set(relativeAngle);
  };

  const handlePinEnd = () => {
    //setDeg(rotate.get());
  };

  return (
    <motion.div
      className="absolute top-[5%] right-[10%] z-10 h-[80%] w-[5%] origin-top cursor-grab touch-none rounded-full bg-amber-200 select-none"
      ref={pinWrapper}
      onPan={handlePin}
      onPanStart={handlePinStart}
      onPanEnd={handlePinEnd}
      style={{ rotate }}
    />
  );
}
