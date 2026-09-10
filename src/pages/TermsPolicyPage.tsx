import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InstagramIcon } from '../components/common/Icons';
import { POLICY_CONFIG } from '../data/legalPolicies';

export const TermsPolicyPage: React.FC = () => {
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
            <FileText className="w-3.5 h-3.5 text-brand-600" />
            <span>Customer Terms</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
            Terms & Conditions
          </h1>

          <p className="text-sm sm:text-base text-charcoal leading-relaxed font-medium">
            These Terms & Conditions govern your access to and use of the VETANIC website and your purchase of products from VETANIC in Singapore.
          </p>
          <p className="text-xs text-charcoal-muted">
            By using this website or submitting an order request, you agree to these Terms & Conditions and the policies referenced on this website.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DED7CE] shadow-soft space-y-8 text-sm text-charcoal leading-relaxed divide-y divide-[#DED7CE]/70">
          
          {/* 1. About Our Ordering Process */}
          <section className="space-y-3 pt-6 first:pt-0">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">1.</span>
              <span>About Our Ordering Process</span>
            </h2>
            <p>
              Submitting an order through the VETANIC website constitutes an <strong>order request</strong>.
            </p>
            <p>
              It does <strong>NOT</strong> mean that the order has immediately been accepted or confirmed.
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE] text-xs font-medium space-y-1.5">
              <div className="font-bold text-charcoal uppercase tracking-wider text-[10px] text-brand-600">The process is:</div>
              <p className="text-charcoal leading-relaxed">
                Order Submitted → VETANIC reviews product availability → Order Confirmed → Payment instructions are provided → Payment is received → Order is prepared for delivery
              </p>
            </div>
            <p className="text-xs text-charcoal-muted">
              After submitting an order request, customers will receive an Order Reference. VETANIC may contact the customer if an item is unavailable or if clarification is required.
            </p>
            <p className="text-xs text-charcoal-muted">
              An order is considered accepted by VETANIC only after we have confirmed the order following our availability review.
            </p>
          </section>

          {/* 2. Product Availability */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">2.</span>
              <span>Product Availability</span>
            </h2>
            <p>All products are subject to availability.</p>
            <p className="text-xs text-charcoal-muted">
              Submission of an order request does not reserve or guarantee stock unless and until the order has been confirmed by VETANIC.
            </p>
            <p>If an item is unavailable, we may offer the customer the option to:</p>
            <ul className="space-y-1 text-xs text-charcoal-muted list-disc list-inside pl-1">
              <li>proceed without the unavailable item;</li>
              <li>select an alternative where available; or</li>
              <li>cancel the affected order.</li>
            </ul>
          </section>

          {/* 3. Prices */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">3.</span>
              <span>Prices</span>
            </h2>
            <p>Prices are displayed in Singapore Dollars (SGD) unless otherwise stated.</p>
            <p className="text-xs text-charcoal-muted">
              Promotional prices and offers may be available for limited periods and may be subject to specific conditions. We may update prices and promotions from time to time.
            </p>
            <p className="text-xs text-charcoal-muted">
              The amount applicable to an order will be confirmed before payment. If an obvious pricing or system error occurs, VETANIC may correct the error and inform the customer before accepting or fulfilling the affected order, subject to applicable law.
            </p>
          </section>

          {/* 4. Payment */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">4.</span>
              <span>Payment</span>
            </h2>
            <p>
              Payment instructions are provided only after VETANIC has reviewed and confirmed the order.
            </p>
            <p className="text-xs text-charcoal-muted">
              Customers should not make payment until they receive the relevant payment instructions. An order may proceed to fulfilment after the required payment has been received and verified.
            </p>
          </section>

          {/* 5. Delivery */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">5.</span>
              <span>Delivery</span>
            </h2>
            <p>VETANIC currently offers:</p>
            <ul className="space-y-1 text-xs text-charcoal-muted list-disc list-inside pl-1">
              <li>Standard Delivery</li>
              <li>Express Delivery, where available</li>
            </ul>
            <p className="text-xs text-charcoal-muted">
              Available delivery options, applicable charges and any estimated delivery information will be displayed or communicated during the ordering process.
            </p>
            <p className="text-xs text-charcoal-muted">
              Delivery estimates are estimates rather than guaranteed delivery times unless expressly stated otherwise. Customers are responsible for providing accurate and complete delivery details.
            </p>
          </section>

          {/* 6. Order Information */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">6.</span>
              <span>Order Information</span>
            </h2>
            <p>
              Customers must provide accurate information when submitting an order, including their name, mobile number and delivery information.
            </p>
            <p className="text-xs text-charcoal-muted">
              VETANIC is not responsible for delays or failed delivery caused by materially incorrect or incomplete information supplied by the customer, except to the extent required by applicable law.
            </p>
          </section>

          {/* 7. Cancellations, Returns and Exchanges */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">7.</span>
              <span>Cancellations, Returns and Exchanges</span>
            </h2>
            <p>
              Returns and exchanges are governed by our{' '}
              <Link to="/returns" className="text-brand-600 font-bold hover:underline">
                Returns & Exchanges Policy
              </Link>.
            </p>
            <p className="text-xs text-charcoal-muted">
              Nothing in these Terms is intended to exclude or limit rights or remedies that cannot lawfully be excluded under Singapore law.
            </p>
          </section>

          {/* 8. Product Information */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">8.</span>
              <span>Product Information</span>
            </h2>
            <p>
              We aim to present product descriptions, images, prices and other information as accurately as reasonably possible.
            </p>
            <p className="text-xs text-charcoal-muted">
              Packaging or product presentation may vary from website photography from time to time. Where there is a material error affecting an order, we will take reasonable steps to inform the affected customer.
            </p>
          </section>

          {/* 9. Pet Wellness Information */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">9.</span>
              <span>Pet Wellness Information</span>
            </h2>
            <p>
              Information provided on the VETANIC website is intended for general product and pet wellness information.
            </p>
            <p>
              VETANIC products are not presented as a substitute for veterinary diagnosis, treatment or professional veterinary advice.
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE] text-xs text-charcoal-muted space-y-1">
              <p>
                If your pet has an existing medical condition, is receiving treatment, takes medication, has known allergies or experiences an adverse reaction, please seek advice from a veterinarian as appropriate.
              </p>
              <p className="font-medium text-charcoal pt-1">
                Always follow the relevant product feeding and usage instructions.
              </p>
            </div>
          </section>

          {/* 10. Website Use */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">10.</span>
              <span>Website Use</span>
            </h2>
            <p>You must not use the VETANIC website:</p>
            <ul className="space-y-1.5 text-xs text-charcoal-muted list-disc list-inside pl-1">
              <li>for unlawful or fraudulent purposes;</li>
              <li>to interfere with the website's security or operation;</li>
              <li>to attempt unauthorised access to administrative systems or other customers' information;</li>
              <li>to transmit malicious software or code;</li>
              <li>to scrape or collect personal information of other users without authorisation.</li>
            </ul>
          </section>

          {/* 11. Intellectual Property */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">11.</span>
              <span>Intellectual Property</span>
            </h2>
            <p>
              VETANIC website content, branding, logos, graphics, product photography and other materials may be protected by copyright, trademark and other intellectual-property rights.
            </p>
            <p className="text-xs text-charcoal-muted">
              They may not be reproduced or commercially used without appropriate permission from the relevant rights holder.
            </p>
          </section>

          {/* 12. Third-Party Services */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">12.</span>
              <span>Third-Party Services</span>
            </h2>
            <p>
              We may use third-party providers to support functions such as website hosting, database services, communications, payment processing and delivery.
            </p>
            <p className="text-xs text-charcoal-muted">
              Their services may be subject to their own terms and privacy practices.
            </p>
          </section>

          {/* 13. Website Availability */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">13.</span>
              <span>Website Availability</span>
            </h2>
            <p>
              We aim to keep the website available and accurate but cannot guarantee uninterrupted or error-free operation.
            </p>
            <p className="text-xs text-charcoal-muted">
              We may update, maintain or temporarily suspend parts of the website where reasonably necessary. Nothing in these Terms excludes or limits liability where it would be unlawful to do so.
            </p>
          </section>

          {/* 14. Changes to These Terms */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">14.</span>
              <span>Changes to These Terms</span>
            </h2>
            <p>
              We may update these Terms & Conditions from time to time.
            </p>
            <p className="text-xs text-charcoal-muted">
              The latest version will be published on this page with its effective or last-updated date.
            </p>
          </section>

          {/* 15. Governing Law */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">15.</span>
              <span>Governing Law</span>
            </h2>
            <p>
              These Terms & Conditions are governed by the laws of <strong>Singapore</strong>.
            </p>
          </section>

          {/* 16. Contact */}
          <section className="space-y-4 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">16.</span>
              <span>Contact</span>
            </h2>
            <p>
              For questions regarding an order or these Terms & Conditions, contact:
            </p>
            <div>
              <a
                href={POLICY_CONFIG.contactInstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-sm transition-all"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
                <span>Instagram: {POLICY_CONFIG.contactInstagramHandle}</span>
              </a>
            </div>
          </section>

        </div>

      </div>
    </main>
  );
};
