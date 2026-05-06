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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, roleName, franchiseId } = body;

    // Get role ID
    const role = await prisma.role.findUnique({ where: { name: roleName || 'Operator' } });
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        username,
        // In a real app, hash the password! For this demo we'll use a placeholder or plain (not recommended for production)
        passwordHash: password, // TODO: bcrypt hash
        email: email || `${username}@dryft.com`,
        roleId: role.id,
        franchiseId: franchiseId ? parseInt(franchiseId) : null,
        status: 'active'
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
