import Link from "next/link";
import { Shield, Zap, Lock, Bell, Terminal, ChevronRight } from "lucide-react";
import { Button, Card } from "@/components/ui/core";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-hidden relative">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="absolute top-0 w-full z-20 px-6 h-20 flex items-center justify-between border-b border-foreground/5 backdrop-blur-sm">
        <div className="font-mono font-bold tracking-tighter text-xl">
          GUARDIAN<span className="text-primary">SWITCH</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs font-mono font-bold tracking-widest text-foreground/60 hover:text-primary transition-colors">
            LOGIN_SECURE
          </Link>
          <Link href="/register">
            <Button size="sm" className="font-mono text-[10px] tracking-widest px-4">
              JOIN_SENTINEL
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-32 md:pt-48">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8 animate-fade-in shadow-sm">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-primary">Secure_Node_Active</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold font-mono tracking-tighter mb-8 max-w-4xl glow-text leading-[1] selection:text-background">
            THE_ULTIMATE <br />
            <span className="text-primary">DEAD_MANS_SWITCH</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-foreground/50 mb-12 leading-relaxed">
            A fail-safe monitoring system that protects your digital legacy.
            If you don&apos;t check in, your trusted contacts are notified automatically.
            <span className="block mt-2 opacity-80">Simple. Secure. Autonomous.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <Link href="/register">
              <Button className="font-mono h-14 px-12 text-base flex items-center gap-3 group">
                INITIALIZE_SYSTEM <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/login" className="text-sm font-mono font-bold text-foreground/40 hover:text-primary transition-colors decoration-primary/20 underline underline-offset-8">
                EXISTING_USER_SYNC
              </Link>
              <div className="hidden sm:block h-10 w-px bg-foreground/10" />
              <div className="hidden sm:block">
                <p className="text-[10px] font-mono font-bold text-foreground/20 leading-none mb-1 uppercase">Latency</p>
                <p className="text-xs font-mono font-bold text-cta">0.42ms [PROD]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid gap-6 md:grid-cols-3">
          <Card className="p-8 border-primary/10">
            <div className="p-3 rounded-xl bg-primary/10 w-fit mb-6">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold font-mono mb-3 tracking-tight">AUTO_PULSE</h3>
            <p className="text-sm text-foreground/50 leading-relaxed">
              Lightweight sentinel scripts run locally on your hardware, sending encrypted heartbeats to our security cluster.
            </p>
          </Card>

          <Card className="p-8 border-primary/10">
            <div className="p-3 rounded-xl bg-primary/10 w-fit mb-6">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold font-mono mb-3 tracking-tight">SMART_ALERTS</h3>
            <p className="text-sm text-foreground/50 leading-relaxed">
              Customizable thresholds and escalation paths. Notify family or legal counsel only when silence is confirmed.
            </p>
          </Card>

          <Card className="p-8 border-primary/10">
            <div className="p-3 rounded-xl bg-primary/10 w-fit mb-6">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold font-mono mb-3 tracking-tight">ZERO_KNOWLEDGE</h3>
            <p className="text-sm text-foreground/50 leading-relaxed">
              Your data belongs to you. Emergency messages are delivered securely only when the trigger conditions are met.
            </p>
          </Card>
        </div>

        {/* Mockup / Visual Element */}
        <div className="mt-32 rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-4 md:p-8 backdrop-blur-3xl">
          <div className="rounded-2xl border border-foreground/10 bg-background overflow-hidden shadow-2xl shadow-primary/5">
            <div className="bg-foreground/5 px-4 py-2 flex items-center gap-2 border-b border-foreground/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
              </div>
              <div className="flex-1 text-center font-mono text-[10px] text-foreground/30 font-bold tracking-widest">
                GUARDIAN_SYSTEM_CONSOLEV_1.0.4
              </div>
            </div>
            <div className="p-6 md:p-10 bg-zinc-950 font-mono text-xs md:text-sm text-primary/80 leading-6 overflow-hidden max-h-[400px]">
              <div className="flex gap-4">
                <span className="text-foreground/20">01</span>
                <span>$ python3 sentinel.py --init</span>
              </div>
              <div className="flex gap-4">
                <span className="text-foreground/20">02</span>
                <span className="text-cta">[SUCCESS] Key_pair generated successfully.</span>
              </div>
              <div className="flex gap-4">
                <span className="text-foreground/20">03</span>
                <span>[INFO] Establishing secure link to node.guardianswitch.com...</span>
              </div>
              <div className="flex gap-4">
                <span className="text-foreground/20">04</span>
                <span className="text-cta">[ONLINE] Sentinel heartbeat active. Interval: 3600s</span>
              </div>
              <div className="flex gap-4">
                <span className="text-foreground/20">05</span>
                <span>_</span>
              </div>
              <div className="mt-32 opacity-20">
                {/* Visual Filler */}
                <div className="h-4 w-full bg-primary/20 rounded-full mb-2" />
                <div className="h-4 w-[80%] bg-primary/20 rounded-full mb-2" />
                <div className="h-4 w-[60%] bg-primary/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-foreground/10 py-12 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-mono font-bold tracking-tighter text-xl">
            GUARDIAN<span className="text-primary">SWITCH</span>
          </div>
          <div className="flex gap-8 text-sm font-mono text-foreground/40">
            <a href="#" className="hover:text-primary transition-colors">PROTOCOLS</a>
            <a href="#" className="hover:text-primary transition-colors">SECURITY</a>
            <a href="#" className="hover:text-primary transition-colors">V_1.0.4</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
