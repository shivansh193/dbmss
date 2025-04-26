import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return new NextResponse('Invalid product ID', { status: 400 });
    const product = await prisma.product.findUnique({
      where: { id },
      include: { store: true },
    });
    if (!product) return new NextResponse('Product not found', { status: 404 });
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Product fetch error:', error);
    return new NextResponse('Failed to fetch product', { status: 500 });
  }
}
