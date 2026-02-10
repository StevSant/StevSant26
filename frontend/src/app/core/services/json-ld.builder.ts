import { JsonLdSchema } from './seo.types';

/**
 * Build a Person JSON-LD schema
 */
export function buildPersonSchema(
  siteUrl: string,
  options: {
    name: string;
    email?: string | null;
    url?: string;
    image?: string | null;
    jobTitle?: string;
    sameAs?: string[];
  }
): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: options.name,
    ...(options.email && { email: `mailto:${options.email}` }),
    url: options.url || siteUrl,
    ...(options.image && { image: options.image }),
    ...(options.jobTitle && { jobTitle: options.jobTitle }),
    ...(options.sameAs?.length && { sameAs: options.sameAs }),
  };
}

/**
 * Build a WebSite JSON-LD schema
 */
export function buildWebSiteSchema(siteUrl: string, name: string): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: siteUrl,
  };
}

/**
 * Build a BreadcrumbList JSON-LD schema
 */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Build a CreativeWork (Project) JSON-LD schema
 */
export function buildProjectSchema(options: {
  name: string;
  description?: string;
  url?: string;
  image?: string | null;
  dateCreated?: string | null;
  author?: string;
  keywords?: string[];
}): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: options.name,
    ...(options.description && { description: options.description }),
    ...(options.url && { url: options.url }),
    ...(options.image && { image: options.image }),
    ...(options.dateCreated && { dateCreated: options.dateCreated }),
    ...(options.author && { author: { '@type': 'Person', name: options.author } }),
    ...(options.keywords?.length && { keywords: options.keywords.join(', ') }),
  };
}

/**
 * Build an Organization/Experience JSON-LD schema
 */
export function buildExperienceSchema(options: {
  personName: string;
  roleName: string;
  companyName: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string;
}): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'OrganizationRole',
    roleName: options.roleName,
    startDate: options.startDate || undefined,
    endDate: options.endDate || undefined,
    ...(options.description && { description: options.description }),
    memberOf: {
      '@type': 'Organization',
      name: options.companyName,
    },
  };
}

/**
 * Build an EducationalOccupationalCredential JSON-LD schema
 */
export function buildEducationSchema(options: {
  name: string;
  institution: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string;
}): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name: options.name,
    recognizedBy: {
      '@type': 'Organization',
      name: options.institution,
    },
    ...(options.startDate && { dateCreated: options.startDate }),
    ...(options.description && { description: options.description }),
  };
}

/**
 * Build an Event JSON-LD schema
 */
export function buildEventSchema(options: {
  name: string;
  description?: string;
  startDate?: string | null;
  url?: string;
  image?: string | null;
}): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: options.name,
    ...(options.description && { description: options.description }),
    ...(options.startDate && { startDate: options.startDate }),
    ...(options.url && { url: options.url }),
    ...(options.image && { image: options.image }),
  };
}
