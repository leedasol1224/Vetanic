import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InstagramIcon } from '../components/common/Icons';
import { POLICY_CONFIG } from '../data/legalPolicies';

export const PrivacyPolicyPage: React.FC = () => {
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
            <Lock className="w-3.5 h-3.5 text-brand-600" />
            <span>Data Protection</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-charcoal leading-relaxed font-medium">
            VETANIC respects your privacy and is committed to handling personal data responsibly.
          </p>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            This Privacy Policy explains how we may collect, use, disclose, store and protect personal data when you use the VETANIC website, submit an order request or otherwise interact with us.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DED7CE] shadow-soft space-y-8 text-sm text-charcoal leading-relaxed divide-y divide-[#DED7CE]/70">
          
          {/* 1. Information We Collect */}
          <section className="space-y-3 pt-6 first:pt-0">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">1.</span>
              <span>Information We Collect</span>
            </h2>
            <p>
              Depending on how you use our website and services, we may collect information such as:
            </p>
            <ul className="space-y-1.5 text-xs text-charcoal-muted list-disc list-inside pl-1">
              <li>Full name</li>
              <li>Mobile number</li>
              <li>Delivery address</li>
              <li>Postal code</li>
              <li>Order details and purchase history</li>
              <li>Order Reference</li>
              <li>Delivery preference</li>
              <li>Payment-related information necessary to verify or administer payment</li>
              <li>Preferred contact method, where applicable</li>
              <li>Communications and enquiries sent to VETANIC</li>
              <li>Information reasonably necessary to process returns, exchanges or customer-service requests</li>
              <li>Technical or usage information generated through the website where applicable</li>
            </ul>
          </section>

          {/* 2. Why We Collect and Use Personal Data */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">2.</span>
              <span>Why We Collect and Use Personal Data</span>
            </h2>
            <p>We may collect and use personal data for purposes including:</p>
            <ul className="space-y-1.5 text-xs text-charcoal-muted list-disc list-inside pl-1">
              <li>receiving and processing order requests;</li>
              <li>confirming product availability;</li>
              <li>communicating order and payment information;</li>
              <li>processing and verifying payments;</li>
              <li>arranging and completing delivery;</li>
              <li>allowing customers to securely retrieve relevant order information through My Orders;</li>
              <li>managing returns, exchanges and customer enquiries;</li>
              <li>maintaining transaction and business records;</li>
              <li>preventing or investigating fraud, misuse or security incidents;</li>
              <li>improving the operation and security of our website and services;</li>
              <li>complying with applicable legal or regulatory requirements.</li>
            </ul>
          </section>

          {/* 3. My Orders */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">3.</span>
              <span>My Orders</span>
            </h2>
            <p>
              VETANIC provides a guest <strong>My Orders</strong> function.
            </p>
            <p>
              Customers may be asked to verify information such as:
            </p>
            <ul className="space-y-1 text-xs text-charcoal-muted list-disc list-inside pl-1">
              <li>Order Reference</li>
              <li>Mobile Number</li>
            </ul>
            <p className="text-xs text-charcoal-muted">
              before accessing relevant order information. These verification measures are intended to reduce unauthorised access but do not replace our other security controls.
            </p>
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE] text-xs font-medium text-charcoal">
              My Orders must never expose another customer's order or personal information.
            </div>
          </section>

          {/* 4. Disclosure to Service Providers */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">4.</span>
              <span>Disclosure to Service Providers</span>
            </h2>
            <p>
              We may disclose personal data where reasonably necessary to third parties that provide services supporting our operations, such as:
            </p>
            <ul className="space-y-1.5 text-xs text-charcoal-muted list-disc list-inside pl-1">
              <li>website hosting and database providers;</li>
              <li>technology and security providers;</li>
              <li>payment or financial service providers, where applicable;</li>
              <li>delivery or logistics providers;</li>
              <li>communications providers;</li>
              <li>professional advisers or authorities where required or permitted by law.</li>
            </ul>
            <p className="text-xs text-charcoal-muted font-medium">
              We only disclose information reasonably necessary for the relevant purpose. We do not sell customer personal data.
            </p>
          </section>

          {/* 5. Overseas Processing */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">5.</span>
              <span>Overseas Processing</span>
            </h2>
            <p>
              Some technology or service providers used by VETANIC may process or store data outside Singapore.
            </p>
            <p className="text-xs text-charcoal-muted">
              Where personal data is transferred outside Singapore, VETANIC will take appropriate steps as required under applicable Singapore data-protection requirements.
            </p>
          </section>

          {/* 6. Data Security */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">6.</span>
              <span>Data Security</span>
            </h2>
            <p>
              We take reasonable administrative and technical measures to protect personal data against risks such as unauthorised access, collection, use, disclosure, copying, modification or loss.
            </p>
            <p className="text-xs text-charcoal-muted">
              Access to customer and order information is restricted to authorised persons where reasonably practicable. However, no electronic storage or transmission system can be guaranteed to be completely secure.
            </p>
          </section>

          {/* 7. Data Retention */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">7.</span>
              <span>Data Retention</span>
            </h2>
            <p>
              We retain personal data only for as long as reasonably necessary to fulfil the purposes for which it was collected or to satisfy applicable legal or business requirements.
            </p>
            <p className="text-xs text-charcoal-muted">
              When personal data is no longer required, we will take reasonable steps to delete, anonymise or otherwise cease retaining it as appropriate.
            </p>
          </section>

          {/* 8. Accuracy */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">8.</span>
              <span>Accuracy</span>
            </h2>
            <p>
              Customers should provide accurate and current information when placing an order.
            </p>
            <p className="text-xs text-charcoal-muted">
              If your relevant personal information changes or is incorrect, please contact us so that we can consider the appropriate correction.
            </p>
          </section>

          {/* 9. Access and Correction */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">9.</span>
              <span>Access and Correction</span>
            </h2>
            <p>
              Subject to applicable law, individuals may request access to or correction of personal data held about them.
            </p>
            <p className="text-xs text-charcoal-muted">
              Appropriate identity verification may be required before such a request is processed. To make an enquiry or request, contact VETANIC through Instagram{' '}
              <a
                href={POLICY_CONFIG.contactInstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 font-bold hover:underline"
              >
                {POLICY_CONFIG.contactInstagramHandle}
              </a>.
            </p>
          </section>

          {/* 10. Consent and Withdrawal */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">10.</span>
              <span>Consent and Withdrawal</span>
            </h2>
            <p>
              Where VETANIC relies on consent to collect, use or disclose personal data, you may contact us to withdraw that consent, subject to applicable legal and contractual restrictions and reasonable notice.
            </p>
            <p className="text-xs text-charcoal-muted">
              Withdrawal of consent may affect our ability to provide services that require the relevant personal data, such as processing or delivering an order.
            </p>
          </section>

          {/* 11. Cookies and Website Technologies */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">11.</span>
              <span>Cookies and Website Technologies</span>
            </h2>
            <p>
              The VETANIC website currently utilizes essential browser storage (such as session storage for guest order lookup and order request persistence) necessary for website functionality.
            </p>
            <p className="text-xs text-charcoal-muted">
              We do not deploy non-essential third-party advertising or cross-site tracking cookies.
            </p>
          </section>

          {/* 12. Marketing Communications */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">12.</span>
              <span>Marketing Communications</span>
            </h2>
            <p>
              VETANIC does not use customer mobile numbers or contact information for unsolicited promotional communications simply because an order request was placed.
            </p>
          </section>

          {/* 13. Changes to this Privacy Policy */}
          <section className="space-y-3 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">13.</span>
              <span>Changes to this Privacy Policy</span>
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our operations, services or applicable requirements.
            </p>
            <p className="text-xs text-charcoal-muted">
              The latest version will be posted on this website together with the applicable last-updated date.
            </p>
          </section>

          {/* 14. Contact */}
          <section className="space-y-4 pt-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-charcoal flex items-center gap-2">
              <span className="text-brand-600 font-mono text-sm">14.</span>
              <span>Contact</span>
            </h2>
            <p>
              For privacy-related questions or requests, contact:
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
