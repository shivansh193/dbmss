import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/dashboard/vendor/stores - Get all stores for the logged-in vendor
export async function GET(req: NextRequest) {
  try {
    // Get vendorId from session/cookie/JWT
    const cookie = req.cookies.get('auth_user');
    if (!cookie) return new NextResponse('Not logged in', { status: 401 });
    const { email, role } = JSON.parse(cookie.value);
    if (role !== 'vendor') return new NextResponse('Not a vendor', { status: 403 });
    // Find the vendor by email
    const vendor = await prisma.vendor.findUnique({ where: { email } });
    if (!vendor) return new NextResponse('Vendor not found', { status: 404 });
    const stores = await prisma.store.findMany({
      where: { vendorId: vendor.id },
      include: { products: true },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ stores });
  } catch (error: any) {
    console.error('Vendor stores error:', error);
    return new NextResponse('Failed to fetch stores', { status: 500 });
  }
}
