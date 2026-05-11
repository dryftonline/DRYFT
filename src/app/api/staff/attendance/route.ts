import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { staffId, status, notes } = body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if an attendance record already exists for today
    const existing = await prisma.staffAttendance.findFirst({
      where: {
        staffId: parseInt(staffId),
        date: {
          gte: today
        }
      }
    });

    let attendance;
    if (existing) {
      attendance = await prisma.staffAttendance.update({
        where: { id: existing.id },
        data: { status, notes }
      });
    } else {
      attendance = await prisma.staffAttendance.create({
        data: {
          staffId: parseInt(staffId),
          status,
          notes
        }
      });
    }

    return NextResponse.json(attendance);
  } catch (error: any) {
    console.error('Error marking attendance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
