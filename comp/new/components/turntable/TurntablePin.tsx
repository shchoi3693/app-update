'use client';

import { animate, motion, PanInfo, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';

export default function TurntablePin() {
  const pinWrapper = useRef<HTMLDivElement>(null);
  const startRotate = useRef(0);
  const rotateRaw = useMotionValue(0);
  const rotate = useSpring(rotateRaw, { stiffness: 500, damping: 30 });
  const handlePin = (event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const xToDeg = -0.28 * info.offset.x + 1.6;
    const nextRotate = startRotate.current + Math.floor(xToDeg);

    let deg: number;
    if (info.offset.x < 0 && rotate.get() > 14) {
      deg = 25;
    } else if (info.offset.x > 0 && rotate.get() < 8) {
      deg = 0;
    } else {
      deg = Math.max(0, Math.min(25, nextRotate));
    }
    rotateRaw.set(deg);
  };
  const handlePinStart = () => {
    startRotate.current = rotate.get();
  };
  const handlePinEnd = () => {
    //setDeg(rotate.get());
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden touch-none">
        <div className="w-4 h-50 absolute right-10 top-10 border" ref={pinWrapper}>
          <motion.div
            className="w-4 h-50 bg-amber-200 rounded-full cursor-grab active:cursor-grabbing origin-top"
            style={{ rotate }}
            onPan={handlePin}
            onPanStart={handlePinStart}
            //onPanEnd={handlePinEnd}
          >
            {/* <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-300 rounded-sm" /> */}
          </motion.div>
        </div>
      </div>
    </>
  );
}
