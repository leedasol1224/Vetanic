import React from 'react';
import { PetType } from '../../types/product';

interface BadgeProps {
  type: PetType | 'DOG + CAT' | 'DOG ONLY' | 'CATS ONLY';
  size?: 'sm' | 'md';
}

export const PetBadge: React.FC<BadgeProps> = ({ type, size = 'sm' }) => {
  const isSmall = size === 'sm';

  const label =
    type === 'both' || type === 'DOG + CAT'
      ? 'DOG + CAT'
      : type === 'dog' || type === 'DOG ONLY'
      ? 'DOG ONLY'
      : 'CATS ONLY';

  const styleClasses =
    label === 'DOG + CAT'
      ? 'bg-[#e7efe9] text-[#2c5344] border-[#c4dcce]'
      : label === 'DOG ONLY'
      ? 'bg-[#f4efe6] text-[#78593a] border-[#e2d5c3]'
      : 'bg-[#edf2f7] text-[#3d5a80] border-[#cbd5e1]';

  return (
    <span
      className={`inline-flex items-center font-semibold tracking-wider uppercase rounded-full border ${styleClasses} ${
        isSmall ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      {label}
    </span>
  );
};
