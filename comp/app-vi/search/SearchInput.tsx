'use client';

import { ChangeEvent } from 'react';

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}
export default function SearchInput({ value, onChange, onReset }: Props) {
  return (
    <div className="relative mt-4 flex w-full items-center px-2">
      <input
        type="text"
        className="focus:outline-brand-500 w-full rounded-full border border-gray-300 px-4 py-1.5"
        value={value}
        onChange={onChange}
      />
      {value !== '' && (
        <button
          type="reset"
          title="지우기"
          onClick={onReset}
          className="absolute top-0 right-2 bottom-0 mt-auto mb-auto flex h-8 w-8 cursor-pointer items-center justify-center"
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
  );
}
