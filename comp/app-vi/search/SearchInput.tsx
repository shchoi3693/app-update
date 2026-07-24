'use client';

import { usePlayerUIStore } from '@/store/usePlayerUIStore';
import { ChangeEvent } from 'react';
import { AnimatePresence, motion, stagger, Variants } from 'framer-motion';

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}
export default function SearchInput({ value, onChange, onReset }: Props) {
  const closeSearch = usePlayerUIStore(state => state.closeSearch);
  const inputVar: Variants = {
    initial: { x: 20 },
    animate: {
      x: 0,
      transition: {
        delay: 0.2,
        type: 'tween',
        duration: 0.3,
        ease: 'backOut',
      },
    },
    exit: { x: 40 },
  };
  return (
    <div className="absolute top-4 right-0 left-0 z-1 w-full px-2">
      <div className="flex gap-x-2">
        <button
          type="button"
          title="검색 닫기"
          onClick={closeSearch}
          className="h-9 w-9 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            className="rounded-full border border-white bg-white/50"
          >
            <path
              d="M24 12 L12 24"
              stroke="#6a7282"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 12 L24 24"
              stroke="#6a7282"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <motion.div variants={inputVar} className="relative flex-1">
          <input
            type="text"
            className="h-9 w-full rounded-full border border-white bg-white/50 px-4 py-2 leading-none focus:outline-0"
            value={value}
            onChange={onChange}
          />
          {value !== '' && (
            <button
              type="reset"
              title="전체 지우기"
              onClick={onReset}
              className="absolute top-0 right-1 bottom-0 mt-auto mb-auto flex h-8 w-8 cursor-pointer items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="12" cy="12" r="8" fill="#6a7282" />
                <path
                  d="M15 9 L9 15"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 9L15 15"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
