import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Timer, Zap, Play, RotateCcw, Check, X, Trophy } from 'lucide-react';
import { TriviaQuestion, TRIVIA_QUESTIONS } from '../data/hairlessData';
import { elevatorSynth } from '../audio/elevatorSynth';

interface SpeedRunGameProps {
  onAddCoins: (coins: number) => void;
}

export const SpeedRunGame: React.FC<SpeedRunGameProps> = ({ onAddCoins }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [shuffledDeck, setShuffledDeck] = useState<TriviaQuestion[]>([]);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('hairless_speedrun_high') || '0', 10);
  });

  const timerRef = useRef<number | null>(null);

  const startExpressLift = () => {
    const randomized = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledDeck(randomized);
    setQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setLastFeedback(null);
    elevatorSynth.playElevatorChime('double');
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, score]);

  const handleGameOver = () => {
    setIsPlaying(false);
    elevatorSynth.playElevatorChime('single');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('hairless_speedrun_high', score.toString());
      confetti({
        particleCount: 80,
        spread: 70,
        colors: ['#F59E0B', '#34D399', '#FDE047'],
      });
    }
    onAddCoins(score * 10);
  };

  const handleAnswer = (optionIdx: number) => {
    if (!isPlaying) return;
    const currentQ = shuffledDeck[questionIndex];
    if (!currentQ) return;

    if (optionIdx === currentQ.correctIndex) {
      elevatorSynth.playCorrectSound();
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      setTimeLeft((t) => Math.min(99, t + 3)); // +3s bonus
      setLastFeedback('correct');
    } else {
      elevatorSynth.playWrongSound();
      setStreak(0);
      setTimeLeft((t) => Math.max(0, t - 2)); // -2s penalty
      setLastFeedback('wrong');
    }

    // Move to next question immediately
    if (questionIndex + 1 < shuffledDeck.length) {
      setQuestionIndex((i) => i + 1);
    } else {
      // Loop deck
      setShuffledDeck([...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5));
      setQuestionIndex(0);
    }

    setTimeout(() => {
      setLastFeedback(null);
    }, 400);
  };

  const currentQ = shuffledDeck[questionIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      
      {/* Top Banner: High Score & Mode Title */}
      <div className="bg-gradient-to-r from-[#082C1F] to-[#041A11] border border-amber-500/30 rounded-3xl p-5 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
              Express Lift · 60s Blitz
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-amber-100">
            Speed Run Through the Hairless Towers
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#03150D] border border-amber-500/30 text-amber-300 font-mono text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Best: <strong className="text-amber-200">{highScore}</strong></span>
          </div>
        </div>
      </div>

      {!isPlaying ? (
        // Start / Result Screen
        <div className="bg-gradient-to-b from-[#082E21] to-[#041910] border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-[#051A12] shadow-lg ring-4 ring-amber-300/30">
            <Timer className="w-8 h-8" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold font-display text-amber-100 mb-3">
            {score > 0 ? 'Express Lift Concluded!' : 'The 60-Second Express Lift'}
          </h3>

          <p className="text-sm text-emerald-200/80 max-w-md mx-auto mb-6">
            Answer as many bald and hairless creature questions as possible in 60 seconds! Correct answers add <span className="text-amber-300 font-bold">+3 seconds</span> to the clock.
          </p>

          {score > 0 && (
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8 font-mono">
              <div className="bg-[#03150D] border border-amber-500/25 rounded-2xl p-3">
                <span className="text-[11px] text-amber-200/60 block">Questions Solved</span>
                <span className="text-2xl font-bold text-amber-300">{score}</span>
              </div>
              <div className="bg-[#03150D] border border-amber-500/25 rounded-2xl p-3">
                <span className="text-[11px] text-amber-200/60 block">Gilded Coins</span>
                <span className="text-2xl font-bold text-amber-300">+{score * 10}</span>
              </div>
            </div>
          )}

          <button
            onClick={startExpressLift}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#051A12] font-bold text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{score > 0 ? 'Launch Express Lift Again' : 'Start Express Lift'}</span>
          </button>
        </div>
      ) : (
        // Active Blitz Screen
        <div className="bg-gradient-to-b from-[#082E21] via-[#052117] to-[#041910] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          
          {/* Blitz HUD */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-500/20">
            {/* Countdown Clock */}
            <div className="flex items-center gap-2">
              <div className={`px-4 py-1.5 rounded-full font-mono font-bold text-lg flex items-center gap-2 border transition-colors ${
                timeLeft <= 10
                  ? 'bg-red-950/90 border-red-500 text-red-300 animate-pulse'
                  : 'bg-[#03150D] border-amber-500/40 text-amber-300'
              }`}>
                <Timer className="w-4 h-4 text-amber-400" />
                <span className="tabular-nums">{timeLeft}s</span>
              </div>
            </div>

            {/* Score & Streak */}
            <div className="flex items-center gap-3 text-sm font-mono">
              <span className="px-3 py-1.5 rounded-full bg-[#03150D] border border-amber-500/30 text-amber-300">
                Score: <strong className="text-amber-400 font-bold">{score}</strong>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#03150D] border border-amber-500/30 text-amber-300">
                Streak: <strong className="text-amber-400 font-bold">{streak}x</strong>
              </span>
            </div>
          </div>

          {/* Question Text */}
          {currentQ && (
            <>
              <div className="mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/80">
                  {currentQ.animalFocus} · {currentQ.category}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-amber-100 mb-6 min-h-[56px]">
                {currentQ.question}
              </h3>

              {/* 4 Quick-Fire Rounded Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="p-4 rounded-2xl bg-[#041E14] hover:bg-[#083525] border border-amber-500/25 hover:border-amber-400 text-left text-sm font-medium text-amber-100 transition-all active:scale-95 shadow-md flex items-center gap-3 cursor-pointer"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-950 border border-amber-500/30 text-amber-300 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Flash Feedback Indicator */}
          {lastFeedback && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold animate-fadeIn shadow-lg">
              {lastFeedback === 'correct' ? (
                <div className="bg-emerald-900 border border-emerald-400 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>+3s!</span>
                </div>
              ) : (
                <div className="bg-red-950 border border-red-500 text-red-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5 text-red-400" />
                  <span>-2s</span>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
