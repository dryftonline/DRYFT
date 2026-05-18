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
    
    // Check if user is linked to a staff record
    const currentUser = await prisma.user.findUnique({ where: { id } });
    const isStaff = currentUser && currentUser.staffId;
    
    // If password is provided, hash it and store the plain password
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.passwordHash = await bcrypt.hash(body.password, salt);
      body.plainPassword = body.password;
      delete body.password;
    }

    // If roleName is provided, convert to roleId and update staff role if applicable
    if (body.roleName) {
      const role = await prisma.role.findUnique({ where: { name: body.roleName } });
      if (role) {
        body.roleId = role.id;
        if (isStaff) {
          await prisma.staff.update({
            where: { id: currentUser.staffId! },
            data: { role: body.roleName }
          });
        }
        delete body.roleName;
      }
    }

    // If franchiseId is present in request body, ensure it is an integer or null, and update staff franchise if applicable
    if ('franchiseId' in body) {
      body.franchiseId = body.franchiseId ? parseInt(body.franchiseId) : null;
      if (isStaff && body.franchiseId) {
        await prisma.staff.update({
          where: { id: currentUser.staffId! },
          data: { franchiseId: body.franchiseId }
        });
      }
    }

    // If fullName or phone is provided, update the linked Staff record
    if (isStaff && (body.fullName || 'phone' in body)) {
      await prisma.staff.update({
        where: { id: currentUser.staffId! },
        data: {
          ...(body.fullName && { name: body.fullName }),
          ...('phone' in body && { phone: body.phone })
        }
      });
    }

    // Remove fullName and phone from user update body so Prisma doesn't throw a validation error
    delete body.fullName;
    delete body.phone;

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
