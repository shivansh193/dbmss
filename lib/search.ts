import { prisma } from '../lib/prisma';
import { getCachedValue, setCachedValue } from './cache';

export async function searchProducts(searchTerm: string) {
  const results = await prisma.$queryRaw`SELECT p.product_id, p.name, p.price, p.description, p.image_url, s.store_name, ts_rank(p.search_vector, plainto_tsquery('english', ${searchTerm})) AS rank FROM product p JOIN store s ON p.store_id = s.store_id WHERE p.search_vector @@ plainto_tsquery('english', ${searchTerm}) ORDER BY rank DESC LIMIT 20`;
  return results;
}

export async function getSearchSuggestions(searchTerm: string) {
  const suggestions = await prisma.$queryRaw`SELECT p.name AS suggestion, COUNT(*) AS popularity FROM product p WHERE p.name % ${searchTerm} OR p.search_vector @@ plainto_tsquery('english', ${searchTerm}) GROUP BY p.name ORDER BY similarity(p.name, ${searchTerm}) DESC, popularity DESC LIMIT 10`;
  return suggestions;
}

export async function getCachedSearchResults(searchTerm: string) {
  const cacheKey = `search:results:${searchTerm.toLowerCase()}`;
  const cachedResults = await getCachedValue(cacheKey);
  if (cachedResults) return JSON.parse(cachedResults);
  const results = await searchProducts(searchTerm);
  await setCachedValue(cacheKey, results, 900);
  return results;
}

export async function getCachedSearchSuggestions(searchTerm: string) {
  const cacheKey = `search:suggestions:${searchTerm.toLowerCase()}`;
  const cachedSuggestions = await getCachedValue(cacheKey);
  if (cachedSuggestions) return JSON.parse(cachedSuggestions);
  const suggestions = await getSearchSuggestions(searchTerm);
  await setCachedValue(cacheKey, suggestions, 600);
  await trackPopularSearch(searchTerm.toLowerCase());
  return suggestions;
}

async function trackPopularSearch(searchTerm: string) {
  await prisma.$executeRaw`INSERT INTO popular_searches (term, count) VALUES (${searchTerm}, 1) ON CONFLICT (term) DO UPDATE SET count = popular_searches.count + 1, last_searched = NOW()`;
}
