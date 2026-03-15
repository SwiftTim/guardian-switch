import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "card bg-zinc-50/50 dark:bg-zinc-950/20 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800",
            className
        )}>
            {children}
        </div>
    );
}

export function Button({ children, className, variant = 'primary', ...props }: any) {
    const variants = {
        primary: "bg-cta text-white hover:opacity-90 active:scale-95 shadow-md shadow-cta/20",
        secondary: "bg-primary text-white hover:opacity-90 active:scale-95 shadow-md shadow-primary/20",
        outline: "border-2 border-primary text-primary hover:bg-primary/5 active:scale-95",
    };

    return (
        <button
            className={cn(
                "inline-flex h-11 items-center justify-center rounded-xl px-8 text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50",
                variants[variant as keyof typeof variants],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export function Badge({ children, status }: { children: React.ReactNode; status: 'active' | 'overdue' }) {
    const styles = {
        active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]",
        overdue: "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]",
    };

    return (
        <span className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider transition-all duration-500",
            styles[status]
        )}>
            <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
            {children}
        </span>
    );
}
