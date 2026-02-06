"use client";

import { useEffect } from "react";
import { useFaceLogin } from "@/hooks/useFaceLogin";
import { CameraFeed } from "./CameraFeed";
import { ResultCard } from "./ResultCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, Scan, AlertTriangle, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

import { SystemLog } from "./SystemLog";

export default function FaceLoginWidget() {
    const {
        videoRef,
        canvasRef,
        loginState,
        error,
        distance,
        startCamera,
        captureAndRegister,
        captureAndLogin,
        reset,
        isModelLoaded,
        logs // Get logs from hook
    } = useFaceLogin();

    // Auto-start camera when widget mounts
    useEffect(() => {
        startCamera();
    }, [startCamera]);

    const isScanning = loginState === "SCANNING";
    const isSuccess = loginState === "SUCCESS";
    const isFailure = loginState === "FAILURE";
    const isCameraReady = loginState === "CAMERA_READY";

    return (
        <div className="relative z-10 w-full max-w-2xl mx-auto">
            {/* Pokedex Top Sensors (Cosmetic) */}
            <div className="flex items-start gap-4 mb-6 pl-4 md:pl-16">
                <div className="w-16 h-16 rounded-full bg-[var(--color-screen-blue)] border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white/50 blur-[1px]" />
                </div>
                <div className="flex gap-2 mt-2">
                    <div className="w-4 h-4 rounded-full bg-[var(--color-pokedex-red)] border border-black/20" />
                    <div className="w-4 h-4 rounded-full bg-[var(--color-sensor-yellow)] border border-black/20" />
                    <div className="w-4 h-4 rounded-full bg-[var(--color-sensor-green)] border border-black/20" />
                </div>
            </div>

            {/* Main Pokedex Screen Container */}
            <div className="bg-[#dedede] p-6 md:p-8 rounded-bl-[40px] rounded-br-[10px] rounded-t-[10px] shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.2),_10px_10px_20px_rgba(0,0,0,0.4)] border-4 border-[#b0b0b0]">

                {/* Header Text & Vents */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex flex-col gap-1">
                        <div className="w-16 h-2 bg-slate-700 rounded-full shadow-inner" />
                        <div className="w-16 h-2 bg-slate-700 rounded-full shadow-inner" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 uppercase text-shadow-retro">
                            PokéID
                        </h1>
                        <span className="text-[10px] font-bold text-slate-500 tracking-widest block -mt-1">VER 2.0</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="w-16 h-2 bg-slate-700 rounded-full shadow-inner" />
                        <div className="w-16 h-2 bg-slate-700 rounded-full shadow-inner" />
                    </div>
                </div>

                {/* Inner Screen Area */}
                <div className="w-full relative bg-gray-900 border-[6px] border-[#5e5e5e] rounded-lg p-2 overflow-hidden shadow-inner box-shadow-inset">
                    {/* Glass Glare Reflection */}
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-linear-to-bl from-white/10 to-transparent pointer-events-none z-20 skew-x-12" />

                    <div className="relative w-full aspect-video bg-[#0f380f] overflow-hidden rounded-[2px] shadow-inner">

                        {/* Scanlines & CRT Overlay */}
                        <div className="scanlines absolute inset-0 z-10 pointer-events-none opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 pointer-events-none z-10" />

                        {/* State: Models Loading */}
                        {/* State: Models Loading */}
                        {!isModelLoaded && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8bac0f] z-20 bg-black/90">
                                <div className="pokeball-spinner mb-6 scale-75" />
                                <p className="animate-pulse text-xs tracking-widest crt-screen">BOOTING SYSTEM...</p>
                            </div>
                        )}

                        {/* State: Active Camera / Scanning */}
                        {isModelLoaded && !isSuccess && !isFailure && (
                            <div className="relative w-full h-full">
                                <CameraFeed
                                    videoRef={videoRef}
                                    canvasRef={canvasRef}
                                    isScanning={isScanning}
                                    cameraReady={loginState !== "LOADING_MODELS" && loginState !== "CAMERA_PERMISSION"}
                                    onCameraStart={startCamera}
                                />

                                {/* Overlay Controls centered on screen */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-30">
                                    {isScanning ? (
                                        <div className="text-[#8bac0f] text-xs blink-animation bg-black/80 px-2 py-1">
                                            ANALYZING...
                                        </div>
                                    ) : (
                                        <div className="text-[var(--color-screen-blue)] text-xs bg-black/80 px-2 py-1">
                                            READY TO SCAN
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* State: Result (Success/Failure) */}
                        {(isSuccess || isFailure) && (
                            <ResultCard
                                success={isSuccess}
                                distance={distance}
                                onRetry={reset}
                            />
                        )}
                    </div>
                </div>

                {/* Controls Area (Below Screen) */}
                <div className="mt-6 flex items-center justify-between px-4">
                    {/* D-Pad Decoration (Non-functional) */}
                    <div className="w-24 h-24 relative opacity-80 pointer-events-none hidden md:block">
                        <div className="absolute top-0 left-[33%] w-[33%] h-full bg-[#222] rounded-sm shadow-md" />
                        <div className="absolute top-[33%] left-0 w-full h-[33%] bg-[#222] rounded-sm shadow-md" />
                        <div className="absolute top-[33%] left-[33%] w-[33%] h-[33%] bg-[#1a1a1a] rounded-full" />
                    </div>

                    {/* Main Action Button */}
                    <div className="flex flex-col items-center gap-2">
                        <Button
                            size="lg"
                            className={cn(
                                "w-16 h-16 rounded-full border-4 border-white/20 shadow-[0_4px_0_#b59f3b] active:shadow-none active:translate-y-[4px] transition-all",
                                "bg-[var(--color-primary)] hover:bg-[#ffe16b] text-[var(--color-primary-foreground)]",
                                isScanning ? "opacity-50 pointer-events-none" : "opacity-100"
                            )}
                            onClick={captureAndLogin}
                            disabled={!isCameraReady}
                            aria-label="Scan Face"
                        >
                            <Scan className="w-8 h-8" />
                        </Button>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scan</span>
                    </div>

                    {/* Registration Button (Select/Start style) */}
                    <div className="flex gap-4 transform translate-y-4">
                        <div className="flex flex-col items-center gap-1">
                            <Button
                                variant="ghost"
                                className="h-2 w-12 bg-slate-700 rounded-full shadow-[0_2px_0_#aaa] active:shadow-none active:translate-y-[2px] p-0 hover:bg-slate-600"
                                onClick={captureAndRegister}
                                title="Register (Debug)"
                                aria-label="Register Face"
                            />
                            <span className="text-[8px] font-bold text-slate-500 uppercase">Register</span>
                        </div>
                    </div>
                </div>

                {/* System Log Display */}
                <SystemLog logs={logs} />

                {/* Status Light */}
                <div className="absolute bottom-8 right-8 flex gap-2">
                    <div className={cn("w-3 h-3 rounded-full border border-black/20", isModelLoaded ? "bg-green-500 shadow-[0_0_5px_lime]" : "bg-red-500")} />
                </div>
            </div>

            {/* Error Messages */}
            {error && !isSuccess && !isFailure && (
                <Alert variant="destructive" className="mt-4 border-4 border-black bg-[#ffcccc] text-red-900 font-bold">
                    <AlertTriangle className="h-4 w-4 text-red-900" />
                    <AlertTitle>ERROR</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

        </div>
    );
}
