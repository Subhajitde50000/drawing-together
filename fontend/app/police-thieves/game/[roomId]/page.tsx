"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";

// Load Three.js game component with SSR disabled (requires browser APIs)
const ThreeGame = dynamic(() => import("./ThreeGame"), { ssr: false });

export default function PoliceThievesGame() {
  const params = useParams();
  const rawRoomId = params.roomId;
  const roomId = Array.isArray(rawRoomId) ? rawRoomId[0] : rawRoomId;

  // Mock State for UI HUD
  const [role, setRole] = useState<"police" | "thief">("police");
  const [timeLeft, setTimeLeft] = useState("02:15");
  const [thievesLeft, setThievesLeft] = useState(3);
  const totalPlayers = 6;
  const playersAlive = 4;
  
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Monitor fullscreen changes to sync state (user pressing ESC natively)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error("Error attempting to toggle fullscreen:", err);
    }
  };

  return (
    <>
      <style>{`
        @media screen and (orientation: portrait) and (max-width: 1024px) {
          .auto-landscape {
            transform: rotate(90deg);
            transform-origin: left top;
            width: 100vh !important;
            height: 100vw !important;
            position: absolute;
            top: 0;
            left: 100%;
          }
        }
      `}</style>
      <div className="absolute inset-0 bg-slate-50 text-slate-800 flex flex-col font-sans overflow-hidden select-none auto-landscape">
        
        {/* Top HUD */}
        <div className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex justify-between items-center shadow-sm z-10 shrink-0">
          
          {/* Left: Role & Back Button */}
          <div className="flex items-center gap-4">
          <Link href={`/police-thieves/lobby/${roomId}`} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="text-xl">⏴</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="text-sm uppercase tracking-widest text-slate-400 font-bold hidden sm:inline-block">Role:</span>
            {role === "police" ? (
              <span className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-1.5 rounded-lg font-black tracking-wide shadow-sm flex items-center gap-2">
                🚓 Police
              </span>
            ) : (
              <span className="bg-red-50 border border-red-200 text-red-600 px-4 py-1.5 rounded-lg font-black tracking-wide shadow-sm flex items-center gap-2">
                🕵️ Thief
              </span>
            )}
          </div>
        </div>

        {/* Center: Stats */}
        <div className="flex items-center gap-2 sm:gap-4 mx-2">
          <span className="bg-slate-50 border border-slate-200 px-2 sm:px-4 py-1.5 rounded-lg flex items-center gap-1 sm:gap-2 shadow-sm whitespace-nowrap">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-xs hidden md:inline-block">Thieves:</span>
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-xs md:hidden">T:</span>
            <span className="text-red-500 font-black text-sm sm:text-base">{thievesLeft}</span>
          </span>
          <span className="bg-slate-50 border border-slate-200 px-2 sm:px-4 py-1.5 rounded-lg flex items-center gap-1 sm:gap-2 shadow-sm whitespace-nowrap">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-xs hidden md:inline-block">Players:</span>
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-xs md:hidden">P:</span>
            <span className="text-indigo-600 font-black text-sm sm:text-base">{playersAlive} <span className="text-slate-400 font-normal text-[10px] sm:text-xs">/ {totalPlayers}</span></span>
          </span>
        </div>

        {/* Right: Timer & Settings */}
        <div className="flex items-center gap-3">
           <span className="text-sm uppercase tracking-widest text-slate-400 font-bold hidden sm:inline-block">Time:</span>
           <span className="bg-amber-50 border border-amber-200 text-amber-600 font-mono text-xl font-bold px-4 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
             ⏱ {timeLeft}
           </span>
           
           {/* Fullscreen Toggle */}
           <button 
             onClick={toggleFullscreen}
             className="ml-2 w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg border border-slate-200 transition-colors shadow-sm"
             title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
           >
             <span className="text-lg">
                {isFullscreen ? "⛌" : "⛶"}
             </span>
           </button>
        </div>
      </div>

      {/* Game Map Area — Phaser.js */}
      <div className="flex-1 relative overflow-hidden bg-slate-900">
        <ThreeGame role={role} />
      </div>

    </div>
    </>
  );
}
