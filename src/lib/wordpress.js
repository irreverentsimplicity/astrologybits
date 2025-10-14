const WP_GRAPHQL_URL = 'https://astrologybits.com/graphql';

async function fetchGraphQL(query, variables = {}) {
  console.log('🔍 Fetching from:', WP_GRAPHQL_URL);
  
  try {
    const response = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables })
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error:', errorText);
      throw new Error(`GraphQL Error: ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    
    if (json.errors) {
      console.error('❌ GraphQL Errors:', JSON.stringify(json.errors, null, 2));
      throw new Error(`GraphQL query failed: ${JSON.stringify(json.errors)}`);
    }

    return json.data;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  }
}

// Get all pages with Yoast SEO data
export async function getAllPages() {
  const query = `
    query GetAllPages {
      pages(first: 1000) {
        nodes {
          id
          databaseId
          title
          slug
          uri
          content
          date
          modified
          seo {
            title
            metaDesc
            canonical
            opengraphTitle
            opengraphDescription
            opengraphImage {
              sourceUrl
            }
            twitterTitle
            twitterDescription
            schema {
              raw
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query);
  const pages = data.pages.nodes;
  
  console.log(`✓ Fetched ${pages.length} pages from WordPress`);
  
  // Filter out pages with null content
  const validPages = pages.filter(page => {
    if (!page.content) {
      console.warn(`⚠️  Skipping page "${page.title}" - no content`);
      return false;
    }
    return true;
  });
  
  console.log(`✓ ${validPages.length} pages have content`);
  return validPages;
}

// Get all posts
export async function getAllPosts() {
  const query = `
    query GetAllPosts {
      posts(first: 1000) {
        nodes {
          id
          databaseId
          title
          slug
          uri
          content
          excerpt
          date
          modified
          seo {
            title
            metaDesc
            canonical
            opengraphTitle
            opengraphDescription
            opengraphImage {
              sourceUrl
            }
            twitterTitle
            twitterDescription
            schema {
              raw
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query);
  const posts = data.posts.nodes;
  
  console.log(`✓ Fetched ${posts.length} posts from WordPress`);
  
  const validPosts = posts.filter(post => {
    if (!post.content) {
      console.warn(`⚠️  Skipping post "${post.title}" - no content`);
      return false;
    }
    return true;
  });
  
  console.log(`✓ ${validPosts.length} posts have content`);
  return validPosts;
}

// Helper to clean WordPress URLs
export function getSlugFromUri(uri) {
  return uri.replace(/^\/|\/$/g, '') || 'index';
}