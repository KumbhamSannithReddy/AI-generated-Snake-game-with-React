/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-8 px-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <header className="text-center mb-8 z-10">
        <h1 
          className="text-6xl md:text-8xl font-digital font-black tracking-widest mb-2 glitch-text"
          data-text="NEON X SYNTH"
        >
          <span className="neon-text-cyan">NEON</span>
          <span className="text-white mx-4">X</span>
          <span className="neon-text-magenta">SYNTH</span>
        </h1>
        <p className="text-gray-400 tracking-widest text-sm uppercase mt-4">Cybernetic Entertainment System</p>
      </header>

      <main className="flex-1 flex items-center justify-center w-full z-10 mb-12">
        <SnakeGame />
      </main>

      <footer className="w-full max-w-3xl z-10">
        <MusicPlayer />
      </footer>
    </div>
  );
}

