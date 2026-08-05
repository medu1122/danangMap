import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize URL to prevent XSS attacks
 * Only allows http, https, and relative URLs
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '#';
  
  // Trim whitespace
  const trimmed = url.trim();
  
  // Allow only safe protocols
  if (/^(https?:|mailto:|tel:)/.test(trimmed)) {
    // Sanitize the URL
    const clean = DOMPurify.sanitize(trimmed, { ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-zA-Z\d])/ });
    return clean;
  }
  
  // Default to # if URL is invalid
  return '#';
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

/**
 * Validate Facebook URL format
 */
export function isValidFacebookUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Allow facebook.com, m.facebook.com, and fb.com
    return hostname === 'facebook.com' || 
           hostname === 'm.facebook.com' || 
           hostname === 'www.facebook.com' ||
           hostname === 'fb.com' ||
           hostname === 'www.fb.com' ||
           hostname.endsWith('.facebook.com');
  } catch {
    return false;
  }
}

/**
 * Format Facebook URL to standard format
 */
export function formatFacebookUrl(url: string): string {
  if (!url) return '';
  
  let formatted = url.trim();
  
  // Add https if missing
  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = 'https://' + formatted;
  }
  
  // Normalize facebook.com
  formatted = formatted.replace(/m\.facebook\.com/gi, 'facebook.com');
  formatted = formatted.replace(/www\.facebook\.com/gi, 'facebook.com');
  
  return formatted;
}

/**
 * Extract Facebook page name from URL
 */
export function extractFacebookPageName(url: string): string {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    // Extract the last segment of the path
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      return segments[segments.length - 1];
    }
    
    return urlObj.hostname;
  } catch {
    return url;
  }
}
