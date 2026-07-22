'use client';

import { ChangeEvent } from 'react';

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}
export default function SearchInput({ value, onChange, onReset }: Props) {
  return (
    <div className="absolute top-4 right-0 left-0 z-1 w-full px-2">
      <div className="flex gap-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            className="h-9 w-full rounded-full border border-white bg-white/50 px-4 py-2 leading-none focus:outline-0"
            value={value}
            onChange={onChange}
          />
          {value !== '' && (
            <button
              type="reset"
              title="지우기"
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
        </div>

        <button
          type="button"
          title="검색 닫기"
          // onClick={onReset}
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
              d="M24 10 L10 24"
              stroke="#6a7282"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 10L24 24"
              stroke="#6a7282"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
