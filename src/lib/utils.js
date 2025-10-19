// Convert WordPress absolute URLs to relative paths, but keep images on WP server
export function makeLinksRelative(content) {
  if (!content) return '';
  
  return content
    // Fix internal page links (but NOT images)
    .replace(/href=["']https?:\/\/astrologybits\.com\//g, 'href="/')
    .replace(/href=["']https?:\/\/www\.astrologybits\.com\//g, 'href="/')
    .replace(/href=["']https?:\/\/localhost(:\d+)?\//g, 'href="/')
    // Update image URLs to use wp.astrologybits.com
    .replace(/src=["'](https?:\/\/)?astrologybits\.com\//g, 'src="https://wp.astrologybits.com/')
    .replace(/src=["'](https?:\/\/)?www\.astrologybits\.com\//g, 'src="https://wp.astrologybits.com/');
}