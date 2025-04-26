import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Fetch all products with their store
    const products = await prisma.product.findMany({
      include: {
        store: true,
      },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Customer dashboard error:', error);
    return new NextResponse('Failed to fetch products', { status: 500 });
  }
}
