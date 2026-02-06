import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
    success: boolean;
    distance?: number | null;
    onRetry: () => void;
}

export function ResultCard({ success, distance, onRetry }: ResultCardProps) {
    return (
        <Card className={cn(
            "absolute inset-0 m-4 border-4 shadow-none rounded-none flex flex-col justify-center items-center z-40 bg-[var(--color-background)]",
            success ? "border-[var(--color-accent)]" : "border-[var(--color-destructive)]"
        )}>
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 border-4 border-black p-2 rounded-full bg-white">
                    {success ? (
                        <Check className="w-12 h-12 text-[var(--color-accent)]" strokeWidth={4} />
                    ) : (
                        <X className="w-12 h-12 text-[var(--color-destructive)]" strokeWidth={4} />
                    )}
                </div>
                <CardTitle className={cn(
                    "text-xl uppercase tracking-tighter",
                    success ? "text-[var(--color-accent)]" : "text-[var(--color-destructive)]"
                )}>
                    {success ? "Target Acquired!" : "Missed!"}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 font-bold uppercase">
                    {success
                        ? "Identity confirmed. Access granted."
                        : "Unknown target. Try again."
                    }
                </CardDescription>
            </CardHeader>

            <CardContent className="text-center font-mono text-[10px] text-slate-500 uppercase">
                {distance !== null && distance !== undefined && (
                    <div className="bg-slate-200 px-2 py-1 rounded inline-block">
                        Match Level: {((1 - Math.min(distance, 1)) * 100).toFixed(0)}%
                    </div>
                )}
            </CardContent>

            <CardFooter className="justify-center pt-2 pb-6 w-full">
                <Button
                    onClick={onRetry}
                    className={cn(
                        "w-full max-w-[200px] font-bold uppercase tracking-wide border-2 border-black/20 shadow-[0_4px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-none transition-all",
                        success
                            ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90"
                            : "bg-[var(--color-destructive)] text-white hover:bg-[var(--color-destructive)]/90"
                    )}
                >
                    {success ? "Continue" : "Retry"}
                </Button>
            </CardFooter>
        </Card>
    );
}
