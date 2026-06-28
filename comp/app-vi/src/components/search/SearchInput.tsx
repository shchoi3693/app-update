'use client';

import { ChangeEvent } from 'react';

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}
export default function SearchInput({ value, onChange, onReset }: Props) {
  return (
    <div className="w-full flex items-center border border-gray-400 rounded-sm relative">
      <input type="text" className="w-full px-2 py-0.5" value={value} onChange={onChange} />
      {value !== '' && (
        <button
          type="reset"
          title="지우기"
          onClick={onReset}
          className="absolute right-1 top-0 bottom-0 mt-auto mb-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M16 8 L8 16"
              stroke="#686868"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 8L16 16"
              stroke="#686868"
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
