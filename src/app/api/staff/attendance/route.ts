import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { staffId, photoData, latitude, longitude, overrideStatus, notes } = body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Auto calculate status if not overridden by admin
    let status = overrideStatus;
    if (!status) {
      const currentHour = new Date().getHours();
      if (currentHour < 9) {
        status = 'present'; // Before 9 AM
      } else if (currentHour < 12) {
        status = 'late'; // Between 9 AM and 12 PM
      } else {
        status = 'half-day'; // After 12 PM
      }
    }

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
        data: { 
          status, 
          notes,
          ...(photoData && { photoData }),
          ...(latitude && { latitude }),
          ...(longitude && { longitude })
        }
      });
    } else {
      attendance = await prisma.staffAttendance.create({
        data: {
          staffId: parseInt(staffId),
          status,
          notes,
          photoData,
          latitude,
          longitude
        }
      });
    }

    return NextResponse.json(attendance);
  } catch (error: any) {
    console.error('Error marking attendance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
