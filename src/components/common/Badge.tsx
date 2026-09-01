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

  // Sage Green wellness accent styling
  const styleClasses =
    label === 'DOG + CAT'
      ? 'bg-sage-100 text-sage-800 border-sage-300'
      : label === 'DOG ONLY'
      ? 'bg-sage-50 text-sage-700 border-sage-200'
      : 'bg-sage-100 text-sage-800 border-sage-300';

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
