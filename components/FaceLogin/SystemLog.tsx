import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SystemLogProps {
    logs: string[];
}

export function SystemLog({ logs }: SystemLogProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollElement) {
                scrollElement.scrollTop = scrollElement.scrollHeight;
            }
        }
    }, [logs]);

    return (
        <div className="w-full bg-black border-4 border-[#5e5e5e] rounded-lg mt-4 shadow-inner overflow-hidden">
            <div className="bg-[#5e5e5e] px-2 py-1 text-[10px] font-bold text-white uppercase flex justify-between">
                <span>System Log</span>
                <span className="animate-pulse">● REC</span>
            </div>
            <ScrollArea className="h-24 w-full p-2" ref={scrollRef}>
                <div className="flex flex-col gap-1 font-mono text-[10px] text-[#8bac0f] leading-tight">
                    {logs.length === 0 && <span className="opacity-50">&gt; Waiting for events...</span>}
                    {logs.map((log, i) => (
                        <div key={i} className="break-words">
                            <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                            {log}
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
        </div>
    );
}
