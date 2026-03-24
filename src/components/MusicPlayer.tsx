import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Dreams', artist: 'AI Synthwave', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cyberpunk City', artist: 'AI Darksynth', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Sunset', artist: 'AI Retrowave', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 neon-border-magenta rounded-xl bg-black/50 backdrop-blur-sm flex flex-col gap-4">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
        preload="auto"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isPlaying ? 'neon-border-cyan animate-pulse' : 'border border-gray-700'}`}>
            <Music className={isPlaying ? 'neon-text-cyan' : 'text-gray-500'} size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold neon-text-magenta truncate w-48">{currentTrack.title}</h3>
            <p className="text-xs text-gray-400">{currentTrack.artist}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:neon-text-cyan transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#0ff]"
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button onClick={skipBackward} className="text-gray-300 hover:neon-text-cyan transition-colors">
          <SkipBack size={24} />
        </button>
        <button 
          onClick={togglePlay} 
          className="w-12 h-12 flex items-center justify-center rounded-full neon-border-cyan text-[#0ff] hover:bg-[#0ff]/10 transition-colors"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <button onClick={skipForward} className="text-gray-300 hover:neon-text-cyan transition-colors">
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
}
