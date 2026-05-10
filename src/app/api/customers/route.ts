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
    const { 
      name, phone, carRegistration, carModel, franchiseId, uploadedBy, notes,
      kot, service, vehicleType, addon, addonAmount, discountType, 
      discount, discountNote, finalTotal, paymentMethod, status
    } = body;

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        carRegistration,
        carModel,
        franchiseId: parseInt(franchiseId) || 1, // Fallback to 1 for demo purposes
        uploadedBy: parseInt(uploadedBy) || 1,   // Fallback to 1 for demo purposes
        notes,
        status: status || 'ongoing',
        kot,
        service,
        vehicleType,
        addon,
        addonAmount: addonAmount ? parseFloat(addonAmount) : null,
        discountType,
        discount: discount ? parseFloat(discount) : null,
        discountNote,
        finalTotal: finalTotal ? parseFloat(finalTotal) : null,
        paymentMethod
      }
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
