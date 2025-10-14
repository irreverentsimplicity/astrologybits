const WP_GRAPHQL_URL = 'https://wp.astrologybits.com/graphql';

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
  let allPages = [];
  let hasNextPage = true;
  let endCursor = null;

  // Fetch all pages with pagination
  while (hasNextPage) {
    const query = `
      query GetAllPages($after: String) {
        pages(first: 100, after: $after, where: {status: PUBLISH}) {
          pageInfo {
            hasNextPage
            endCursor
          }
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

    const data = await fetchGraphQL(query, { after: endCursor });
    
    allPages = [...allPages, ...data.pages.nodes];
    hasNextPage = data.pages.pageInfo.hasNextPage;
    endCursor = data.pages.pageInfo.endCursor;
    
    console.log(`  Fetched batch: ${data.pages.nodes.length} pages (total so far: ${allPages.length})`);
  }

  console.log(`\n✓ Fetched ${allPages.length} total pages from WordPress`);
  
  // Filter out pages without content
  const validPages = allPages.filter(page => {
    if (!page.content) {
      console.warn(`⚠️  Skipping page "${page.title}" - no content`);
      return false;
    }
    return true;
  });
  
  console.log(`✓ ${validPages.length} pages have content\n`);
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
  // Remove only the leading slash, keep trailing slash
  const cleaned = uri.replace(/^\//, '');
  // If it's empty or just 'index', return that
  return cleaned || 'index';
}