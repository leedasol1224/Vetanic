import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFilters } from '../components/products/ProductFilters';
import { PetType, ProductCategory } from '../types/product';
import { Sparkles, RotateCcw } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPet, setSelectedPet] = useState<'all' | PetType>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProductCategory>('all');

  // Read URL query parameters on mount or change
  useEffect(() => {
    const categoryParam = searchParams.get('category') as ProductCategory | null;
    const petParam = searchParams.get('pet') as PetType | null;

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }

    if (petParam) {
      setSelectedPet(petParam);
    } else {
      setSelectedPet('all');
    }
  }, [searchParams]);

  const handlePetChange = (pet: 'all' | PetType) => {
    setSelectedPet(pet);
    const newParams = new URLSearchParams(searchParams);
    if (pet === 'all') {
      newParams.delete('pet');
    } else {
      newParams.set('pet', pet);
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (cat: 'all' | ProductCategory) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedPet('all');
    setSelectedCategory('all');
    setSearchParams({});
  };

  // Filter products
  const filteredProducts = PRODUCTS.filter((product) => {
    // Pet filter
    if (selectedPet !== 'all') {
      if (selectedPet === 'dog' && product.petType === 'cat') return false;
      if (selectedPet === 'cat' && product.petType === 'dog') return false;
    }

    // Category filter
    if (selectedCategory !== 'all') {
      if (product.category !== selectedCategory) return false;
    }

    return true;
  });

  return (
    <main className="flex-1 bg-[#FAF8F5] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/80 text-brand-900 text-xs font-bold uppercase tracking-wider mb-3 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Singapore Official Range</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-charcoal tracking-tight mb-3">
            Our Products
          </h1>

          <p className="text-base text-charcoal-muted">
            Find everyday wellness support for your companion.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-10 max-w-4xl mx-auto">
          <ProductFilters
            selectedPet={selectedPet}
            selectedCategory={selectedCategory}
            onPetChange={handlePetChange}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Active Filter Pill Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-charcoal-muted font-medium">
          <div>
            Showing <strong className="text-charcoal font-bold">{filteredProducts.length}</strong> of {PRODUCTS.length} products
            {(selectedPet !== 'all' || selectedCategory !== 'all') && (
              <span className="ml-2 text-brand-700 font-semibold">(Filtered)</span>
            )}
          </div>

          {(selectedPet !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-800 hover:text-brand-950 underline underline-offset-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-100 max-w-md mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-brand-50 mx-auto flex items-center justify-center text-brand-700 mb-4">
              🐾
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">No matching products found</h3>
            <p className="text-xs text-charcoal-muted mb-6">
              Try adjusting your pet or category filter to discover other wellness essentials.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-brand-800 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-brand-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Show All Products</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
