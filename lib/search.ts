import { prisma } from '../lib/prisma';
import { getCachedValue, setCachedValue } from './cache';

export async function searchProducts(searchTerm: string): Promise<any[]> {
  const results = await prisma.$queryRaw<any[]>`SELECT p.product_id, p.name, p.price, p.description, p.image_url, s.store_name, ts_rank(p.search_vector, plainto_tsquery('english', ${searchTerm})) AS rank, 'product' as type FROM product p JOIN store s ON p.store_id = s.store_id WHERE p.search_vector @@ plainto_tsquery('english', ${searchTerm}) ORDER BY rank DESC LIMIT 10`;
  return results;
}

export async function searchStores(searchTerm: string): Promise<any[]> {
  const results = await prisma.$queryRaw<any[]>`SELECT s.store_id, s.store_name, s.description, s.banner_url, s.city, s.state, ts_rank(s.search_vector, plainto_tsquery('english', ${searchTerm})) AS rank, 'store' as type FROM store s WHERE s.search_vector @@ plainto_tsquery('english', ${searchTerm}) ORDER BY rank DESC LIMIT 10`;
  return results;
}

export async function searchVendors(searchTerm: string): Promise<any[]> {
  const results = await prisma.$queryRaw<any[]>`SELECT v.vendor_id, v.business_name, v.contact_info, v.registration_date, ts_rank(to_tsvector('english', v.business_name), plainto_tsquery('english', ${searchTerm})) AS rank, 'vendor' as type FROM vendor v WHERE to_tsvector('english', v.business_name) @@ plainto_tsquery('english', ${searchTerm}) ORDER BY rank DESC LIMIT 10`;
  return results;
}


export async function getSearchSuggestions(searchTerm: string): Promise<any[]> {
  // Product suggestions
  const productSuggestions = await prisma.$queryRaw<any[]>`SELECT p.name AS suggestion, 'product' as type, COUNT(*) AS popularity FROM product p WHERE p.name % ${searchTerm} OR p.search_vector @@ plainto_tsquery('english', ${searchTerm}) GROUP BY p.name ORDER BY similarity(p.name, ${searchTerm}) DESC, popularity DESC LIMIT 5`;
  // Store suggestions
  const storeSuggestions = await prisma.$queryRaw<any[]>`SELECT s.store_name AS suggestion, 'store' as type, COUNT(*) AS popularity FROM store s WHERE s.store_name % ${searchTerm} OR s.search_vector @@ plainto_tsquery('english', ${searchTerm}) GROUP BY s.store_name ORDER BY similarity(s.store_name, ${searchTerm}) DESC, popularity DESC LIMIT 3`;
  // Vendor suggestions
  const vendorSuggestions = await prisma.$queryRaw<any[]>`SELECT v.business_name AS suggestion, 'vendor' as type, COUNT(*) AS popularity FROM vendor v WHERE v.business_name % ${searchTerm} OR to_tsvector('english', v.business_name) @@ plainto_tsquery('english', ${searchTerm}) GROUP BY v.business_name ORDER BY similarity(v.business_name, ${searchTerm}) DESC, popularity DESC LIMIT 2`;
  return [...productSuggestions, ...storeSuggestions, ...vendorSuggestions];
}

export async function getCachedSearchResults(searchTerm: string) {
  const cacheKey = `search:results:${searchTerm.toLowerCase()}`;
  const cachedResults = await getCachedValue(cacheKey);
  if (cachedResults) return JSON.parse(cachedResults);
  // Search all types
  const [products, stores, vendors] = await Promise.all([
    searchProducts(searchTerm),
    searchStores(searchTerm),
    searchVendors(searchTerm),
  ]);
  const results = [...products, ...stores, ...vendors];
  await setCachedValue(cacheKey, results, 900);
  return results;
}

export async function getCachedSearchSuggestions(searchTerm: string) {
  const cacheKey = `search:suggestions:${searchTerm.toLowerCase()}`;
  const cachedSuggestions = await getCachedValue(cacheKey);
  if (cachedSuggestions) return cachedSuggestions; // No JSON.parse
  const suggestions = await getSearchSuggestions(searchTerm);
  await setCachedValue(cacheKey, suggestions, 600);
  await trackPopularSearch(searchTerm.toLowerCase());
  return suggestions;
}

async function trackPopularSearch(searchTerm: string) {
  await prisma.$executeRaw`INSERT INTO popular_searches (term, count) VALUES (${searchTerm}, 1) ON CONFLICT (term) DO UPDATE SET count = popular_searches.count + 1, last_searched = NOW()`;
}
