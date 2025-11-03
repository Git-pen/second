import { MeiliSearch } from 'meilisearch';

const meiliClient = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_API_KEY,
});

export const initializeSearchIndexes = async () => {
  try {
    const productsIndex = meiliClient.index('products');
    
    await productsIndex.updateSettings({
      searchableAttributes: ['title', 'description', 'category', 'tags'],
      filterableAttributes: ['category', 'price', 'rating', 'stock'],
      sortableAttributes: ['price', 'rating', 'createdAt'],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
      ],
    });

    console.log('✅ MeiliSearch indexes initialized');
  } catch (error) {
    console.error('❌ Failed to initialize MeiliSearch:', error);
  }
};

export default meiliClient;
