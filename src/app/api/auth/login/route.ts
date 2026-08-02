import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, password, selectedFranchiseId } = await request.json();

    const user = await prisma.user.findUnique({
      where: { username },
      include: { role: true, franchise: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status === 'pending') {
      return NextResponse.json({ error: 'Your account is pending Super Admin approval.' }, { status: 403 });
    }

    if (user.status === 'rejected') {
      return NextResponse.json({ error: 'Your registration request was rejected by Super Admin.' }, { status: 403 });
    }

    if (user.status !== 'active') {
      return NextResponse.json({ error: 'Account is disabled' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    let activeFranchiseId = user.franchiseId;
    let activeFranchiseName = user.franchise ? user.franchise.name : null;

    if (selectedFranchiseId) {
      const customFranchise = await prisma.franchise.findUnique({
        where: { id: parseInt(selectedFranchiseId) }
      });
      if (customFranchise) {
        activeFranchiseId = customFranchise.id;
        activeFranchiseName = customFranchise.name;
      }
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role.name, 
        franchiseId: activeFranchiseId,
        staffId: user.staffId,
        accessibleModules: user.accessibleModules 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role.name,
        franchise: activeFranchiseName,
        franchiseId: activeFranchiseId,
        assignedFranchiseId: user.franchiseId,
        assignedFranchiseName: user.franchise ? user.franchise.name : null,
        staffId: user.staffId,
        plainPassword: user.plainPassword,
        accessibleModules: user.accessibleModules
      }
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    // Log specific details if available
    if (error.code) console.error('Error Code:', error.code);
    if (error.message) console.error('Error Message:', error.message);
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message }, 
      { status: 500 }
    );
  }
}
