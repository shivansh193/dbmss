import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // TODO: Get vendorId from session/cookie/JWT
    // For now, fetch all ordered products for all vendors
    const orders = await prisma.orderDetail.findMany({
      include: {
        product: true,
        order: { include: { customer: true } },
      },
      orderBy: { orderId: 'desc' },
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Vendor dashboard error:', error);
    return new NextResponse('Failed to fetch ordered products', { status: 500 });
  }
}
