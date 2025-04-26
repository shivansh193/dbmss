import { NextRequest, NextResponse } from 'next/server';
import { findProductsNearby } from '@/lib/geospatial';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radius = parseInt(searchParams.get('radius') || '5000', 10);
  if (isNaN(lat) || isNaN(lng)) return new NextResponse('Missing or invalid lat/lng', { status: 400 });
  try {
    const products = await findProductsNearby(lat, lng, radius);
    return NextResponse.json({ products });
  } catch (error: any) {
    return new NextResponse('Nearby search failed', { status: 500 });
  }
}
