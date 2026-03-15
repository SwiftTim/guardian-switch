"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/core";

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
                    <div className="w-5 h-5 text-primary flex items-center justify-center font-mono font-bold text-lg leading-none">
                        {">"}
                    </div>
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
                        <Check className="w-3 h-3 text-cta" /> COPIED_SUCCESS
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
