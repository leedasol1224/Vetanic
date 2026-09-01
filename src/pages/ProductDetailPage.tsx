import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Sparkles, 
  ShieldCheck, 
  Package, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  ShieldAlert, 
  Tag, 
  Truck,
  Heart
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { PetBadge } from '../components/common/Badge';
import { useOrder } from '../context/OrderContext';
import { getProductPricing } from '../lib/pricing';
import { ProductCard } from '../components/products/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToOrder, updateQuantity, getItemQuantity, openCartDrawer } = useOrder();

  const product = PRODUCTS.find((p) => p.id === id || p.slug === id);

  // Accordion state for mobile / collapsible sections
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    benefits: true,
    details: true,
    ingredients: true,
    feeding: true,
    precautions: true
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!product) {
    return (
      <main className="flex-1 bg-[#FAF7F2] py-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-10 border border-[#DED7CE] shadow-soft text-center space-y-5">
          <h1 className="text-2xl font-serif font-bold text-charcoal">Product Not Found</h1>
          <p className="text-xs text-charcoal-muted">
            The pet wellness product you are looking for might have been updated or moved.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Products</span>
          </Link>
        </div>
      </main>
    );
  }

  const pricing = getProductPricing(product);
  const currentQuantity = getItemQuantity(product.id);

  // Related products from same collection or pet type
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.collection === product.collection || p.petType === product.petType)
  ).slice(0, 3);

  const handleAddInitial = () => {
    if (!product.isAvailable) return;
    addToOrder(product, 1);
  };

  const handleIncrement = () => {
    updateQuantity(product.id, currentQuantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(product.id, currentQuantity - 1);
  };

  return (
    <main className="flex-1 bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="mb-6 flex items-center justify-between">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-muted hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-charcoal-muted">
            <span>{product.collectionName}</span>
            <span>/</span>
            <span className="font-semibold text-charcoal">{product.categoryName}</span>
          </div>
        </nav>

        {/* Top Product Hero Card */}
        <div className="bg-white rounded-3xl border border-[#DED7CE] p-6 sm:p-10 shadow-soft mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Product Images Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-square w-full rounded-3xl bg-white border border-[#DED7CE] p-8 flex items-center justify-center overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain object-center"
                />

                {/* Pet Badge */}
                <div className="absolute top-4 left-4">
                  <PetBadge type={product.petType} size="md" />
                </div>

                {/* Stock Status Badge */}
                {!product.isAvailable && (
                  <div className="absolute top-4 right-4 bg-charcoal/85 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Sold Out
                  </div>
                )}
              </div>

              {/* Sub-thumbnails (if available) */}
              {product.galleryImages && product.galleryImages.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 rounded-xl border border-brand-600 bg-white p-1.5 cursor-pointer shadow-xs"
                    >
                      <img src={img} alt={`${product.name} thumbnail`} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Order Interaction */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200 uppercase tracking-wider">
                    {product.categoryName}
                  </span>
                  <span className="text-xs text-charcoal-muted">
                    {product.packageSize}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
                  {product.name}
                </h1>

                <p className="text-sm sm:text-base text-charcoal-muted mt-2 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Pricing Box */}
              <div className="p-4 sm:p-5 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE] space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-serif font-bold text-charcoal">
                    SGD {pricing.activePrice.toFixed(2)}
                  </span>
                  {pricing.isPromo && (
                    <span className="text-sm text-charcoal-muted line-through">
                      SGD {pricing.regularPrice.toFixed(2)}
                    </span>
                  )}
                  {pricing.isPromo && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200">
                      <Sparkles className="w-3 h-3 text-brand-600" />
                      <span>Singapore Launch Price</span>
                    </span>
                  )}
                </div>

                {product.bundleOfferText && (
                  <div className="pt-2 border-t border-[#DED7CE]/60 flex items-center gap-2 text-xs font-semibold text-charcoal">
                    <Tag className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>{product.bundleOfferText}</span>
                  </div>
                )}
              </div>

              {/* Key Quick Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DED7CE]/70">
                  <span className="text-[10px] text-charcoal-muted uppercase font-bold block mb-0.5">Suitable For</span>
                  <span className="font-semibold text-charcoal">{product.details.suitablePetType}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DED7CE]/70">
                  <span className="text-[10px] text-charcoal-muted uppercase font-bold block mb-0.5">Life Stage</span>
                  <span className="font-semibold text-charcoal">{product.details.suitableLifeStage}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DED7CE]/70">
                  <span className="text-[10px] text-charcoal-muted uppercase font-bold block mb-0.5">Package</span>
                  <span className="font-semibold text-charcoal">{product.packageSize}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DED7CE]/70">
                  <span className="text-[10px] text-charcoal-muted uppercase font-bold block mb-0.5">Origin</span>
                  <span className="font-semibold text-charcoal">{product.details.countryOfOrigin}</span>
                </div>
              </div>

              {/* Action Buttons: Inline Quantity & Cart */}
              <div className="pt-2">
                {!product.isAvailable ? (
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE] text-center space-y-1">
                    <span className="text-sm font-bold text-charcoal block">Currently Sold Out</span>
                    <p className="text-xs text-charcoal-muted">
                      This item is temporarily out of stock. Please check back soon or explore our other wellness formulas.
                    </p>
                  </div>
                ) : currentQuantity === 0 ? (
                  <button
                    type="button"
                    onClick={handleAddInitial}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Order · SGD {pricing.activePrice.toFixed(2)}</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex items-center justify-between border-2 border-brand-600 rounded-2xl bg-brand-50/60 p-1.5 shadow-sm min-w-[12rem]">
                      <button
                        type="button"
                        onClick={handleDecrement}
                        className="w-10 h-10 flex items-center justify-center bg-white hover:bg-brand-100 text-brand-700 rounded-xl transition-colors border border-brand-200 shadow-xs"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="text-center px-3">
                        <span className="text-sm font-bold text-charcoal block">
                          {currentQuantity} in Order
                        </span>
                        <span className="text-[10px] text-charcoal-muted font-medium">
                          SGD {(pricing.activePrice * currentQuantity).toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleIncrement}
                        className="w-10 h-10 flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition-colors shadow-xs"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={openCartDrawer}
                      className="inline-flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-[#F4EFE7] text-brand-600 font-bold text-xs px-6 py-4 rounded-2xl border border-brand-600 transition-colors"
                    >
                      <span>View Cart Drawer</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Delivery Assurance & Lineage */}
              <div className="pt-4 border-t border-[#DED7CE]/70 flex flex-col sm:flex-row gap-4 text-xs text-charcoal-muted">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Free SG delivery for orders SGD 50+</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sage-600 flex-shrink-0" />
                  <span>Nongshim Banryodaum formulation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Product Sections (Accordion on Mobile / Grid on Desktop) */}
        <div className="space-y-6 mb-16">
          {/* Section 1: Key Benefits */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] overflow-hidden shadow-card">
            <button
              onClick={() => toggleAccordion('benefits')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-[#FAF7F2]/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-charcoal">Key Benefits</h3>
                  <p className="text-xs text-charcoal-muted">Formulation strengths & targeted companion care</p>
                </div>
              </div>
              {openAccordions.benefits ? <ChevronUp className="w-5 h-5 text-charcoal-muted" /> : <ChevronDown className="w-5 h-5 text-charcoal-muted" />}
            </button>

            {openAccordions.benefits && (
              <div className="p-6 pt-0 border-t border-[#DED7CE]/60">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  {product.details.keyBenefits.map((benefit, idx) => (
                    <div key={idx} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]/70 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 text-xs font-bold flex items-center justify-center flex-shrink-0 border border-brand-200">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-charcoal font-medium leading-relaxed">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Ingredients */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] overflow-hidden shadow-card">
            <button
              onClick={() => toggleAccordion('ingredients')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-[#FAF7F2]/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sage-50 border border-sage-200 flex items-center justify-center text-sage-700">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-charcoal">Ingredients</h3>
                  <p className="text-xs text-charcoal-muted">Active functional ingredients & raw material integrity</p>
                </div>
              </div>
              {openAccordions.ingredients ? <ChevronUp className="w-5 h-5 text-charcoal-muted" /> : <ChevronDown className="w-5 h-5 text-charcoal-muted" />}
            </button>

            {openAccordions.ingredients && (
              <div className="p-6 pt-0 border-t border-[#DED7CE]/60 space-y-4">
                <div className="pt-4">
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                    Key Active Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.details.mainIngredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-sage-100/70 border border-sage-200 text-xs font-semibold text-sage-900"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Full Ingredients List
                  </h4>
                  <p className="text-xs text-charcoal-muted bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#DED7CE] italic leading-relaxed">
                    {product.details.fullIngredients}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Feeding Guide & How to Use */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] overflow-hidden shadow-card">
            <button
              onClick={() => toggleAccordion('feeding')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-[#FAF7F2]/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-charcoal">Feeding Guide & How to Use</h3>
                  <p className="text-xs text-charcoal-muted">Serving recommendations & daily dosage</p>
                </div>
              </div>
              {openAccordions.feeding ? <ChevronUp className="w-5 h-5 text-charcoal-muted" /> : <ChevronDown className="w-5 h-5 text-charcoal-muted" />}
            </button>

            {openAccordions.feeding && (
              <div className="p-6 pt-0 border-t border-[#DED7CE]/60 space-y-4">
                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]">
                    <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                      Recommended Daily Dosage
                    </h4>
                    <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
                      {product.details.recommendedDailyAmount}
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]">
                    <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                      Feeding Instructions
                    </h4>
                    <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
                      {product.details.feedingUsageGuide}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Precautions & Storage */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] overflow-hidden shadow-card">
            <button
              onClick={() => toggleAccordion('precautions')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-[#FAF7F2]/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#DED7CE] flex items-center justify-center text-charcoal">
                  <ShieldAlert className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-charcoal">Storage & Precautions</h3>
                  <p className="text-xs text-charcoal-muted">Safety guidelines & optimal storage conditions</p>
                </div>
              </div>
              {openAccordions.precautions ? <ChevronUp className="w-5 h-5 text-charcoal-muted" /> : <ChevronDown className="w-5 h-5 text-charcoal-muted" />}
            </button>

            {openAccordions.precautions && (
              <div className="p-6 pt-0 border-t border-[#DED7CE]/60 space-y-4">
                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]">
                    <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                      Storage Instructions
                    </h4>
                    <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
                      {product.details.storageInstructions}
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]">
                    <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                      Safety Precautions
                    </h4>
                    <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
                      {product.details.precautions}
                    </p>
                  </div>
                </div>

                {product.details.additionalNotes && (
                  <div className="p-3.5 bg-white rounded-xl border border-[#DED7CE] text-xs text-charcoal-muted flex items-start gap-2">
                    <Info className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>{product.details.additionalNotes}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-[#DED7CE]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
                  Discover More
                </span>
                <h2 className="text-2xl font-serif font-bold text-charcoal">
                  You May Also Like
                </h2>
              </div>

              <Link
                to="/products"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2"
              >
                View All Products
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};
