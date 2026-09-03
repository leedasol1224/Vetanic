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
  ShieldAlert, 
  Tag, 
  Truck,
  Heart,
  Utensils,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { PetBadge } from '../components/common/Badge';
import { useOrder } from '../context/OrderContext';
import { getProductPricing } from '../lib/pricing';
import { ProductCard } from '../components/products/ProductCard';
import { GeneralFaqSection } from '../components/products/GeneralFaqSection';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToOrder, updateQuantity, getItemQuantity, openCartDrawer } = useOrder();

  const product = PRODUCTS.find((p) => p.id === id || p.slug === id);

  // Selected image thumbnail index
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Accordion state for expandable sections (closed or open by default)
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    howToFeed: true,
    ingredients: false,
    feedingGuide: false,
    storagePrecautions: false,
    productFaq: false
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
          <h1 className="text-2xl font-heading font-bold text-charcoal">Product Not Found</h1>
          <p className="text-xs text-charcoal-muted">
            The pet wellness product you are looking for might have been updated or moved.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-full transition-all"
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

  // Images list (main image + gallery if available)
  const images = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.imageUrl];

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

  const precautionsList = Array.isArray(product.details.precautions)
    ? product.details.precautions
    : [product.details.precautions];

  return (
    <main className="flex-1 bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center justify-between">
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

        {/* 1. ABOVE THE FOLD: Spacious Product Showcase */}
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-[#DED7CE] p-6 sm:p-10 lg:p-12 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* LEFT: Large Product Image & Thumbnails */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-square w-full rounded-3xl bg-white border border-[#DED7CE]/80 p-8 flex items-center justify-center overflow-hidden shadow-xs">
                <img
                  src={images[selectedImageIndex] || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain object-center transition-all duration-300"
                />

                {/* Compatibility Badge */}
                <div className="absolute top-4 left-4">
                  <PetBadge type={product.petType} size="md" />
                </div>

                {/* Sold Out Badge */}
                {!product.isAvailable && (
                  <div className="absolute top-4 right-4 bg-charcoal/85 text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Sold Out
                  </div>
                )}
              </div>

              {/* Thumbnails (if multiple images) */}
              {images.length > 1 && (
                <div className="flex items-center gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-2xl border p-1 bg-white transition-all overflow-hidden ${
                        selectedImageIndex === idx
                          ? 'border-brand-600 ring-2 ring-brand-100 shadow-xs'
                          : 'border-[#DED7CE] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Essential Info & Quantity Control */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200 uppercase tracking-wider">
                    {product.categoryName}
                  </span>
                  <span className="text-xs text-charcoal-muted font-medium">
                    {product.packageSize}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-charcoal tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* One-Sentence Short Description */}
                <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed pt-1">
                  {product.shortDescription}
                </p>
              </div>

              {/* Pricing Box */}
              <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE] space-y-2.5">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-heading font-bold text-charcoal">
                    SGD {pricing.activePrice.toFixed(2)}
                  </span>
                  {pricing.isPromo && (
                    <span className="text-sm text-charcoal-muted line-through font-medium">
                      SGD {pricing.regularPrice.toFixed(2)}
                    </span>
                  )}
                  {pricing.isPromo && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                      <Sparkles className="w-3 h-3 text-brand-600" />
                      <span>September Launch Price</span>
                    </span>
                  )}
                </div>

                {/* Small Mix & Match note where applicable */}
                {product.bundleOfferText && (
                  <div className="pt-2 border-t border-[#DED7CE]/70 flex items-center gap-2 text-xs font-semibold text-charcoal">
                    <Tag className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                    <span>{product.bundleOfferText}</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector & Order Interaction */}
              <div className="pt-2">
                {!product.isAvailable ? (
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE] text-center space-y-1">
                    <span className="text-sm font-bold text-charcoal block">Currently Sold Out</span>
                    <p className="text-xs text-charcoal-muted">
                      This item is temporarily out of stock. Please explore our other wellness formulas.
                    </p>
                  </div>
                ) : currentQuantity === 0 ? (
                  <button
                    type="button"
                    onClick={handleAddInitial}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Order · SGD {pricing.activePrice.toFixed(2)}</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex items-center justify-between border-2 border-brand-600 rounded-full bg-brand-50/60 p-1.5 shadow-xs min-w-[13rem]">
                      <button
                        type="button"
                        onClick={handleDecrement}
                        className="w-10 h-10 flex items-center justify-center bg-white hover:bg-brand-100 text-brand-700 rounded-full transition-colors border border-brand-200 shadow-xs"
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
                        className="w-10 h-10 flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white rounded-full transition-colors shadow-xs"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={openCartDrawer}
                      className="inline-flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-[#F4EFE7] text-brand-600 font-bold text-xs px-6 py-4 rounded-full border border-brand-600 transition-colors"
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

        {/* 2. KEY BENEFITS: Short Visual Cards / Icon Labels */}
        <section className="space-y-4">
          <h2 className="text-xl font-heading font-bold text-charcoal">
            Key Highlights
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {product.details.keyBenefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 bg-white rounded-2xl sm:rounded-3xl border border-[#DED7CE] shadow-card flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-charcoal leading-snug">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. WHO IS IT FOR?: Compact Visual Cards / Points */}
        {product.details.recommendedFor && product.details.recommendedFor.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DED7CE] shadow-card space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sage-50 border border-sage-200 text-sage-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-heading font-bold text-charcoal">
                Recommended For
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {product.details.recommendedFor.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE]/70 text-xs sm:text-sm text-charcoal font-medium flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. PRODUCT INFORMATION ACCORDIONS (Detailed information only if available) */}
        <section className="space-y-4">
          <h2 className="text-xl font-heading font-bold text-charcoal">
            Product Details & Guide
          </h2>

          <div className="space-y-3">
            {/* Accordion 1: How to Feed */}
            {product.details.howToFeed && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#DED7CE] overflow-hidden shadow-card">
                <button
                  type="button"
                  onClick={() => toggleAccordion('howToFeed')}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#FAF7F2]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <span className="text-base font-heading font-bold text-charcoal">
                      How to Feed
                    </span>
                  </div>
                  {openAccordions.howToFeed ? <ChevronUp className="w-5 h-5 text-charcoal-muted" /> : <ChevronDown className="w-5 h-5 text-charcoal-muted" />}
                </button>

                {openAccordions.howToFeed && (
                  <div className="p-5 sm:p-6 pt-0 border-t border-[#DED7CE]/60 text-xs sm:text-sm text-charcoal leading-relaxed animate-soft-in">
                    <p className="pt-4">{product.details.howToFeed}</p>
                  </div>
                )}
              </div>
            )}

            {/* Accordion 2: Ingredients */}
            {product.details.fullIngredients && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#DED7CE] overflow-hidden shadow-card">
                <button
                  type="button"
                  onClick={() => toggleAccordion('ingredients')}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#FAF7F2]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sage-50 border border-sage-200 flex items-center justify-center text-sage-700">
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-base font-heading font-bold text-charcoal">
                      Ingredients
                    </span>
                  </div>
                  {openAccordions.ingredients ? <ChevronUp className="w-5 h-5 text-charcoal-muted" /> : <ChevronDown className="w-5 h-5 text-charcoal-muted" />}
                </button>

                {openAccordions.ingredients && (
                  <div className="p-5 sm:p-6 pt-0 border-t border-[#DED7CE]/60 space-y-4 animate-soft-in">
                    {/* Active Key Ingredients Chips */}
                    {product.details.mainIngredients && product.details.mainIngredients.length > 0 && (
                      <div className="pt-4">
                        <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block mb-2">
                          Key Functional Ingredients
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {product.details.mainIngredients.map((ing, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 rounded-xl bg-sage-50 border border-sage-200 text-xs font-semibold text-sage-900"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Full Ingredients Statement */}
                    <div>
                      <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1.5">
                        Full Ingredients Declaration
                      </span>
                      <p className="text-xs text-charcoal-muted bg-[#FAF7F2] p-4 rounded-2xl border border-[#DED7CE] leading-relaxed">
                        {product.details.fullIngredients}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Accordion 3: Feeding Guide */}
            {product.details.recommendedDailyAmount && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#DED7CE] overflow-hidden shadow-card">
                <button
                  type="button"
                  onClick={() => toggleAccordion('feedingGuide')}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#FAF7F2]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
                      <Heart className="w-4 h-4" />
                    </div>
                    <span className="text-base font-heading font-bold text-charcoal">
                      Feeding Guide & Daily Dosage
                    </span>
                  </div>
                  {openAccordions.feedingGuide ? <ChevronUp className="w-5 h-5 text-charcoal-muted" /> : <ChevronDown className="w-5 h-5 text-charcoal-muted" />}
                </button>

                {openAccordions.feedingGuide && (
                  <div className="p-5 sm:p-6 pt-0 border-t border-[#DED7CE]/60 text-xs sm:text-sm text-charcoal leading-relaxed animate-soft-in">
                    <div className="pt-4 p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]">
                      <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                        Recommended Daily Dosage
                      </span>
                      <p className="font-semibold text-charcoal">
                        {product.details.recommendedDailyAmount}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Accordion 4: Storage & Precautions */}
            {product.details.storageInstructions && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#DED7CE] overflow-hidden shadow-card">
                <button
                  type="button"
                  onClick={() => toggleAccordion('storagePrecautions')}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#FAF7F2]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#DED7CE] flex items-center justify-center text-charcoal">
                      <ShieldAlert className="w-4 h-4 text-brand-600" />
                    </div>
                    <span className="text-base font-heading font-bold text-charcoal">
                      Storage & Precautions
                    </span>
                  </div>
                  {openAccordions.storagePrecautions ? <ChevronUp className="w-5 h-5 text-charcoal-muted" /> : <ChevronDown className="w-5 h-5 text-charcoal-muted" />}
                </button>

                {openAccordions.storagePrecautions && (
                  <div className="p-5 sm:p-6 pt-0 border-t border-[#DED7CE]/60 space-y-4 animate-soft-in">
                    <div className="pt-4 space-y-3">
                      <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]">
                        <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                          Storage Instructions
                        </span>
                        <p className="text-xs sm:text-sm text-charcoal">
                          {product.details.storageInstructions}
                        </p>
                      </div>

                      <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE] space-y-1.5">
                        <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                          Precautions
                        </span>
                        {precautionsList.map((p, idx) => (
                          <p key={idx} className="text-xs sm:text-sm text-charcoal flex items-start gap-2">
                            <span className="text-brand-600 font-bold">•</span>
                            <span>{p}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Accordion 5: Product-Specific FAQ (if provided) */}
            {product.details.productFaq && product.details.productFaq.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#DED7CE] overflow-hidden shadow-card">
                <button
                  type="button"
                  onClick={() => toggleAccordion('productFaq')}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#FAF7F2]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="text-base font-heading font-bold text-charcoal">
                      Product FAQ
                    </span>
                  </div>
                  {openAccordions.productFaq ? <ChevronUp className="w-5 h-5 text-charcoal-muted" /> : <ChevronDown className="w-5 h-5 text-charcoal-muted" />}
                </button>

                {openAccordions.productFaq && (
                  <div className="p-5 sm:p-6 pt-0 border-t border-[#DED7CE]/60 space-y-3 animate-soft-in">
                    <div className="pt-4 space-y-3">
                      {product.details.productFaq.map((item, idx) => (
                        <div key={idx} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE] space-y-1">
                          <span className="text-xs sm:text-sm font-bold text-charcoal block">
                            Q: {item.question}
                          </span>
                          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 5. GENERAL FAQ: Reusable section covering all general supplement queries */}
        <GeneralFaqSection />

        {/* 6. RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="pt-6 border-t border-[#DED7CE]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
                  Discover More
                </span>
                <h2 className="text-2xl font-heading font-bold text-charcoal">
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
