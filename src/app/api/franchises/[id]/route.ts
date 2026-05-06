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

    await prisma.franchise.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Franchise deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting franchise:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const updatedFranchise = await prisma.franchise.update({
      where: { id },
      data: body
    });

    return NextResponse.json(updatedFranchise);
  } catch (error: any) {
    console.error('Error updating franchise:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
