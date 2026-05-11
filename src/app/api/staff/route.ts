import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        franchise: true,
        attendances: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        },
        jobsDone: true
      },
      orderBy: { created_at: 'desc' }
    });

    const staffWithStats = staff.map(s => {
      const completedJobs = s.jobsDone.filter(j => j.status === 'completed');
      const totalWorth = completedJobs.reduce((sum, j) => sum + (j.finalTotal || 0), 0);
      return {
        ...s,
        jobsDoneCount: completedJobs.length,
        totalWorth
      };
    });

    return NextResponse.json(staffWithStats);
  } catch (error: any) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, role, franchiseId } = body;

    let targetFranchiseId = parseInt(franchiseId);
    if (isNaN(targetFranchiseId)) {
      const firstFranchise = await prisma.franchise.findFirst();
      if (!firstFranchise) {
         return NextResponse.json({ error: 'No franchise found to assign staff' }, { status: 400 });
      }
      targetFranchiseId = firstFranchise.id;
    }

    const staff = await prisma.staff.create({
      data: {
        name,
        phone,
        role: role || 'Washer',
        franchiseId: targetFranchiseId,
        status: 'active'
      }
    });

    return NextResponse.json(staff);
  } catch (error: any) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
