"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function PoliceThievesLobby() {
  const router = useRouter();
  const params = useParams();
  const rawRoomId = params.roomId;
  const roomId = Array.isArray(rawRoomId) ? rawRoomId[0] : rawRoomId;

  // Mock State for UI
  const [copied, setCopied] = useState(false);
  const isHost = true; // Hardcoded mock for now

  // Initial mockup players list based on user design
  const allPlayers = [
    { name: "Alex", isMe: true },
    { name: "Sam", isMe: false },
    { name: "You", isMe: true }, // 'You' represents the current mock state
  ];

  // We only display the first 6 slots
  const displayPlayers = Array.from({ length: 6 }).map((_, index) => {
    return allPlayers[index] || null;
  });

  const connectedPlayersCount = displayPlayers.filter(p => p !== null).length;
  const canStart = connectedPlayersCount > 1;

  const handleCopy = async () => {
    try {
      if (roomId) {
        await navigator.clipboard.writeText(roomId.toUpperCase());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 text-slate-900 font-sans overflow-hidden">
      
      {/* Animated Background Map Grid */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center px-4 py-8 flex flex-col items-center">
        
        {/* Simple Back button */}
        <div className="absolute top-4 left-4 sm:fixed sm:top-8 sm:left-8">
          <Link href="/police-thieves" className="px-5 py-3 bg-white rounded-full shadow-md text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
            ← Leave Lobby
          </Link>
        </div>

      {/* Header */}
      <div className="mt-16 sm:mt-12 mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-md flex flex-col items-center gap-4">
          <div className="flex gap-3 justify-center items-center text-3xl sm:text-5xl">
            <span className="bg-blue-100 border-2 border-blue-200 text-blue-600 px-5 py-2 rounded-xl shadow-sm rotate-[-2deg]">🚓 Police</span> 
            <span className="text-slate-400 text-2xl font-black">vs</span> 
            <span className="bg-red-100 border-2 border-red-200 text-red-600 px-5 py-2 rounded-xl shadow-sm rotate-[2deg]">🕵️ Thieves</span>
          </div>
        </h1>
      </div>

      {/* Main Lobby Panel */}
      <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] w-full max-w-md border border-white shadow-2xl mb-10">
        
        {/* Room Code */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-100 p-4 rounded-2xl border border-slate-200 mb-8 gap-4 shadow-inner">
          <div className="text-center sm:text-left shadow-none">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Room Code</p>
            <p className="font-mono text-3xl font-black tracking-widest text-slate-800 drop-shadow-sm">{roomId?.toUpperCase() || "7XK9P"}</p>
          </div>
          <button 
            onClick={handleCopy}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all border-2 w-full sm:w-auto ${copied ? 'bg-emerald-100 text-emerald-600 border-emerald-200 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 shadow-sm'}`}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Player List */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide">
              Players
            </h2>
            <span className="text-indigo-700 font-bold bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-200">
              {allPlayers.length} / 6
            </span>
          </div>

          <ul className="space-y-2.5">
            {displayPlayers.map((p, i) => (
              <li key={i} className={`flex justify-between items-center p-3.5 px-5 rounded-2xl ${p ? 'bg-slate-50 border-2 border-slate-100 shadow-sm' : 'bg-slate-100/50 border-2 border-dashed border-slate-200 text-slate-400'}`}>
                {p ? (
                  <>
                    <span className="font-bold text-lg flex items-center gap-3 text-slate-700">
                      <span className="text-xl drop-shadow-sm opacity-90">👤</span> 
                      {p.name} {p.isMe && <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md ml-1">YOU</span>}
                    </span>
                  </>
                ) : (
                  <span className="font-bold flex items-center gap-3 pl-1">
                    <span className="text-slate-300">+</span> Waiting...
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <button 
             onClick={() => router.push(`/police-thieves/game/${roomId}`)}
             disabled={!canStart || !isHost}
             className={`w-full py-4 rounded-2xl text-xl font-black uppercase tracking-wider transition-all border-b-4 active:border-b-0 active:translate-y-1 ${(canStart && isHost) ? 'bg-yellow-400 hover:bg-yellow-300 text-yellow-950 border-yellow-500 shadow-[0_4px_20px_rgba(250,204,21,0.3)]' : 'bg-slate-200 text-slate-400 border-transparent cursor-not-allowed'}`}
          >
            {(!isHost) ? 'Waiting for host...' : (!canStart) ? 'Waiting for players...' : 'Start Game'}
          </button>
        </div>

      </div>

      {/* Rules Section */}
      <div className="max-w-md mx-auto text-center bg-white/70 p-6 rounded-3xl border border-white/50 shadow-lg backdrop-blur-md">
        <h3 className="text-slate-500 font-black uppercase tracking-widest text-sm mb-4 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-slate-300"></span>
          Game Rules
          <span className="h-px w-8 bg-slate-300"></span>
        </h3>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-600 text-sm font-medium leading-relaxed shadow-inner">
          <p className="mb-2"><span className="text-blue-600 font-bold">1 Police</span> vs <span className="text-red-500 font-bold">{Math.max(1, allPlayers.length - 1)} Thieves</span></p>
          <p className="mb-2">Thieves must <span className="text-slate-800 font-bold underline decoration-slate-300 underline-offset-4">hide</span> before the timer ends.</p>
          <p>Thieves can catch the police to win!</p>
        </div>
      </div>
      </div>
    </main>
  );
}
