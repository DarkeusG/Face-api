import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CameraFeedProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    isScanning: boolean;
    cameraReady: boolean;
    onCameraStart: () => void;
}

export function CameraFeed({
    videoRef,
    canvasRef,
    isScanning,
    cameraReady,
    onCameraStart,
}: CameraFeedProps) {

    return (
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl ring-1 ring-white/10 group">
            {/* Video Element */}
            <video
                ref={videoRef}
                className={cn(
                    "w-full h-full object-cover transition-opacity duration-700",
                    cameraReady ? "opacity-100" : "opacity-0"
                )}
                playsInline
                muted
            />

            {/* Canvas for face-api landmarks */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none w-full h-full"
            />

            {/* Fallback / Initial State */}
            {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-4 p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-2 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera text-slate-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                        </div>
                        <p className="text-slate-400 max-w-[200px] text-sm">
                            Waiting for camera access...
                        </p>
                        <button
                            onClick={onCameraStart}
                            className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors"
                        >
                            Start Camera Manually
                        </button>
                    </div>
                </div>
            )}

            {/* Scanning Overlay (Pro Look) */}
            {isScanning && (
                <div className="absolute inset-0 pointer-events-none z-20">
                    {/* Scanning Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />

                    {/* Moving Scan Line */}
                    <div className="absolute left-0 right-0 h-[2px] bg-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-scan" />

                    {/* Corner Brackets */}
                    <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-cyan-500 rounded-tl-lg opacity-80" />
                    <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-cyan-500 rounded-tr-lg opacity-80" />
                    <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-cyan-500 rounded-bl-lg opacity-80" />
                    <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-cyan-500 rounded-br-lg opacity-80" />

                    {/* Central Focus Ring */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border border-cyan-500/30 rounded-full animate-pulse-ring" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border border-cyan-400/50 rounded-[4rem]" />
                </div>
            )}
        </div>
    );
}
