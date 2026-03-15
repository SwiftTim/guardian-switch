"use client";

import { useState } from "react";
import { Copy, Check, Save, Terminal, Monitor, Laptop, Info, AlertTriangle, Loader2 } from "lucide-react";
import { Button, Card, cn } from "@/components/ui/core";

export function ApiKeyCard({ apiKey }: { apiKey: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mb-8 p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-primary/10">
                    <Terminal className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 font-mono">YOUR_SECURE_API_KEY</p>
                    <p className="font-mono text-sm tracking-tight text-primary break-all">{apiKey || "KEY_NOT_INITIALIZED"}</p>
                </div>
            </div>
            <Button
                variant="outline"
                onClick={copyToClipboard}
                className="h-9 px-4 text-xs font-mono gap-2 border-primary/30 hover:bg-primary/10 w-full sm:w-auto"
            >
                {copied ? (
                    <>
                        <Check className="w-3 h-3 text-cta" /> COPIED
                    </>
                ) : (
                    <>
                        <Copy className="w-3 h-3" /> COPY_KEY
                    </>
                )}
            </Button>
        </div>
    );
}

export function MonitorSettingsForm({ initialData }: { initialData: any }) {
    const [email, setEmail] = useState(initialData?.trustedEmail || "");
    const [message, setMessage] = useState(initialData?.emergencyMessage || "");
    const [hours, setHours] = useState(initialData?.thresholdHours || 24);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus("idle");

        try {
            const res = await fetch("/api/monitor/update", {
                method: "POST",
                body: JSON.stringify({
                    trusted_email: email,
                    emergency_message: message,
                    threshold_hours: hours,
                }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                setStatus("success");
                setTimeout(() => setStatus("idle"), 3000);
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-full border-primary/20 bg-primary/5">
            <h3 className="text-lg font-bold font-mono flex items-center gap-2 mb-6 tracking-tight">
                <Monitor className="w-5 h-5 text-primary" />
                CONFIG_PROTOCOLS
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/40">ESC_CONTACT_EMAIL</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-background/50 border border-foreground/10 rounded-lg px-3 py-2 text-sm font-mono focus:border-primary/50 outline-none transition-all"
                        placeholder="trusted@contact.com"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/40">SILENCE_THRESHOLD (HOURS)</label>
                    <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(parseInt(e.target.value))}
                        className="w-full bg-background/50 border border-foreground/10 rounded-lg px-3 py-2 text-sm font-mono focus:border-primary/50 outline-none"
                        min="1"
                        max="168"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/40">EMERGENCY_DATA_BODY</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-24 bg-background/50 border border-foreground/10 rounded-lg px-3 py-2 text-sm font-mono focus:border-primary/50 outline-none resize-none"
                        placeholder="The emergency message to send..."
                        required
                    />
                </div>

                <Button
                    type="submit"
                    variant={status === "success" ? "secondary" : "primary"}
                    className="w-full font-mono gap-2 text-xs"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : status === "success" ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {status === "success" ? "PROTOCOL_SAVED" : "SAVE_CONFIG"}
                </Button>
            </form>
        </Card>
    );
}

export function InstructionPanel({ apiKey }: { apiKey: string }) {
    const [os, setOs] = useState<"linux" | "windows">("linux");
    const [copied, setCopied] = useState(false);

    const linuxCmd = `curl -sSL https://guardian-switch.vercel.app/api/install | bash -s -- ${apiKey}`;
    const windowsCmd = `iwr https://guardian-switch.vercel.app/api/install/win -useb | iex; install-sentinel -key "${apiKey}"`;

    const copyCmd = () => {
        navigator.clipboard.writeText(os === "linux" ? linuxCmd : windowsCmd);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="md:col-span-12 border-primary/10 overflow-hidden group">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
                <div>
                    <h3 className="text-xl font-bold font-mono flex items-center gap-3">
                        <Laptop className="w-5 h-5 text-primary" />
                        SENTINEL_DEPLOYMENT_GUIDE
                    </h3>
                    <p className="mt-2 text-foreground/50 text-sm max-w-xl">
                        Choose your operating system and run the command below in your terminal to initialize monitoring on your local hardware.
                    </p>
                </div>
                <div className="flex bg-foreground/5 p-1 rounded-xl">
                    <button
                        onClick={() => setOs("linux")}
                        className={cn("px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all", os === "linux" ? "bg-background shadow-md text-primary" : "text-foreground/40 hover:text-foreground/60")}
                    >
                        LINUX_BASH
                    </button>
                    <button
                        onClick={() => setOs("windows")}
                        className={cn("px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all", os === "windows" ? "bg-background shadow-md text-primary" : "text-foreground/40 hover:text-foreground/60")}
                    >
                        WIN_POWERSHELL
                    </button>
                </div>
            </div>

            <div className="relative group/code">
                <div className="absolute top-0 right-0 p-4 z-10">
                    <Button variant="outline" size="sm" onClick={copyCmd} className="h-8 px-3 font-mono text-[10px] gap-2 border-white/10 bg-black/40 backdrop-blur-md">
                        {copied ? <Check className="w-3 h-3 text-cta" /> : <Copy className="w-3 h-3" />}
                        {copied ? "COPIED" : "COPY_COMMAND"}
                    </Button>
                </div>
                <div className="bg-zinc-950 rounded-2xl p-6 font-mono text-sm border border-white/5 overflow-x-auto">
                    <div className="flex gap-4">
                        <span className="text-foreground/20 italic"># One-click installation</span>
                    </div>
                    <div className="flex gap-4 mt-2">
                        <span className="text-primary">$</span>
                        <span className="text-primary/90 whitespace-pre">{os === "linux" ? linuxCmd : windowsCmd}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-500/80 leading-relaxed font-mono">
                    <span className="font-bold underline">NOTE:</span> Strangers should run this command ONLY once. The Sentinel will automatically register itself as a background service and will resume monitoring after every reboot.
                </p>
            </div>
        </Card>
    );
}
