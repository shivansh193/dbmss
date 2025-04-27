import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/dashboard/vendor/stores - Create a new store for the logged-in vendor
export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get('auth_user');
    if (!cookie) return new NextResponse('Not logged in', { status: 401 });
    const { email, role } = JSON.parse(cookie.value);
    if (role !== 'vendor') return new NextResponse('Not a vendor', { status: 403 });
    if (!email) return new NextResponse('Missing vendor email', { status: 400 });
    const vendor = await prisma.vendor.findUnique({ where: { email } });
    if (!vendor) return new NextResponse('Vendor not found', { status: 404 });

    const body = await req.json();
    const {
      name,
      description,
      bannerUrl,
      logoUrl,
      addressLine1,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
      operatingRadius = 25000
    } = body;

    if (!name || !addressLine1 || !city || !state || !postalCode || !country || latitude === undefined || longitude === undefined) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Save latitude and longitude directly (Prisma does not support PostGIS geography)
    const createdStore = await prisma.store.create({
      data: {
        vendorId: vendor.id,
        name,
        description,
        bannerUrl,
        logoUrl,
        addressLine1,
        city,
        state,
        postalCode,
        country,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        operatingRadius: Number(operatingRadius) || 25000,
      },
    });
    return NextResponse.json({ store: createdStore });
  } catch (error: any) {
    console.error('Vendor store creation error:', error);
    return new NextResponse('Failed to create store', { status: 500 });
  }
}
// GET /api/dashboard/vendor/stores - Get all stores for the logged-in vendor
export async function GET(req: NextRequest) {
  try {
    // Get vendorId from session/cookie/JWT
    const cookie = req.cookies.get('auth_user');
    if (!cookie) return new NextResponse('Not logged in', { status: 401 });
    const { email, role } = JSON.parse(cookie.value);
    if (role !== 'vendor') return new NextResponse('Not a vendor', { status: 403 });
    if (!email) {
      console.error('Missing vendor email in cookie:', cookie.value);
      return new NextResponse('Missing vendor email', { status: 400 });
    }
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
