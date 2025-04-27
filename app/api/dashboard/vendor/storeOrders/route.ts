import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/dashboard/vendor/storeOrders?storeId=ID - Get all orders for a store (vendor only)
export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get('auth_user');
    if (!cookie) return new NextResponse('Not logged in', { status: 401 });
    const { email, role } = JSON.parse(cookie.value);
    if (role !== 'vendor') return new NextResponse('Not a vendor', { status: 403 });
    if (!email) return new NextResponse('Missing vendor email', { status: 400 });
    const vendor = await prisma.vendor.findUnique({ where: { email } });
    if (!vendor) return new NextResponse('Vendor not found', { status: 404 });

    const { searchParams } = new URL(req.url);
    const storeId = Number(searchParams.get('storeId'));
    if (!storeId) return new NextResponse('Missing storeId', { status: 400 });
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store || store.vendorId !== vendor.id) {
      return new NextResponse('Unauthorized: Store does not belong to vendor', { status: 403 });
    }
    // Find all orders that contain products from this store
    const orders = await prisma.order.findMany({
      where: {
        orderDetails: {
          some: {
            product: {
              storeId: storeId
            }
          }
        }
      },
      include: {
        orderDetails: {
          include: {
            product: true
          }
        },
        customer: true
      },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Vendor store orders error:', error);
    return new NextResponse('Failed to fetch orders', { status: 500 });
  }
}
