import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const franchiseName = searchParams.get('franchise');

    let where = {};
    if (franchiseName) {
      where = { franchise: { name: franchiseName } };
    }

    const stock = await prisma.franchiseStock.findMany({
      where,
      include: {
        franchise: true,
        stockItem: true
      },
      orderBy: { updated_at: 'desc' }
    });

    return NextResponse.json(stock);
  } catch (error: any) {
    console.error('Error fetching stock:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // This is in a separate file usually, but I'll define it here for context if needed
  // But I'll create the [id] route next.
}
