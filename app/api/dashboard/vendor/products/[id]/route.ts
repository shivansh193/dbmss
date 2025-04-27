import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/dashboard/vendor/products/[id] - Update a product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number(params.id);
    const body = await req.json();
    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        price: body.price,
        stock: body.stock,
        imageUrl: body.imageUrl,
      },
    });
    return NextResponse.json({ product: updated });
  } catch (error: any) {
    console.error('Product update error:', error);
    return new NextResponse('Failed to update product', { status: 500 });
  }
}

// DELETE /api/dashboard/vendor/products/[id] - Delete a product
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number(params.id);
    await prisma.product.delete({ where: { id: productId } });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Product delete error:', error);
    return new NextResponse('Failed to delete product', { status: 500 });
  }
}
