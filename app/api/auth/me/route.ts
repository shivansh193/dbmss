import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  // Use a simple cookie for demo. In production, use HttpOnly, JWT, etc.
  const cookie = req.cookies.get('auth_user');
  if (!cookie) return NextResponse.json(null, { status: 200 });
  const { id, role } = JSON.parse(cookie.value);
  let user = null;
  if (role === 'customer') {
    user = await prisma.customer.findUnique({ where: { id } });
  } else if (role === 'vendor') {
    user = await prisma.vendor.findUnique({ where: { id } });
  }
  if (!user) return NextResponse.json(null, { status: 200 });
  // Only return safe fields
  let name = '';
  if (role === 'customer') {
    name = (user as any).name;
  } else if (role === 'vendor') {
    name = (user as any).businessName;
  }
  return NextResponse.json({ id: user.id, name, email: user.email, role });
}
