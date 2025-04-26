import { prisma } from '../lib/prisma';

export async function getCachedValue(key: string) {
  const result = await prisma.$queryRaw`SELECT cache_get(${key})`;
  return result[0]?.cache_get;
}

export async function setCachedValue(key: string, value: any, ttlSeconds: number = 3600) {
  const jsonValue = JSON.stringify(value);
  await prisma.$executeRaw`SELECT cache_set(${key}, ${jsonValue}::jsonb, ${ttlSeconds})`;
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
