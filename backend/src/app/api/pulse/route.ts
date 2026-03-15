import { db } from '@/lib/db';
import { pulses, users, monitors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { api_key, device } = body;

        if (!api_key) {
            return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
        }

        // Find the user by API key
        const user = await db.query.users.findFirst({
            where: eq(users.apiKey, api_key),
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
        }

        // Record the pulse
        await db.insert(pulses).values({
            userId: user.id,
            deviceName: device?.name || 'Unknown',
            deviceOs: device?.os || 'Unknown',
            timestamp: new Date(),
        });

        // Update the monitor's last pulse timestamp
        await db.update(monitors)
            .set({ lastPulseAt: new Date() })
            .where(eq(monitors.userId, user.id));

        return NextResponse.json({ message: 'Pulse received' });
    } catch (error: any) {
        console.error('Pulse error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
