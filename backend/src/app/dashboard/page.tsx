import { db } from '@/lib/db';
import { monitors, pulses, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, Button, Badge, cn } from '@/components/ui/core';
import { Shield, Clock, Mail, History, Terminal, AlertTriangle, Cpu, LogOut } from 'lucide-react';
import { getSession, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ApiKeyCard, MonitorSettingsForm, InstructionPanel } from '@/components/dashboard-client';

export const dynamic = "force-dynamic";

async function getDashboardData(userId: string) {
    const monitor = await db.query.monitors.findFirst({
        where: eq(monitors.userId, userId),
    });

    const recentPulses = await db.query.pulses.findMany({
        where: eq(pulses.userId, userId),
        limit: 8,
        orderBy: [desc(pulses.timestamp)],
    });

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    return { monitor, recentPulses, user };
}

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const userId = session.id;

    let data;
    try {
        data = await getDashboardData(userId);
    } catch (e) {
        data = { monitor: null, recentPulses: [], user: null };
    }

    const { monitor, recentPulses, user } = data;
    const isHealthy = monitor?.lastPulseAt &&
        (new Date().getTime() - new Date(monitor.lastPulseAt).getTime()) < (monitor.thresholdHours || 24) * 3600000;

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 font-sans selection:bg-primary/30">
            <div className="mx-auto max-w-6xl">
                <header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Cpu className="w-5 h-5 text-primary" />
                            <span className="text-xs font-mono font-bold tracking-widest uppercase text-primary">System Auth Active</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tighter text-foreground font-mono glow-text">
                            GUARDIAN_DASHBOARD
                        </h1>
                        <p className="text-foreground/60 text-sm">Authenticated as: <span className="text-primary font-mono">{user?.email || "UNKNOWN"}</span></p>
                    </div>
                    <div className="flex gap-3">
                        <form action={async () => {
                            'use server';
                            await logout();
                            redirect('/login');
                        }}>
                            <Button type="submit" variant="outline" className="font-mono gap-2">
                                <LogOut className="w-4 h-4" /> SIGN_EXTRACT
                            </Button>
                        </form>
                        <Button variant="secondary" className="font-mono">SETTINGS</Button>
                    </div>
                </header>

                {/* API Key Banner */}
                <ApiKeyCard apiKey={user?.apiKey || ""} />

                <div className="grid gap-6 md:grid-cols-12">
                    {/* Status Card */}
                    <Card className="md:col-span-8 flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Shield className="w-32 h-32" />
                        </div>

                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <h3 className="text-xl font-bold font-mono flex items-center gap-3">
                                    <Shield className={cn("w-6 h-6", isHealthy ? "text-cta" : "text-amber-500")} />
                                    SYSTEM_STATUS
                                </h3>
                                <p className="mt-2 text-foreground/70 max-w-md text-sm leading-relaxed">
                                    {isHealthy
                                        ? "Sentinel check-in successful. No anomalies detected in current cycle."
                                        : "CRITICAL: Response timeout exceeded. Sentinel failed to report."}
                                </p>
                            </div>
                            <Badge status={isHealthy ? 'active' : 'overdue'}>
                                {isHealthy ? "STATUS_OK" : "TIMEOUT_ERR"}
                            </Badge>
                        </div>

                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-foreground/10 pt-8 relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 font-mono">LATEST_PULSE_RECEIVED</p>
                                <p className="text-lg font-mono font-medium tracking-tight">
                                    {monitor?.lastPulseAt ? new Date(monitor.lastPulseAt).toLocaleString() : "NULL_PTR"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 font-mono">NEXT_AUTO_ALERT_WINDOW</p>
                                <p className={cn("text-lg font-mono font-medium tracking-tight", !isHealthy && "text-amber-500")}>
                                    {monitor?.lastPulseAt
                                        ? new Date(new Date(monitor.lastPulseAt).getTime() + (monitor.thresholdHours || 24) * 3600000).toLocaleString()
                                        : "PENDING"}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Configuration Summary - Now a Form */}
                    <div className="md:col-span-4 rounded-3xl overflow-hidden">
                        <MonitorSettingsForm initialData={monitor} />
                    </div>

                    {/* Deployment Guide */}
                    <InstructionPanel apiKey={user?.apiKey || ""} />

                    {/* Activity Log */}
                    <Card className="md:col-span-12">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold font-mono flex items-center gap-3">
                                <History className="w-5 h-5 text-primary" />
                                PULSE_HISTORY
                            </h3>
                            <div className="h-px flex-1 mx-6 bg-foreground/10" />
                            <span className="text-[10px] font-mono font-bold text-foreground/40 uppercase tracking-widest">BUFFER_STREAMS: {recentPulses.length}</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-foreground/10 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                                        <th className="px-4 py-4 font-bold">NODE_ID</th>
                                        <th className="px-4 py-4 font-bold">OS_FAMILY</th>
                                        <th className="px-4 py-4 font-bold">STAMP_UTC</th>
                                        <th className="px-4 py-4 font-bold text-right">RESPONSE</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-foreground/5 font-mono text-sm">
                                    {recentPulses.length > 0 ? (
                                        recentPulses.map((pulse: any) => (
                                            <tr key={pulse.id} className="group hover:bg-foreground/[0.02] transition-colors">
                                                <td className="px-4 py-4 font-medium flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-cta group-hover:scale-125 transition-transform" />
                                                    {pulse.deviceName}
                                                </td>
                                                <td className="px-4 py-4 text-foreground/60">{pulse.deviceOs}</td>
                                                <td className="px-4 py-4 text-foreground/60">{new Date(pulse.timestamp).toLocaleString()}</td>
                                                <td className="px-4 py-4 text-right">
                                                    <span className="inline-flex items-center text-[10px] font-bold text-cta">
                                                        [ RECEIVED ]
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-16 text-center text-foreground/20 italic font-mono selection:bg-transparent uppercase tracking-wider text-xs">
                                                NO_ACTIVE_STREAMS_DETECTED
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
