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

    // Fetch the first available user and franchise to use as fallbacks
    let fallbackFranchise = await prisma.franchise.findFirst();
    if (!fallbackFranchise) {
      fallbackFranchise = await prisma.franchise.create({
        data: {
          name: 'Main Branch',
          ownerName: 'Admin',
          phoneNumber: '0000000000',
          email: 'admin@dryft.com',
          location: 'HQ'
        }
      });
    }

    let fallbackUser = await prisma.user.findFirst();
    if (!fallbackUser) {
      let role = await prisma.role.findFirst();
      if (!role) {
        role = await prisma.role.create({ data: { name: 'Admin' } });
      }
      fallbackUser = await prisma.user.create({
        data: {
          username: 'admin',
          passwordHash: 'placeholder',
          roleId: role.id,
          franchiseId: fallbackFranchise.id
        }
      });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        carRegistration,
        carModel,
        franchiseId: parseInt(franchiseId) || fallbackFranchise.id,
        uploadedBy: parseInt(uploadedBy) || fallbackUser.id,
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
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
