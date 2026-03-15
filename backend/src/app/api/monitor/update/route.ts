import { db } from "@/lib/db";
import { monitors } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { trusted_email, emergency_message, threshold_hours } = await request.json();

        // Basic validation
        if (!trusted_email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const hours = parseInt(threshold_hours);
        if (isNaN(hours) || hours < 1) {
            return NextResponse.json({ error: "Invalid interval" }, { status: 400 });
        }

        // Update the monitor
        await db.update(monitors)
            .set({
                trustedEmail: trusted_email,
                emergencyMessage: emergency_message,
                thresholdHours: hours,
            })
            .where(eq(monitors.userId, session.id));

        return NextResponse.json({ success: true, message: "Settings updated successfully" });

    } catch (error: any) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
