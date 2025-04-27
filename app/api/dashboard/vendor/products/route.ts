import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/dashboard/vendor/products - Add a new product to a store
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
    const { storeId, name, description, category, price, stock, imageUrl } = body;
    if (!storeId || !name || price === undefined || stock === undefined) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    // Check store belongs to vendor
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store || store.vendorId !== vendor.id) {
      return new NextResponse('Unauthorized: Store does not belong to vendor', { status: 403 });
    }
    try {
      const createdProduct = await prisma.product.create({
        data: {
          storeId,
          name,
          description,
          category,
          price,
          stock,
          imageUrl,
        },
      });
      return NextResponse.json({ product: createdProduct });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return new NextResponse('A product with this name already exists for this store.', { status: 409 });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Vendor product creation error:', error);
    return new NextResponse('Failed to create product', { status: 500 });
  }
}
