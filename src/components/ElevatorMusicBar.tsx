import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, SkipForward, Volume2, BellRing, Sparkles } from 'lucide-react';
import { elevatorSynth, ELEVATOR_TRACKS, ElevatorTrack } from '../audio/elevatorSynth';

interface ElevatorMusicBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTrack: ElevatorTrack;
  isMuted: boolean;
  onRingChime: () => void;
}

export const ElevatorMusicBar: React.FC<ElevatorMusicBarProps> = ({
  isPlaying,
  onTogglePlay,
  currentTrack,
  isMuted,
  onRingChime,
}) => {
  const [volume, setVolume] = useState(0.6);
  const [visualizerValues, setVisualizerValues] = useState<number[]>([15, 25, 40, 20, 35, 50, 30, 20]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const updateBars = () => {
      if (!active) return;
      if (isPlaying && !isMuted) {
        const data = elevatorSynth.getVisualizerData();
        // Sample 8 representative bins
        const sampled = [
          Math.max(10, Math.min(100, (data[1] || 0) * 0.45)),
          Math.max(10, Math.min(100, (data[3] || 0) * 0.55)),
          Math.max(10, Math.min(100, (data[5] || 0) * 0.5)),
          Math.max(10, Math.min(100, (data[7] || 0) * 0.6)),
          Math.max(10, Math.min(100, (data[9] || 0) * 0.5)),
          Math.max(10, Math.min(100, (data[11] || 0) * 0.45)),
          Math.max(10, Math.min(100, (data[13] || 0) * 0.4)),
          Math.max(10, Math.min(100, (data[15] || 0) * 0.35)),
        ];
        setVisualizerValues(sampled);
      } else {
        setVisualizerValues([12, 12, 12, 12, 12, 12, 12, 12]);
      }
      animFrameRef.current = requestAnimationFrame(updateBars);
    };

    animFrameRef.current = requestAnimationFrame(updateBars);

    return () => {
      active = false;
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    elevatorSynth.setVolume(val);
  };

  const handleNextTrack = () => {
    elevatorSynth.nextTrack();
  };

  return (
    <div className="w-full bg-[#03150D]/90 border-y border-amber-500/25 px-4 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Track Information & Equalizer */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Animated Brass Equalizer */}
          <div className="flex items-end gap-1 h-6 w-16 px-1.5 py-1 bg-black/40 rounded-lg border border-amber-500/30 shrink-0">
            {visualizerValues.map((val, idx) => (
              <span
                key={idx}
                className="w-1 rounded-full transition-all duration-75"
                style={{
                  height: `${isPlaying && !isMuted ? Math.max(15, val) : 15}%`,
                  backgroundColor: idx % 2 === 0 ? '#F59E0B' : '#34D399',
                  opacity: isPlaying && !isMuted ? 0.95 : 0.3,
                }}
              />
            ))}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 font-mono">
                Now Playing
              </span>
              <span className="text-[10px] text-emerald-300/60 font-mono">
                {currentTrack.bpm} BPM Bossa
              </span>
            </div>
            <p className="font-semibold text-amber-200 truncate font-display text-xs sm:text-sm">
              {currentTrack.name}
            </p>
          </div>
        </div>

        {/* Center: Rounded Playback Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#051A12] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause Elevator Music' : 'Play Elevator Music'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>Play Elevator Bossa</span>
              </>
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={handleNextTrack}
            className="p-1.5 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-amber-500/30 text-amber-300 hover:text-amber-100 transition-all active:scale-95"
            title="Next Elevator Track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Track selector dropdown */}
          <select
            value={currentTrack.id}
            onChange={(e) => elevatorSynth.setTrack(e.target.value)}
            className="bg-emerald-950/80 border border-amber-500/30 text-amber-200 text-xs rounded-full px-3 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 hidden lg:block cursor-pointer"
          >
            {ELEVATOR_TRACKS.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#051A12] text-amber-200">
                {t.name}
              </option>
            ))}
          </select>

          {/* Elevator Bell Chime Button */}
          <button
            onClick={onRingChime}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 border border-amber-500/30 transition-all active:scale-95 text-[11px] font-medium"
            title="Ring Elevator Floor Chime"
          >
            <BellRing className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Ding Bell</span>
          </button>
        </div>

        {/* Right: Volume Slider */}
        <div className="hidden sm:flex items-center gap-2 text-amber-300/80">
          <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Elevator music volume"
            className="w-20 h-1.5 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="font-mono text-[10px] w-7 text-right tabular-nums text-amber-200/70">
            {Math.round(volume * 100)}%
          </span>
        </div>

      </div>
    </div>
  );
};
