import { prisma } from '../lib/prisma';

export async function findStoresNearby(latitude: number, longitude: number, radiusInMeters = 5000) {
  const stores = await prisma.$queryRaw`SELECT s.store_id, s.store_name, s.vendor_id, ST_Distance(s.location, ST_MakePoint(${longitude}, ${latitude})::geography) AS distance FROM store s WHERE ST_DWithin(s.location, ST_MakePoint(${longitude}, ${latitude})::geography, ${radiusInMeters}) ORDER BY distance`;
  return stores;
}

export async function findProductsNearby(latitude: number, longitude: number, radiusInMeters = 5000) {
  const products = await prisma.$queryRaw`SELECT p.product_id, p.name, p.price, s.store_name, ST_Distance(s.location, ST_MakePoint(${longitude}, ${latitude})::geography) AS distance FROM product p JOIN store s ON p.store_id = s.store_id WHERE ST_DWithin(s.location, ST_MakePoint(${longitude}, ${latitude})::geography, ${radiusInMeters}) ORDER BY distance, p.name`;
  return products;
}
