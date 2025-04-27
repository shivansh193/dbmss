import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/dashboard/vendor/storeOrders?storeId=123 - Get all orders for a specific store
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const storeId = Number(searchParams.get('storeId'));
    if (!storeId) return new NextResponse('Missing storeId', { status: 400 });
    // Get vendor from session/cookie/JWT
    const cookie = req.cookies.get('auth_user');
    if (!cookie) return new NextResponse('Not logged in', { status: 401 });
    const { email, role } = JSON.parse(cookie.value);
    if (role !== 'vendor') return new NextResponse('Not a vendor', { status: 403 });
    // Find the vendor by email
    const vendor = await prisma.vendor.findUnique({ where: { email } });
    if (!vendor) return new NextResponse('Vendor not found', { status: 404 });
    // Ensure the store belongs to the vendor
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store || store.vendorId !== vendor.id) return new NextResponse('Unauthorized', { status: 403 });
    // Fetch orders for this store
    const orders = await prisma.orderDetail.findMany({
      where: { product: { storeId } },
      include: {
        product: true,
        order: { include: { customer: true } },
      },
      orderBy: { orderId: 'desc' },
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Vendor store orders error:', error);
    return new NextResponse('Failed to fetch store orders', { status: 500 });
  }
}
