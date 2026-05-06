import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.franchiseStock.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Stock item removed from monitoring' });
  } catch (error: any) {
    console.error('Error deleting stock:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
