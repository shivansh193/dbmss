import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { role } = body;

  try {
    if (role === 'customer') {
      const { name, email, password, contactInfo } = body;
      if (!name || !email || !password) {
        return new NextResponse('Missing fields for customer', { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const created = await prisma.customer.create({
        data: {
          name,
          email,
          password: hashedPassword,
          contactInfo: contactInfo || undefined,
        },
      });
      // Set cookie
      const cookie = `auth_user=${JSON.stringify({ id: created.id, role: 'customer' })}; Path=/; SameSite=Lax;`;
      const response = new NextResponse('Signup successful', { status: 200 });
      response.headers.set('Set-Cookie', cookie);
      return response;
    } else if (role === 'vendor') {
      const { businessName, email, password, contactInfo, storeProfile } = body;
      if (!businessName || !email || !password) {
        return new NextResponse('Missing fields for vendor', { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const created = await prisma.vendor.create({
          data: {
            businessName,
            email,
            password: hashedPassword,
            contactInfo: contactInfo || undefined,
            storeProfile: storeProfile || undefined,
            registrationDate: new Date(),
          },
        });
        // Set cookie
        const cookie = `auth_user=${JSON.stringify({ id: created.id, role: 'vendor' })}; Path=/; SameSite=Lax;`;
        const response = new NextResponse('Signup successful', { status: 200 });
        response.headers.set('Set-Cookie', cookie);
        return response;
      } catch (vendorError: any) {
        // Handle unique constraint error for vendor_id (sequence out of sync)
        if (vendorError?.code === 'P2002' && vendorError?.meta?.target?.includes('vendor_id')) {
          try {
            await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('vendor', 'vendor_id'), (SELECT MAX(vendor_id) FROM vendor) + 1, false)`;
            // Retry vendor creation
            const created = await prisma.vendor.create({
              data: {
                businessName,
                email,
                password: hashedPassword,
                contactInfo: contactInfo || undefined,
                storeProfile: storeProfile || undefined,
                registrationDate: new Date(),
              },
            });
            const cookie = `auth_user=${JSON.stringify({ id: created.id, role: 'vendor' })}; Path=/; SameSite=Lax;`;
            const response = new NextResponse('Signup successful (after sequence fix)', { status: 200 });
            response.headers.set('Set-Cookie', cookie);
            return response;
          } catch (seqError) {
            console.error('Failed to fix vendor_id sequence:', seqError);
            return new NextResponse('Signup failed: could not fix vendor_id sequence', { status: 500 });
          }
        }
        throw vendorError;
      }
    
    } else {
      return new NextResponse('Invalid role', { status: 400 });
    }
  } catch (error: any) {
    // Handle unique constraint error for customer_id (sequence out of sync)
    if (role === 'customer' && error?.code === 'P2002' && error?.meta?.target?.includes('customer_id')) {
      // Try to fix the sequence and retry ONCE
      try {
        // Run a raw SQL command to fix the sequence
        await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('customer', 'customer_id'), (SELECT MAX(customer_id) FROM customer) + 1, false)`;
        // Retry the customer creation
        const hashedPassword = await bcrypt.hash(body.password, 10);
        await prisma.customer.create({
          data: {
            name: body.name,
            email: body.email,
            password: hashedPassword,
            contactInfo: body.contactInfo || undefined,
          },
        });
        return new NextResponse('Signup successful (after sequence fix)', { status: 200 });
      } catch (seqError) {
        console.error('Failed to fix customer_id sequence:', seqError);
        return new NextResponse('Signup failed: could not fix customer_id sequence', { status: 500 });
      }
    }
    console.error('Signup error:', error);
    return new NextResponse('Signup failed: ' + (error?.message || error), { status: 500 });
  }
}
