import { logout } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function POST() {
    await logout();
    return NextResponse.json({ success: true });
}
