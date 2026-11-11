import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, X, ArrowRight, RotateCcw, Award, Lightbulb, Sparkles, Building, ChevronRight } from 'lucide-react';
import { TriviaQuestion, TRIVIA_QUESTIONS } from '../data/hairlessData';
import { elevatorSynth } from '../audio/elevatorSynth';
import { FloorIndicator } from './FloorIndicator';

interface TriviaGameProps {
  onAddCoins: (amount: number) => void;
  coins: number;
}

export const TriviaGame: React.FC<TriviaGameProps> = ({ onAddCoins, coins }) => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [gameState, setGameState] = useState<'PLAYING' | 'FLOOR_TRANSITION' | 'GAME_OVER' | 'VICTORY'>('PLAYING');
  const [sessionCoins, setSessionCoins] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // Initialize randomized 10-floor question run
  const startNewGame = () => {
    // Pick 10 varied questions: 3 Ground Floor, 4 Mezzanine, 3 Penthouse
    const easy = [...TRIVIA_QUESTIONS.filter(q => q.difficulty === 'Ground Floor')].sort(() => Math.random() - 0.5).slice(0, 3);
    const med = [...TRIVIA_QUESTIONS.filter(q => q.difficulty === 'Mezzanine')].sort(() => Math.random() - 0.5).slice(0, 4);
    const hard = [...TRIVIA_QUESTIONS.filter(q => q.difficulty === 'Penthouse')].sort(() => Math.random() - 0.5).slice(0, 3);
    
    // Combine in ascending difficulty
    const deck = [...easy, ...med, ...hard];
    setQuestions(deck);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setLives(3);
    setStreak(0);
    setSessionCoins(0);
    setCorrectAnswersCount(0);
    setGameState('PLAYING');

    // Play initial elevator ding
    elevatorSynth.playElevatorChime('single');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered || gameState !== 'PLAYING' || !currentQ) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      elevatorSynth.playCorrectSound();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setCorrectAnswersCount(prev => prev + 1);

      // Award coins based on streak
      const earned = 100 + (newStreak * 25);
      setSessionCoins(prev => prev + earned);
      onAddCoins(earned);

      // Play streak celebration on 3, 5, 8
      if (newStreak % 3 === 0) {
        elevatorSynth.playStreakSound();
      }
    } else {
      elevatorSynth.playWrongSound();
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);
    }
  };

  const handleNextFloor = () => {
    if (!currentQ) return;

    if (lives <= 0) {
      setGameState('GAME_OVER');
      return;
    }

    if (currentIndex >= questions.length - 1) {
      // Reached Penthouse!
      setGameState('VICTORY');
      elevatorSynth.playElevatorChime('double');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#FEF08A', '#059669'],
      });
      return;
    }

    // Floor transition animation
    setGameState('FLOOR_TRANSITION');
    elevatorSynth.playElevatorChime('single');

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setGameState('PLAYING');
    }, 600);
  };

  if (!currentQ && gameState === 'PLAYING') {
    return (
      <div className="text-center py-20">
        <p className="text-amber-300">Summoning the gilded lift...</p>
      </div>
    );
  }

  // --- VICTORY SCREEN ---
  if (gameState === 'VICTORY') {
    const accuracy = Math.round((correctAnswersCount / questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-b from-[#093627] to-[#041A11] border-2 border-amber-400/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-600 flex items-center justify-center text-[#051A12] shadow-xl shadow-amber-950/60 ring-4 ring-amber-300/40">
            <Award className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono tracking-widest text-amber-300 uppercase block mb-1">
            Penthouse Reached · Top Floor
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display gold-gradient-text mb-4">
            The Grand Penthouse Champion!
          </h2>
          <p className="text-sm sm:text-base text-emerald-200/90 max-w-xl mx-auto mb-8">
            You successfully navigated all 10 floors of hairless animal curiosities! From subterranean mole-rats to ocean cetaceans, your smooth fauna mastery is unmatched.
          </p>

          {/* Victory stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-8">
            <div className="bg-[#03150D]/80 border border-amber-500/25 rounded-2xl p-3.5">
              <span className="text-[11px] text-amber-200/60 block">Floors Ascended</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300">10 / 10</span>
            </div>
            <div className="bg-[#03150D]/80 border border-amber-500/25 rounded-2xl p-3.5">
              <span className="text-[11px] text-amber-200/60 block">Accuracy</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300">{accuracy}%</span>
            </div>
            <div className="bg-[#03150D]/80 border border-amber-500/25 rounded-2xl p-3.5">
              <span className="text-[11px] text-amber-200/60 block">Best Streak</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300">{maxStreak}x</span>
            </div>
            <div className="bg-[#03150D]/80 border border-amber-500/25 rounded-2xl p-3.5">
              <span className="text-[11px] text-amber-200/60 block">Coins Won</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300">+{sessionCoins}</span>
            </div>
          </div>

          {/* Rounded Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={startNewGame}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#051A12] font-bold text-sm shadow-xl shadow-amber-900/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ride the Lift Again</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // --- GAME OVER SCREEN (LIFT STALLED) ---
  if (gameState === 'GAME_OVER') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-b from-[#1a1c15] to-[#0d160f] border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl text-center">
          
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg">
            <Building className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono tracking-widest text-red-400 uppercase block mb-1">
            Lift Emergency Brake Engaged
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-amber-200 mb-3">
            Stalled on Floor {currentIndex + 1}
          </h2>
          <p className="text-sm text-emerald-200/80 max-w-md mx-auto mb-6">
            All three elevator safety cables snapped under the weight of challenging hairless trivia questions. The technician has reset the shaft!
          </p>

          <div className="flex items-center justify-center gap-6 mb-8 text-sm text-amber-200/90 font-mono">
            <div>Floors Cleared: <span className="font-bold text-amber-400">{currentIndex}</span></div>
            <div>Coins Kept: <span className="font-bold text-amber-400">+{sessionCoins}</span></div>
          </div>

          <button
            onClick={startNewGame}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-[#051A12] font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Call New Elevator</span>
          </button>

        </div>
      </div>
    );
  }

  // --- ACTIVE QUIZ QUESTION SCREEN ---
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
      
      {/* Elevator Floor Progress Header */}
      <FloorIndicator
        currentFloor={currentIndex + 1}
        totalFloors={questions.length}
        lives={lives}
        streak={streak}
      />

      {/* Main Trivia Card */}
      <div className="bg-gradient-to-b from-[#082D20] via-[#052117] to-[#041910] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative transition-all">
        
        {/* Category & Focus Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-500/15 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-400/90 font-medium font-mono uppercase tracking-wider text-[11px]">
              {currentQ.category}
            </span>
            <span className="text-emerald-400/40">·</span>
            <span className="text-emerald-200/70">
              Focus: <strong className="text-amber-200 font-semibold">{currentQ.animalFocus}</strong>
            </span>
          </div>

          <div className="text-[11px] font-mono text-amber-300/80 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            {currentQ.difficulty}
          </div>
        </div>

        {/* Question Prompt */}
        <h3 className="text-xl sm:text-2xl md:text-2xl font-bold font-display text-amber-100 mb-6 leading-snug">
          {currentQ.question}
        </h3>

        {/* 4 Rounded Option Buttons */}
        <div className="grid grid-cols-1 gap-3 sm:gap-3.5 mb-6">
          {currentQ.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            let btnStyle = 'bg-[#041E14]/90 hover:bg-[#072C1E] border-amber-500/25 text-amber-100 hover:border-amber-400/60';
            let icon = null;

            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                btnStyle = 'bg-emerald-900/90 border-emerald-400 text-amber-100 shadow-[0_0_15px_rgba(52,211,153,0.3)] ring-1 ring-emerald-300';
                icon = <Check className="w-5 h-5 text-emerald-300 shrink-0" />;
              } else if (idx === selectedOption) {
                btnStyle = 'bg-red-950/80 border-red-500/60 text-red-200';
                icon = <X className="w-5 h-5 text-red-400 shrink-0" />;
              } else {
                btnStyle = 'bg-[#03150D]/50 border-emerald-950 text-emerald-400/40 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 text-sm sm:text-base font-medium shadow-md cursor-pointer ${btnStyle} active:scale-[0.99]`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                    isAnswered && idx === currentQ.correctIndex
                      ? 'bg-emerald-400 text-[#051A12]'
                      : isAnswered && idx === selectedOption
                      ? 'bg-red-400 text-[#051A12]'
                      : 'bg-emerald-950 border border-amber-500/30 text-amber-300'
                  }`}>
                    {letter}
                  </span>
                  <span>{option}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Explanation & Floor Advancement Banner */}
        {isAnswered && (
          <div className="mt-6 pt-5 border-t border-amber-500/20 animate-fadeIn">
            <div className="bg-[#03170E] border border-amber-500/30 rounded-2xl p-4 sm:p-5 mb-5 shadow-inner">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-300 mb-1">
                    {selectedOption === currentQ.correctIndex ? 'DING! Correct Floor Fact' : 'Elevator Archives Note'}
                  </h4>
                  <p className="text-sm text-emerald-100/90 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Rounded Next Floor CTA Button */}
            <div className="flex justify-end">
              <button
                onClick={handleNextFloor}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#051A12] font-bold text-sm shadow-lg shadow-amber-950/50 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {currentIndex >= questions.length - 1
                    ? 'Step Out to Penthouse'
                    : `Ascend to Floor ${currentIndex + 2}`}
                </span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
