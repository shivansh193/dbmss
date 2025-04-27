// lib/cache.ts

import { prisma } from '../lib/prisma';

export async function getCachedValue(key: string) {
  const result = await prisma.$queryRaw`SELECT cache_get(${key})`;
  const value = result[0]?.cache_get;
  // If already an object, return as-is. If string, parse as JSON.
  if (value && typeof value === 'object') return value;
  if (typeof value === 'string') return JSON.parse(value);
  return null;
}
function replacer(key: string, value: any) {
  // Convert BigInt to string for JSON serialization
  return typeof value === 'bigint' ? value.toString() : value;
}
export async function setCachedValue(key: string, value: any, ttlSeconds: number = 3600) {
  const jsonValue = JSON.stringify(value, replacer);
  await prisma.$executeRaw`SELECT cache_set(${key}, ${jsonValue}::jsonb, ${ttlSeconds}::integer)`;
}


export async function clearCache(keyPattern?: string) {
  if (keyPattern) {
    await prisma.$executeRaw`DELETE FROM cache WHERE key LIKE ${`%${keyPattern}%`}`;
  } else {
    await prisma.$executeRaw`DELETE FROM cache`;
  }
}

export function setupCacheCleanup() {
  setInterval(async () => {
    await prisma.$executeRaw`DELETE FROM cache WHERE expires_at < NOW()`;
  }, 3600000);
}
