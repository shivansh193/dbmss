import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password, role } = await req.json();
  if (!email || !password || !role) {
    return new NextResponse('Missing fields', { status: 400 });
  }
  try {
    let user = null;
    if (role === 'customer') {
      user = await prisma.customer.findUnique({ where: { email } });
    } else if (role === 'vendor') {
      user = await prisma.vendor.findUnique({ where: { email } });
    }
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }
    if (!user.password || typeof user.password !== 'string') {
      return new NextResponse('Invalid credentials: password not set', { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }
    // Set a cookie with user id, email, and role (simple demo, not secure for production)
    const cookie = `auth_user=${JSON.stringify({ id: user.id, email: user.email, role })}; Path=/; SameSite=Lax;`;
    const response = new NextResponse('Login successful', { status: 200 });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (error: any) {
    // Handle unique constraint error for customer_id or vendor_id (sequence out of sync)
    if (role === 'customer' && error?.code === 'P2002' && error?.meta?.target?.includes('customer_id')) {
      try {
        await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('customer', 'customer_id'), (SELECT MAX(customer_id) FROM customer) + 1, false)`;
        // Retry login
        const user = await prisma.customer.findUnique({ where: { email } });
        if (!user) return new NextResponse('User not found', { status: 404 });
        if (!user.password || typeof user.password !== 'string') {
          return new NextResponse('Invalid credentials: password not set', { status: 401 });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return new NextResponse('Invalid credentials', { status: 401 });
        return new NextResponse('Login successful (after sequence fix)', { status: 200 });
      } catch (seqError) {
        console.error('Failed to fix customer_id sequence during login:', seqError);
        return new NextResponse('Login failed: could not fix customer_id sequence', { status: 500 });
      }
    }
    if (role === 'vendor' && error?.code === 'P2002' && error?.meta?.target?.includes('vendor_id')) {
      try {
        await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('vendor', 'vendor_id'), (SELECT MAX(vendor_id) FROM vendor) + 1, false)`;
        // Retry login
        const user = await prisma.vendor.findUnique({ where: { email } });
        if (!user) return new NextResponse('User not found', { status: 404 });
        if (!user.password || typeof user.password !== 'string') {
          return new NextResponse('Invalid credentials: password not set', { status: 401 });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return new NextResponse('Invalid credentials', { status: 401 });
        return new NextResponse('Login successful (after sequence fix)', { status: 200 });
      } catch (seqError) {
        console.error('Failed to fix vendor_id sequence during login:', seqError);
        return new NextResponse('Login failed: could not fix vendor_id sequence', { status: 500 });
      }
    }
    console.error('Login error:', error);
    return new NextResponse(error.message || 'Login failed', { status: 500 });
  }
}
