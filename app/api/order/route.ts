import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/order - Place an order for the logged-in customer
export async function POST(req: NextRequest) {
  try {
    const { customerId, items, total } = await req.json();
    if (!customerId || !items || !Array.isArray(items) || total === undefined) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    if (items.length === 0) {
      return new NextResponse('Order must contain at least one item', { status: 400 });
    }
    // Defensive type safety
    const safeCustomerId = Number(customerId);
    const safeTotal = Number(total);
    if (isNaN(safeCustomerId) || isNaN(safeTotal)) {
      return new NextResponse('Invalid customerId or total', { status: 400 });
    }
    // Create order in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          customerId: safeCustomerId,
          totalAmount: safeTotal,
          orderDetails: {
            create: items.map((item: any) => ({
              productId: Number(item.id),
              quantity: Number(item.quantity),
              unitPrice: Number(item.price),
            })),
          },
        },
      });
      // Clear cart for customer: delete cart items and the cart itself
      const cart = await tx.cart.findFirst({ where: { customerId: safeCustomerId } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        await tx.cart.delete({ where: { id: cart.id } });
      }
      return order;
    });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('POST /api/order error:', error);
    return new NextResponse(`Order failed: ${error?.message || 'Unknown error'}`, { status: 500 });
  }
}

