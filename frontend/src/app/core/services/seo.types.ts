/**
 * Options for updating page meta tags (SEO / Open Graph / Twitter Cards)
 */
export interface SeoMetaOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  locale?: string;
  author?: string;
  robots?: string;
}

/**
 * Generic JSON-LD structured data schema
 */
export interface JsonLdSchema {
  [key: string]: unknown;
}
