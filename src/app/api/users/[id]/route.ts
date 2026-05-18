import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
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
    
    // If password is provided, hash it and store the plain password
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.passwordHash = await bcrypt.hash(body.password, salt);
      body.plainPassword = body.password;
      delete body.password;
    }

    // If roleName is provided, convert to roleId
    if (body.roleName) {
      const role = await prisma.role.findUnique({ where: { name: body.roleName } });
      if (role) {
        body.roleId = role.id;
        delete body.roleName;
      }
    }

    // If franchiseId is present in request body, ensure it is an integer or null
    if ('franchiseId' in body) {
      body.franchiseId = body.franchiseId ? parseInt(body.franchiseId) : null;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: body
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
