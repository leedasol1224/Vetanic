export interface PolicyMetadata {
  effectiveDate: string;
  lastUpdatedDate: string;
  version: string;
  businessEmail: string;
  contactInstagramHandle: string;
  contactInstagramUrl: string;
}

export const POLICY_CONFIG: PolicyMetadata = {
  effectiveDate: '10 September 2026',
  lastUpdatedDate: '10 September 2026',
  version: '1.0',
  businessEmail: 'vetanicsg@gmail.com',
  contactInstagramHandle: '@vetanic_global',
  contactInstagramUrl: 'https://instagram.com/vetanic_global'
};
