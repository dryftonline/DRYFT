import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.staff.delete({
      where: { id }
    });
    return NextResponse.json({ message: 'Staff deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting staff:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, phone, role, franchiseId, status } = body;

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        name,
        phone,
        role,
        franchiseId: franchiseId ? parseInt(franchiseId) : undefined,
        status
      }
    });

    return NextResponse.json(staff);
  } catch (error: any) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
