import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InstagramIcon } from '../components/common/Icons';
import { POLICY_CONFIG } from '../data/legalPolicies';

export const ReturnsPolicyPage: React.FC = () => {
  return (
    <main className="flex-1 bg-[#FAF7F2] py-12 sm:py-20 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-muted hover:text-brand-600 transition-colors p-2 rounded-xl hover:bg-[#E9E0D4]/40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </Link>

          <span className="text-[11px] font-medium text-charcoal-muted">
            Last Updated: {POLICY_CONFIG.lastUpdatedDate}
          </span>
        </div>

        {/* Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider border border-brand-200">
            <RotateCcw className="w-3.5 h-3.5 text-brand-600" />
            <span>Customer Care Policy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
            Returns & Exchanges
          </h1>

          <p className="text-base text-charcoal leading-relaxed font-medium">
            We want you to be happy with your VETANIC order. If there is an issue with your order, please contact us via Instagram{' '}
            <a
              href={POLICY_CONFIG.contactInstagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              {POLICY_CONFIG.contactInstagramHandle}
            </a>{' '}
            before returning any item.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DED7CE] shadow-soft space-y-8 text-sm text-charcoal leading-relaxed">
          
          {/* Section: Change of Mind */}
          <section className="space-y-3 pb-6 border-b border-[#DED7CE]/70">
            <h2 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600" />
              <span>Change of Mind</span>
            </h2>
            <p>
              Returns due to a change of mind may be requested within <strong>7 days</strong> of receiving your order.
            </p>
            <p>
              To be eligible, the product must be unopened, unused and in its original packaging and condition suitable for resale.
            </p>
            <p className="text-xs text-charcoal-muted">
              Customers are responsible for return delivery costs for change-of-mind returns.
            </p>
          </section>

          {/* Section: Incorrect, Damaged or Defective Items */}
          <section className="space-y-3 pb-6 border-b border-[#DED7CE]/70">
            <h2 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600" />
              <span>Incorrect, Damaged or Defective Items</span>
            </h2>
            <p>
              If you receive an incorrect, damaged or defective item, please contact us as soon as reasonably possible with your order reference and photographs of the affected item.
            </p>
            <p>
              We will review the issue and, where appropriate, arrange a replacement, refund or other suitable remedy.
            </p>
            <p>
              Where the issue resulted from an error on our part, VETANIC will bear the reasonable return or redelivery costs.
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE] text-xs text-charcoal-muted">
              Nothing in this policy is intended to exclude or limit any rights or remedies available to consumers under applicable Singapore law.
            </div>
          </section>

          {/* Section: Items That Cannot Be Returned or Exchanged */}
          <section className="space-y-3 pb-6 border-b border-[#DED7CE]/70">
            <h2 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600" />
              <span>Items That Cannot Be Returned or Exchanged</span>
            </h2>
            <p>A change-of-mind return or exchange may not be accepted where:</p>
            <ul className="space-y-2 list-disc list-inside text-charcoal-muted pl-1">
              <li>The applicable return-request period has passed.</li>
              <li>The product has been used, consumed or partially consumed.</li>
              <li>The product or its contents have been damaged due to the customer's handling.</li>
              <li>The product seal or packaging has been damaged in a manner that materially affects the product's condition or suitability for resale.</li>
              <li>The product has not been stored appropriately after delivery.</li>
              <li>The purchase cannot reasonably be verified as a VETANIC order.</li>
              <li>The item returned does not correspond with the original order.</li>
            </ul>
            <p className="text-xs text-charcoal-muted pt-1">
              Reasonable opening of external delivery packaging solely to inspect the order will not by itself make an item ineligible, provided that the product itself and any relevant product seal remain unaffected.
            </p>
          </section>

          {/* Section: Proof of Purchase */}
          <section className="space-y-3 pb-6 border-b border-[#DED7CE]/70">
            <h2 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600" />
              <span>Proof of Purchase</span>
            </h2>
            <p>
              Please provide your VETANIC <strong>Order Reference</strong> when requesting a return or exchange.
            </p>
            <p className="text-xs text-charcoal-muted">
              We may request photographs or other reasonable information needed to assess the request.
            </p>
          </section>

          {/* Section: Refunds */}
          <section className="space-y-3 pb-6 border-b border-[#DED7CE]/70">
            <h2 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600" />
              <span>Refunds</span>
            </h2>
            <p>
              Once an eligible returned product has been received and inspected, we will notify you of the outcome.
            </p>
            <p>
              Approved refunds will be arranged using an appropriate method having regard to the original payment arrangement.
            </p>
            <p className="text-xs text-charcoal-muted">
              Processing times may vary depending on the payment method or financial institution involved.
            </p>
            <p className="text-xs text-charcoal-muted">
              Original delivery charges and return delivery costs are generally non-refundable for change-of-mind returns.
            </p>
          </section>

          {/* Section: How to Request a Return or Exchange */}
          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600" />
              <span>How to Request a Return or Exchange</span>
            </h2>
            
            <p>
              Reach out to our customer care team on Instagram direct message:
            </p>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE] space-y-3">
              <div className="font-bold text-charcoal">Please provide:</div>
              <ul className="space-y-1.5 text-xs text-charcoal-muted list-disc list-inside">
                <li>Order Reference (e.g. VET-2026-0048)</li>
                <li>Product concerned</li>
                <li>Reason for the request</li>
                <li>Photographs where the product is incorrect, damaged or defective</li>
              </ul>
            </div>

            <div className="pt-2">
              <a
                href={POLICY_CONFIG.contactInstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-sm transition-all"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
                <span>Contact {POLICY_CONFIG.contactInstagramHandle}</span>
              </a>
            </div>

            <p className="text-xs text-charcoal-muted italic">
              Please contact us before arranging a return. Unauthorised returns may not be accepted.
            </p>
          </section>

        </div>

      </div>
    </main>
  );
};
