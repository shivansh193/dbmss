import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/order - Place an order for the logged-in customer
export async function POST(req: NextRequest) {
  const { customerId, items, total } = await req.json();
  if (!customerId || !items || !Array.isArray(items) || !total) {
    return new NextResponse('Missing fields', { status: 400 });
  }
  try {
    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: Number(customerId),
        totalAmount: total,
        orderDetails: {
          create: items.map((item: any) => ({
            productId: Number(item.id),
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        },
      },
    });
    // Optionally: clear cart for customer
    const cart = await prisma.cart.findFirst({ where: { customerId: Number(customerId) } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return NextResponse.json(order);
  } catch (error) {
    return new NextResponse('Order failed', { status: 500 });
  }
}
