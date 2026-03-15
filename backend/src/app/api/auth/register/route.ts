import { db } from "@/lib/db";
import { users, monitors } from "@/lib/db/schema";
import { login } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const [newUser] = await db.insert(users).values({
            email,
            passwordHash,
        }).returning();

        // Create default monitor for the user
        await db.insert(monitors).values({
            userId: newUser.id,
            trustedEmail: "", // User will set this later
            emergencyMessage: "Check on me, I have not checked in on my Dead Man Switch.",
            thresholdHours: 24,
            isActive: true,
        });

        // Log the user in
        await login(newUser);

        return NextResponse.json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                apiKey: newUser.apiKey
            }
        });

    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error during registration", details: error.message },
            { status: 500 }
        );
    }
}
