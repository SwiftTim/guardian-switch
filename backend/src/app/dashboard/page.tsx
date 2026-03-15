import { db } from '@/lib/db';
import { monitors, pulses } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, Button, Badge, cn } from '@/components/ui/core';
import { Shield, Clock, Mail, History, Terminal, AlertTriangle, Cpu } from 'lucide-react';

async function getDashboardData(userId: string) {
    const monitor = await db.query.monitors.findFirst({
        where: eq(monitors.userId, userId),
    });

    const recentPulses = await db.query.pulses.findMany({
        where: eq(pulses.userId, userId),
        limit: 8,
        orderBy: [desc(pulses.timestamp)],
    });

    return { monitor, recentPulses };
}

export default async function DashboardPage() {
    let USER_ID = "00000000-0000-0000-0000-000000000000";

    let data;
    try {
        // First try the default ID
        data = await getDashboardData(USER_ID);

        // If no monitor found, try to get the first user in the system for demo/setup
        if (!data.monitor) {
            const firstUser = await db.query.users.findFirst();
            if (firstUser) {
                USER_ID = firstUser.id;
                data = await getDashboardData(USER_ID);
            }
        }
    } catch (e) {
        data = { monitor: null, recentPulses: [] };
    }

    const { monitor, recentPulses } = data;
    const isHealthy = monitor?.lastPulseAt &&
        (new Date().getTime() - new Date(monitor.lastPulseAt).getTime()) < (monitor.thresholdHours || 24) * 3600000;

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 font-sans selection:bg-primary/30">
            <div className="mx-auto max-w-6xl">
                <header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Cpu className="w-5 h-5 text-primary" />
                            <span className="text-xs font-mono font-bold tracking-widest uppercase text-primary">System v1.0</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tighter text-foreground font-mono glow-text">
                            GUARDIAN_DASHBOARD
                        </h1>
                        <p className="text-foreground/60 text-sm">Active monitoring for node-01 sentinel</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="font-mono">SYS_LOGS</Button>
                        <Button variant="secondary" className="font-mono">SETTINGS</Button>
                    </div>
                </header>

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
                                <p className="mt-2 text-foreground/70 max-w-md">
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

                    {/* Configuration Summary */}
                    <Card className="md:col-span-4 border-primary/20 bg-primary/5">
                        <h3 className="text-lg font-bold font-mono flex items-center gap-2 mb-6 tracking-tight">
                            <Terminal className="w-5 h-5 text-primary" />
                            SW_CONFIG
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="p-2 rounded-lg bg-background border border-foreground/10 group-hover:border-primary/50 transition-colors">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-foreground/40 font-mono">THRESHOLD</p>
                                    <p className="text-sm font-medium">{monitor?.thresholdHours || 24}H Interval</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-2 rounded-lg bg-background border border-foreground/10 group-hover:border-primary/50 transition-colors">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-foreground/40 font-mono">ESC_CONTACT</p>
                                    <p className="text-sm font-medium truncate max-w-[180px]">{monitor?.trustedEmail || "NOT_SET"}</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <Button className="w-full font-mono text-xs tracking-widest" variant="outline">UPDATE_CONFIG</Button>
                            </div>
                        </div>
                    </Card>

                    {/* Activity Log */}
                    <Card className="md:col-span-12">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold font-mono flex items-center gap-3">
                                <History className="w-5 h-5 text-primary" />
                                PULSE_HISTORY
                            </h3>
                            <div className="h-px flex-1 mx-6 bg-foreground/10" />
                            <span className="text-[10px] font-mono font-bold text-foreground/40">TOTAL_RECORDS: {recentPulses.length}</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-foreground/10 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                                        <th className="px-4 py-4 font-bold">DEVICE_ID</th>
                                        <th className="px-4 py-4 font-bold">ENV_OS</th>
                                        <th className="px-4 py-4 font-bold">TIMESTAMP_LOCAL</th>
                                        <th className="px-4 py-4 font-bold text-right">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-foreground/5 font-mono text-sm">
                                    {recentPulses.length > 0 ? (
                                        recentPulses.map((pulse: any) => (
                                            <tr key={pulse.id} className="group hover:bg-foreground/[0.02] transition-colors">
                                                <td className="px-4 py-4 font-medium flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                                    {pulse.deviceName}
                                                </td>
                                                <td className="px-4 py-4 text-foreground/60">{pulse.deviceOs}</td>
                                                <td className="px-4 py-4 text-foreground/60">{new Date(pulse.timestamp).toLocaleString()}</td>
                                                <td className="px-4 py-4 text-right">
                                                    <span className="inline-flex items-center text-[10px] font-bold text-cta">
                                                        [ SUCCESS ]
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-16 text-center text-foreground/40 italic font-mono">
                                                NO_RECORDS_FOUND_IN_BUFFER
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
