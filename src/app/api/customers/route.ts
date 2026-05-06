import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        franchise: true,
        uploader: true
      },
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json(customers);
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, carRegistration, carModel, franchiseId, uploadedBy, notes } = body;

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        carRegistration,
        carModel,
        franchiseId: parseInt(franchiseId),
        uploadedBy: parseInt(uploadedBy),
        notes,
        status: 'pending'
      }
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
