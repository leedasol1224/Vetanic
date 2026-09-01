import React from 'react';
import { PetType, ProductCategory } from '../../types/product';
import { Sparkles } from 'lucide-react';

interface ProductFiltersProps {
  selectedPet: 'all' | PetType;
  selectedCategory: 'all' | ProductCategory;
  onPetChange: (pet: 'all' | PetType) => void;
  onCategoryChange: (category: 'all' | ProductCategory) => void;
}

const CATEGORY_OPTIONS: Array<{ id: 'all' | ProductCategory; label: string }> = [
  { id: 'all', label: 'All Needs' },
  { id: 'skin-coat', label: 'Skin & Coat' },
  { id: 'joint-care', label: 'Joint Support' },
  { id: 'digestion', label: 'Digestion' },
  { id: 'eye-care', label: 'Eye Care' },
  { id: 'kidney-urinary', label: 'Kidney & Urinary' },
  { id: 'hairball', label: 'Hairball Care' },
  { id: 'dental', label: 'Dental Care' },
  { id: 'treats', label: 'Healthy Treats' },
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedPet,
  selectedCategory,
  onPetChange,
  onCategoryChange,
}) => {
  return (
    <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#DED7CE] shadow-sm">
      {/* Pet Selection */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider mr-2">
          Pet:
        </span>
        <button
          type="button"
          onClick={() => onPetChange('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            selectedPet === 'all'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-[#FAF7F2] text-charcoal hover:bg-[#E9E0D4] border border-[#DED7CE]'
          }`}
        >
          All Pets
        </button>
        <button
          type="button"
          onClick={() => onPetChange('dog')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            selectedPet === 'dog'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-[#FAF7F2] text-charcoal hover:bg-[#E9E0D4] border border-[#DED7CE]'
          }`}
        >
          🐶 Dogs
        </button>
        <button
          type="button"
          onClick={() => onPetChange('cat')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            selectedPet === 'cat'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-[#FAF7F2] text-charcoal hover:bg-[#E9E0D4] border border-[#DED7CE]'
          }`}
        >
          🐱 Cats
        </button>
      </div>

      {/* Need Category Selection */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider mr-2 flex-shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          Need:
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm font-bold'
                    : 'bg-[#FAF7F2] text-charcoal hover:text-charcoal hover:bg-[#E9E0D4] border border-[#DED7CE]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
