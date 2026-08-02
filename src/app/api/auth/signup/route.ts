import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, fullName, roleName, franchiseId, phone } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists. Please choose a different username.' },
        { status: 400 }
      );
    }

    // Default to 'Operator' role if not specified
    const selectedRoleName = roleName || 'Operator';
    let role = await prisma.role.findUnique({ where: { name: selectedRoleName } });
    if (!role) {
      role = await prisma.role.create({ data: { name: selectedRoleName } });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user with status 'pending'
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        plainPassword: password,
        roleId: role.id,
        franchiseId: franchiseId ? parseInt(franchiseId) : null,
        status: 'pending',
        accessibleModules: ['*']
      }
    });

    // Create linked staff record if it's a staff role
    const staffRoles = ['Washer', 'Detailer', 'Cleaner', 'Supervisor'];
    if (staffRoles.includes(selectedRoleName)) {
      let finalFranchiseId = franchiseId ? parseInt(franchiseId) : null;
      if (!finalFranchiseId) {
        const firstFranchise = await prisma.franchise.findFirst();
        finalFranchiseId = firstFranchise?.id || null;
      }

      if (finalFranchiseId) {
        const staff = await prisma.staff.create({
          data: {
            name: fullName || username,
            phone: phone || null,
            role: selectedRoleName,
            franchiseId: finalFranchiseId,
          }
        });

        await prisma.user.update({
          where: { id: user.id },
          data: { staffId: staff.id }
        });
      }
    }

    return NextResponse.json({
      message: 'Signup request submitted successfully! Your account is pending Super Admin approval.',
      id: user.id,
      username: user.username
    });
  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
