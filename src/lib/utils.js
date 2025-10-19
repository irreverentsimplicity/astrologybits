// Convert WordPress absolute URLs to relative paths, but keep images on WP server
export function makeLinksRelative(content) {
  if (!content) return '';
  
  let processed = content
    // Fix internal page links (but NOT images) - convert WordPress URLs to static site URLs
    .replace(/href=["']https?:\/\/(wp\.)?astrologybits\.com\//g, 'href="/')
    .replace(/href=["']https?:\/\/www\.astrologybits\.com\//g, 'href="/')
    .replace(/href=["']https?:\/\/localhost(:\d+)?\//g, 'href="/')
    // Update image URLs to use wp.astrologybits.com
    .replace(/src=["'](https?:\/\/)?astrologybits\.com\//g, 'src="https://wp.astrologybits.com/')
    .replace(/src=["'](https?:\/\/)?www\.astrologybits\.com\//g, 'src="https://wp.astrologybits.com/');
  
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