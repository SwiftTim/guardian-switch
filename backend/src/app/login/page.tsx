"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Mail, Lock, LogIn, ChevronRight, Loader2, Terminal, Cpu } from "lucide-react";
import { Button, Card, cn } from "@/components/ui/core";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/dashboard");
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans selection:bg-primary/30 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cta/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-[420px] relative z-10">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-4 animate-fade-in shadow-sm backdrop-blur-sm">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-primary">system_verification_active</span>
                    </div>
                    <h1 className="text-3xl font-bold font-mono tracking-tighter mb-2 glow-text">
                        ACCESS_SECURE_NODE
                    </h1>
                    <p className="text-foreground/60 text-sm">Enter credentials to authenticate session</p>
                </div>

                <Card className="backdrop-blur-xl border-white/5 bg-white/[0.02] shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
                    <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/10 via-transparent to-cta/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <form onSubmit={handleLogin} className="space-y-6 relative">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/40 ml-1">
                                    EMAIL_ADDRESS
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-foreground/40 group-focus-within:text-primary transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 bg-background/50 border border-foreground/10 rounded-xl font-mono text-sm placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                        placeholder="user@secure.node"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/40 ml-1">
                                    SECURE_PHRASE
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-foreground/40 group-focus-within:text-primary transition-colors">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 bg-background/50 border border-foreground/10 rounded-xl font-mono text-sm placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500 text-xs font-mono animate-in fade-in zoom-in duration-300">
                                <Shield className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full font-mono h-12 gap-2 text-sm tracking-widest relative overflow-hidden group/btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    AUTHENTICATE_SESSION <ChevronRight className="w-4 h-4 translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>
                </Card>

                <p className="mt-8 text-center text-xs font-mono text-foreground/40 tracking-tight">
                    NODE_NOT_FOUND? {" "}
                    <Link href="/register" className="text-cta hover:text-green-400 transition-colors font-bold decoration-cta/30 underline underline-offset-4">
                        INITIALIZE_ONE
                    </Link>
                </p>

                <footer className="mt-20 flex justify-center gap-6 opacity-20 hover:opacity-100 transition-opacity duration-700 grayscale hover:grayscale-0">
                    <Terminal className="w-4 h-4" />
                    <Shield className="w-4 h-4" />
                    <LogIn className="w-4 h-4" />
                </footer>
            </div>
        </div>
    );
}
