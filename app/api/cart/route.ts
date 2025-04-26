import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/cart - Add or update cart item for the logged-in customer
export async function POST(req: NextRequest) {
  const { customerId, productId, quantity } = await req.json();
  if (!customerId || !productId || !quantity) {
    return new NextResponse('Missing fields', { status: 400 });
  }
  try {
    // Find or create cart for this customer
    let cart = await prisma.cart.findFirst({ where: { customerId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { customerId } });
    }
    // Upsert cart item
    const cartItem = await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity },
      create: { cartId: cart.id, productId, quantity },
    });
    return NextResponse.json(cartItem);
  } catch (error) {
    return new NextResponse('Failed to update cart', { status: 500 });
  }
}

// GET /api/cart?customerId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get('customerId');
  if (!customerId) return new NextResponse('Missing customerId', { status: 400 });
  try {
    const cart = await prisma.cart.findFirst({
      where: { customerId: Number(customerId) },
      include: {
        cartItems: {
          include: { product: true }
        }
      }
    });
    return NextResponse.json(cart);
  } catch (error) {
    return new NextResponse('Failed to fetch cart', { status: 500 });
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(req: NextRequest) {
  const { customerId, productId } = await req.json();
  if (!customerId || !productId) return new NextResponse('Missing fields', { status: 400 });
  try {
    let cart = await prisma.cart.findFirst({ where: { customerId } });
    if (!cart) return new NextResponse('Cart not found', { status: 404 });
    await prisma.cartItem.delete({ where: { cartId_productId: { cartId: cart.id, productId } } });
    return new NextResponse('Removed', { status: 200 });
  } catch (error) {
    return new NextResponse('Failed to remove', { status: 500 });
  }
}
