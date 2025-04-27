import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/cart - Add or update cart item for the logged-in customer
export async function POST(req: NextRequest) {
  try {
    const { customerId, productId, quantity } = await req.json();
    
    if (!customerId || !productId || quantity === undefined) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    
    console.log('Cart POST: customerId =', customerId, 'productId =', productId, 'quantity =', quantity);
    
    // Use a transaction to handle cart creation and item updates
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Find existing cart
      let cart = await tx.cart.findFirst({
        where: { customerId: Number(customerId) }
      });
      
      // Step 2: If no cart exists, find the max cart_id and create a new one
      if (!cart) {
        // Get maximum cart_id from the database
        const maxIdResult = await tx.$queryRaw`SELECT MAX("cart_id") as "maxId" FROM "public"."cart"`;
        const maxId = maxIdResult[0]?.maxId || 0;
        const newId = Number(maxId) + 1;
        
        // Create cart with explicit ID
        cart = await tx.cart.create({
          data: {
            id: newId,
            customerId: Number(customerId)
          }
        });
        console.log('Created new cart with ID:', newId);
      }
      
      // Step 3: Handle the cart item
      // Check if item exists
      const existingItem = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: Number(productId)
        }
      });
      
      if (existingItem) {
        // Update existing item
        return await tx.cartItem.update({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId: Number(productId)
            }
          },
          data: { quantity: Number(quantity) }
        });
      } else {
        // Create new item
        return await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId: Number(productId),
            quantity: Number(quantity)
          }
        });
      }
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('POST /api/cart error:', error);
    return new NextResponse(`Server error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}

// GET /api/cart?customerId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    
    if (!customerId) {
      return new NextResponse('Missing customerId', { status: 400 });
    }
    
    // Use findFirst instead of findUnique
    const cart = await prisma.cart.findFirst({
      where: { customerId: Number(customerId) },
      include: {
        cartItems: {
          include: { product: true }
        }
      }
    });
    
    return NextResponse.json(cart || { cartItems: [] });
  } catch (error) {
    console.error('GET /api/cart error:', error);
    return new NextResponse(`Failed to fetch cart: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const { customerId, productId } = await req.json();
    
    if (!customerId || !productId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    
    // First find the cart using findFirst
    const cart = await prisma.cart.findFirst({
      where: { customerId: Number(customerId) }
    });
    
    if (!cart) {
      return new NextResponse('Cart not found', { status: 404 });
    }
    
    try {
      // Delete the cart item
      await prisma.cartItem.delete({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: Number(productId)
          }
        }
      });
      
      return new NextResponse('Item removed', { status: 200 });
    } catch (deleteErr) {
      // Handle case where item might not exist
      console.error('Delete operation failed:', deleteErr);
      if (deleteErr.code === 'P2025') {
        return new NextResponse('Item not found in cart', { status: 404 });
      }
      return new NextResponse(`Failed to delete item: ${deleteErr.message}`, { status: 500 });
    }
  } catch (error) {
    console.error('DELETE /api/cart error:', error);
    return new NextResponse(`Server error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}