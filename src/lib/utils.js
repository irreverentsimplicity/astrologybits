// Convert WordPress absolute URLs to relative paths, but keep images on WP server
export function makeLinksRelative(content) {
  if (!content) return '';
  
  return content
    // Fix internal page links (but NOT images)
    .replace(/href=["']https?:\/\/astrologybits\.com\//g, 'href="/')
    .replace(/href=["']https?:\/\/www\.astrologybits\.com\//g, 'href="/')
    .replace(/href=["']https?:\/\/localhost(:\d+)?\//g, 'href="/');
  
  // Images stay on WordPress server - don't change src attributes
}