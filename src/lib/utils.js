// Convert WordPress absolute URLs to relative paths, but keep images on WP server
export function makeLinksRelative(content) {
  if (!content) return '';
  
  let processed = content
    // Fix internal page links (but NOT images) - convert WordPress URLs to static site URLs
    .replace(/href=["']https?:\/\/(wp\.)?astrologybits\.com\//g, 'href="/')
    .replace(/href=["']https?:\/\/www\.astrologybits\.com\//g, 'href="/')
    .replace(/href=["']https?:\/\/localhost(:\d+)?\//g, 'href="/')
    // Force HTTPS for all external links
    .replace(/href=["']http:\/\/(?!localhost)/g, 'href="https://')
    // Update image URLs to use wp.astrologybits.com
    .replace(/src=["'](https?:\/\/)?astrologybits\.com\//g, 'src="https://wp.astrologybits.com/')
    .replace(/src=["'](https?:\/\/)?www\.astrologybits\.com\//g, 'src="https://wp.astrologybits.com/')
    // Force HTTPS for images
    .replace(/src=["']http:\/\//g, 'src="https://');
  
  // Add default alt text to images that don't have it
  processed = processed.replace(/<img([^>]*)>/g, (match, attrs) => {
    // Check if alt attribute exists
    if (!attrs.includes('alt=')) {
      // Extract title or use filename for alt text
      let altText = 'Astrology related image';
      const titleMatch = attrs.match(/title=["']([^"']+)["']/);
      if (titleMatch) {
        altText = titleMatch[1];
      } else {
        const srcMatch = attrs.match(/src=["']([^"']+)["']/);
        if (srcMatch) {
          const filename = srcMatch[1].split('/').pop().split('.')[0];
          altText = filename.replace(/[-_]/g, ' ');
        }
      }
      return `<img${attrs} alt="${altText}">`;
    }
    return match;
  });
  
  return processed;
}

// Clean canonical URLs to ensure they use the correct domain
export function cleanCanonicalUrl(url) {
  if (!url) return url;
  
  // Convert any WordPress URLs or wrong domains to astrologybits.com
  return url
    .replace(/https?:\/\/wp\.astrologybits\.com\//g, 'https://astrologybits.com/')
    .replace(/https?:\/\/www\.astrologybits\.com\//g, 'https://astrologybits.com/')
    .replace(/^http:\/\//g, 'https://'); // Force HTTPS
}

// Update WordPress image URLs to use wp.astrologybits.com subdomain
export function updateWordPressImageUrls(url) {
  if (!url) return url;
  
  // Convert image URLs to use wp.astrologybits.com subdomain for proper serving
  return url
    .replace(/https?:\/\/astrologybits\.com\/wp-content\//g, 'https://wp.astrologybits.com/wp-content/')
    .replace(/https?:\/\/www\.astrologybits\.com\/wp-content\//g, 'https://wp.astrologybits.com/wp-content/')
    .replace(/^http:\/\//g, 'https://'); // Force HTTPS
}

// Clean schema markup to use correct domains
export function cleanSchemaMarkup(schemaString) {
  if (!schemaString) return null;
  
  try {
    let cleanedSchema = schemaString
      // Fix canonical URLs in schema
      .replace(/https?:\/\/wp\.astrologybits\.com\//g, 'https://astrologybits.com/')
      .replace(/https?:\/\/www\.astrologybits\.com\//g, 'https://astrologybits.com/')
      // Fix image URLs in schema to use wp subdomain
      .replace(/https?:\/\/astrologybits\.com\/wp-content\//g, 'https://wp.astrologybits.com/wp-content/')
      // Force HTTPS
      .replace(/http:\/\//g, 'https://');
    
    // Parse and return as object to validate JSON
    return JSON.parse(cleanedSchema);
  } catch (e) {
    console.warn('Could not parse schema markup:', e);
    return null;
  }
}