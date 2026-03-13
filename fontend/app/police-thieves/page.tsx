"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function randomRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function PoliceThievesHome() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = () => {
    const id = randomRoomId();
    router.push(`/police-thieves/lobby/${id}`);
  };

  const handleJoinRoom = () => {
    const code = roomCode.trim().toUpperCase();
    if (code) {
      router.push(`/police-thieves/lobby/${code}`);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 text-slate-900 font-sans overflow-hidden">
      
      {/* Animated Background Map Grid */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
         {/* Moving characters placeholders */}
         <div className="absolute top-[20%] left-[10%] text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🏎️</div>
         <div className="absolute top-[60%] right-[15%] text-4xl animate-pulse" style={{ animationDuration: '2s' }}>🏃‍♂️</div>
         <div className="absolute top-[80%] left-[30%] text-4xl animate-pulse" style={{ animationDuration: '4s' }}>🌲</div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center px-4 py-8">
        
        {/* Simple Back button */}
        <div className="absolute top-4 left-4 sm:fixed sm:top-8 sm:left-8">
          <Link href="/" className="px-5 py-3 bg-white rounded-full shadow-md text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
            ← Back to Hub
          </Link>
        </div>

        {/* Big Hero Section */}
        <h1 className="mt-12 sm:mt-0 text-5xl sm:text-7xl font-black mb-6 tracking-tight drop-shadow-md flex flex-col items-center gap-6">
          <div className="flex gap-4 justify-center items-center text-4xl sm:text-6xl">
            <span className="bg-blue-100 border-2 border-blue-200 text-blue-600 px-6 py-3 rounded-2xl shadow-sm rotate-[-4deg] hover:rotate-0 transition-transform">🚓 Police</span> 
            <span className="text-slate-400 text-3xl">vs</span> 
            <span className="bg-red-100 border-2 border-red-200 text-red-600 px-6 py-3 rounded-2xl shadow-sm rotate-[4deg] hover:rotate-0 transition-transform">🕵️ Thieves</span>
          </div>
        </h1>

        <p className="mb-12 text-xl sm:text-2xl font-bold text-slate-500 max-w-lg mx-auto">
          Hide. Escape. Hunt your friends in this fast-paced multiplayer chase!
        </p>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white mb-10 mx-auto w-full max-w-lg">
          <input
            className="w-full mb-6 p-5 rounded-2xl text-xl font-bold bg-slate-100 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:outline-none transition-colors text-slate-800 placeholder-slate-400 text-center shadow-inner"
            placeholder="Enter your alias..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-10 py-6 rounded-2xl text-2xl font-black uppercase tracking-wide hover:scale-105 transition-transform active:scale-95 shadow-[0_10px_30px_rgba(250,204,21,0.5)] mb-8 flex justify-center items-center gap-3">
            ▶ Play Quick Match
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Or make a room</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={handleCreateRoom}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-md shadow-blue-500/20 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Create Room
            </button>

            <button 
              onClick={handleJoinRoom}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Join Room
            </button>
          </div>

          <div className="flex gap-2 p-2 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
            <input
              className="flex-1 p-3 px-5 rounded-xl font-bold bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none uppercase tracking-widest"
              placeholder="Code"
              maxLength={6}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
            />
            <button 
              onClick={handleJoinRoom}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm"
            >
              Enter
            </button>
          </div>
        </div>

        {/* How to Play */}
        <div className="max-w-md mx-auto text-center bg-white/70 p-8 rounded-3xl border border-white/50 shadow-lg backdrop-blur-md">
          <h2 className="text-2xl font-black mb-4 text-slate-800 uppercase tracking-wide">How to Play</h2>
          <p className="text-slate-600 font-semibold leading-relaxed text-lg">
            One player becomes <span className="text-blue-500">Police</span>. Others are <span className="text-red-500">Thieves</span>.<br/>
            Hide before the timer ends. Police must catch all thieves.<br/>
            Thieves can catch the police to win.
          </p>
        </div>

      </div>
    </main>
  );
}
