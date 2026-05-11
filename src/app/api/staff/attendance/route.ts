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
    let minutesLate = 0;
    let fineAmount = 0;
    const FINE_PER_MINUTE = 5; // ₹5 fine per minute late

    if (!status) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const timeInMinutes = currentHour * 60 + currentMinute;
      const nineAMInMinutes = 9 * 60; // 540 minutes
      const twelvePMInMinutes = 12 * 60; // 720 minutes

      if (timeInMinutes <= nineAMInMinutes) {
        status = 'present'; 
      } else if (timeInMinutes < twelvePMInMinutes) {
        status = 'late';
        minutesLate = timeInMinutes - nineAMInMinutes;
        fineAmount = minutesLate * FINE_PER_MINUTE;
      } else {
        status = 'half-day'; 
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
          ...(longitude && { longitude }),
          minutesLate,
          fineAmount
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
          longitude,
          minutesLate,
          fineAmount
        }
      });
    }

    return NextResponse.json(attendance);
  } catch (error: any) {
    console.error('Error marking attendance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
