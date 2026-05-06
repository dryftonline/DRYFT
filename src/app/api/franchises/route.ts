import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const franchises = await prisma.franchise.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json(franchises);
  } catch (error: any) {
    console.error('Error fetching franchises:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, ownerName, phoneNumber, email, location } = body;

    const franchise = await prisma.franchise.create({
      data: {
        name,
        ownerName,
        phoneNumber,
        email,
        location,
        status: 'active'
      }
    });

    return NextResponse.json(franchise);
  } catch (error: any) {
    console.error('Error creating franchise:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
