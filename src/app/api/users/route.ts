import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
        franchise: true
      },
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, roleName, franchiseId, accessibleModules } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // Get role ID or create if not exists
    let role = await prisma.role.findUnique({ where: { name: roleName || 'Operator' } });
    if (!role) {
      role = await prisma.role.create({ data: { name: roleName || 'Operator' } });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        roleId: role.id,
        franchiseId: franchiseId ? parseInt(franchiseId) : null,
        status: 'active',
        accessibleModules: accessibleModules || ['*']
      }
    });

    return NextResponse.json({ id: user.id, username: user.username, accessibleModules: user.accessibleModules });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
