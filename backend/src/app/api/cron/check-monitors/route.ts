import { db } from '@/lib/db';
import { monitors, users } from '@/lib/db/schema';
import { and, eq, lte, sql, isNull, or } from 'drizzle-orm';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function GET(req: NextRequest) {
    // Simple auth for cron - skip for local dev or use a secret header
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Find monitors that are overdue
        // Overdue if Now > lastPulseAt + thresholdHours
        const overdueMonitors = await db.select({
            id: monitors.id,
            trustedEmail: monitors.trustedEmail,
            emergencyMessage: monitors.emergencyMessage,
            userId: monitors.userId,
            userEmail: users.email,
        })
            .from(monitors)
            .innerJoin(users, eq(monitors.userId, users.id))
            .where(
                and(
                    eq(monitors.isActive, true),
                    // Filter those where lastPulseAt + thresholdHours < Now
                    sql`${monitors.lastPulseAt} + (${monitors.thresholdHours} || ' hours')::interval < NOW()`,
                    // Avoid re-sending alerts if we sent one in the last 24 hours
                    or(
                        isNull(monitors.lastAlertSentAt),
                        sql`${monitors.lastAlertSentAt} + interval '24 hours' < NOW()`
                    )
                )
            );

        const results = [];

        for (const monitor of overdueMonitors) {
            try {
                await resend.emails.send({
                    from: 'GuardianSwitch <alerts@resend.dev>', // Should use a verified domain in production
                    to: monitor.trustedEmail,
                    subject: 'EMERGENCY: GuardianSwitch Alert',
                    text: `
            This is an automated emergency message from GuardianSwitch.
            
            The user (${monitor.userEmail}) has not checked in for over their threshold period.
            
            Emergency message from user:
            "${monitor.emergencyMessage || 'No specific message provided.'}"
            
            Please check on them immediately.
          `.trim(),
                });

                // Update the monitor
                await db.update(monitors)
                    .set({ lastAlertSentAt: new Date() })
                    .where(eq(monitors.id, monitor.id));

                results.push({ id: monitor.id, status: 'sent' });
            } catch (emailError) {
                console.error(`Failed to send email for monitor ${monitor.id}:`, emailError);
                results.push({ id: monitor.id, status: 'error', error: String(emailError) });
            }
        }

        return NextResponse.json({
            processed: overdueMonitors.length,
            results
        });

    } catch (error) {
        console.error('Cron error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
