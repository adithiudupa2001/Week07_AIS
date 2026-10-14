/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Moon,
  Sun,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Info,
  Check,
  X,
  Layers,
  GraduationCap
} from 'lucide-react';
import { QuadrantId, Stage, TaskStep, GuessFeedback } from './types';
import { QUADRANTS, STAGE_CONFIG, TASK_STEPS } from './data/stepsData';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smu_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smu_theme', 'dark-false');
    }
  }, [isDark]);

  // Placed steps set (stores step IDs)
  const [placedStepIds, setPlacedStepIds] = useState<number[]>([]);

  // Currently focused/selected step for the reason panel
  const [activeStepId, setActiveStepId] = useState<number | null>(null);

  // Guess mode toggle
  const [guessMode, setGuessMode] = useState<boolean>(false);

  // If guess mode is active and user clicked a chip to guess
  const [guessingStepId, setGuessingStepId] = useState<number | null>(null);

  // Guess feedback message
  const [guessFeedback, setGuessFeedback] = useState<GuessFeedback | null>(null);

  // Guess stats
  const [guessStats, setGuessStats] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  // Highlighted step (for visual focus when clicking from chip or quadrant)
  const [highlightedStepId, setHighlightedStepId] = useState<number | null>(null);

  // Handle clicking a chip
  const handleChipClick = (step: TaskStep) => {
    const isAlreadyPlaced = placedStepIds.includes(step.id);

    if (isAlreadyPlaced) {
      // Re-show reason without duplicating
      setActiveStepId(step.id);
      setHighlightedStepId(step.id);
      setGuessFeedback(null);
      return;
    }

    if (guessMode) {
      // Set as step currently being guessed
      setGuessingStepId(step.id);
      setHighlightedStepId(step.id);
      setGuessFeedback(null);
    } else {
      // Direct placement mode
      setPlacedStepIds((prev) => [...prev, step.id]);
      setActiveStepId(step.id);
      setHighlightedStepId(step.id);
      setGuessFeedback(null);
    }
  };

  // Handle clicking a quadrant
  const handleQuadrantClick = (quadrantId: QuadrantId) => {
    if (!guessMode || guessingStepId === null) return;

    const currentStep = TASK_STEPS.find((s) => s.id === guessingStepId);
    if (!currentStep) return;

    const isCorrect = currentStep.quadrantId === quadrantId;
    const guessedQuad = QUADRANTS[quadrantId];

    // Update score
    setGuessStats((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));

    // Record feedback
    setGuessFeedback({
      stepId: currentStep.id,
      stepName: currentStep.name,
      guessedQuadrantId: quadrantId,
      correctQuadrantId: currentStep.quadrantId,
      isCorrect,
      message: isCorrect
        ? `Correct! "${currentStep.name}" belongs in "${currentStep.quadrantName}".`
        : `I'd place it in "${currentStep.quadrantName}" (you guessed "${guessedQuad.title}").`,
    });

    // Place the step into its true quadrant
    setPlacedStepIds((prev) => (prev.includes(currentStep.id) ? prev : [...prev, currentStep.id]));
    setActiveStepId(currentStep.id);
    setHighlightedStepId(currentStep.id);
    setGuessingStepId(null);
  };

  // Show all button
  const handleShowAll = () => {
    const allIds = TASK_STEPS.map((s) => s.id);
    setPlacedStepIds(allIds);
    setGuessingStepId(null);
    if (!activeStepId && TASK_STEPS.length > 0) {
      setActiveStepId(TASK_STEPS[0].id);
      setHighlightedStepId(TASK_STEPS[0].id);
    }
    setGuessFeedback(null);
  };

  // Clear button
  const handleClear = () => {
    setPlacedStepIds([]);
    setActiveStepId(null);
    setHighlightedStepId(null);
    setGuessingStepId(null);
    setGuessFeedback(null);
    setGuessStats({ correct: 0, total: 0 });
  };

  // Find step by active ID
  const activeStep = TASK_STEPS.find((s) => s.id === activeStepId);
  const guessingStep = TASK_STEPS.find((s) => s.id === guessingStepId);

  // Group placed steps by quadrant
  const getQuadrantSteps = (quadrantId: QuadrantId) => {
    return TASK_STEPS.filter(
      (step) => step.quadrantId === quadrantId && placedStepIds.includes(step.id)
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#E2E8F0] transition-colors duration-200">
      {/* Top Academic Navigation Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0D1527]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] dark:bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#1E3A8A] dark:text-blue-400">
                SMU Task Allocation Lab
              </span>
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 ml-2">
                · Human-AI Collaboration Matrix
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Guess First Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
              <label
                htmlFor="guess-toggle"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none flex items-center gap-1.5"
              >
                <span>Guess first</span>
                {guessStats.total > 0 && (
                  <span className="text-[11px] font-mono tabular-nums text-indigo-600 dark:text-indigo-400 font-medium">
                    ({guessStats.correct}/{guessStats.total})
                  </span>
                )}
              </label>
              <input
                id="guess-toggle"
                type="checkbox"
                checked={guessMode}
                onChange={(e) => {
                  setGuessMode(e.target.checked);
                  setGuessingStepId(null);
                }}
                className="w-3.5 h-3.5 text-[#1E3A8A] rounded cursor-pointer accent-[#1E3A8A] dark:accent-blue-500"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* 1. Small uppercase eyebrow label in muted blue */}
        <div className="text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-2">
          PLACE A TASK · YOUR TURN
        </div>

        {/* 2. Large bold heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] dark:text-white tracking-tight leading-tight text-balance mb-3">
          Where would you place each step of the 9 PM inbox task, and who should lead it?
        </h1>

        {/* 3. Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-6">
          Call the quadrant for each step before you click. My placement and its reason appear below.
        </p>

        {/* 4. Trigger Banner with moon icon */}
        <div className="mb-8 rounded-xl bg-slate-900 dark:bg-slate-800/90 text-white px-4 py-3.5 sm:px-5 sm:py-4 shadow-sm flex items-center gap-3.5 border border-slate-800 dark:border-slate-700">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
            <Moon className="w-4 h-4 text-indigo-300 fill-indigo-300/30" />
          </div>
          <div className="text-xs sm:text-sm font-medium leading-snug">
            <span className="font-semibold text-indigo-200">Trigger:</span> every night at 9:00 PM — find emails I missed today and draft replies.
          </div>
        </div>

        {/* Guess Prompt Banner (When Guess Mode is active and waiting for a quadrant click) */}
        <AnimatePresence>
          {guessMode && guessingStep && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 p-4 text-amber-900 dark:text-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-200 dark:bg-amber-900 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0 font-bold text-xs">
                  ?
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    Guess the Quadrant
                  </div>
                  <div className="text-sm font-bold mt-0.5">
                    Where would you place: <span className="underline decoration-amber-500 underline-offset-2">"{guessingStep.name}"</span>?
                  </div>
                  <div className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                    Click one of the 4 quadrants on the grid below.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setGuessingStepId(null)}
                className="self-end sm:self-center text-xs font-medium text-amber-800 dark:text-amber-300 hover:underline px-2 py-1"
              >
                Cancel guess
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Main Card with thin colored left border */}
        <section className="bg-white dark:bg-[#111927] rounded-xl border border-slate-200 dark:border-slate-800 border-l-[4px] border-l-[#1E3A8A] dark:border-l-blue-500 shadow-sm p-4 sm:p-6 lg:p-7 mb-6 relative">
          {/* Header of the main card with Live Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
                <span>The 2×2 Task Allocation Matrix</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluated along Right Answer certainty vs. Collaboration necessity
              </p>
            </div>

            {/* Live Counter */}
            <div className="flex items-center gap-3">
              {guessMode && (
                <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 font-mono tabular-nums">
                  Guesses: {guessStats.correct}/{guessStats.total} correct
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[#0F172A] dark:text-slate-200 text-xs font-bold font-mono tabular-nums border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span>{placedStepIds.length} of 12 placed</span>
              </div>
            </div>
          </div>

          {/* 6. The 2x2 Grid Layout */}
          <div className="space-y-4">
            {/* Desktop Column Headers */}
            <div className="hidden md:grid md:grid-cols-[160px_1fr_1fr] gap-3 pb-1">
              {/* Empty corner above row labels */}
              <div className="flex items-end pb-1 text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400">
                Autonomy / Task
              </div>

              {/* Column 1 Header */}
              <div className="text-center bg-slate-100/80 dark:bg-slate-800/60 py-2 px-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200 tracking-tight">
                  Work with a right answer
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                  Deterministic · Rule-based or ground truth
                </span>
              </div>

              {/* Column 2 Header */}
              <div className="text-center bg-slate-100/80 dark:bg-slate-800/60 py-2 px-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200 tracking-tight">
                  Work with no single right answer
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                  Heuristic · Context, tone & subjective judgment
                </span>
              </div>
            </div>

            {/* ROW 1: Work that people and AI must do together */}
            <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_1fr] gap-3">
              {/* Row Label (Desktop) */}
              <div className="hidden md:flex flex-col justify-center bg-slate-100/80 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-left">
                <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200 leading-snug">
                  Work that people and AI must do together
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  High co-dependence
                </span>
              </div>

              {/* Quadrant 1: Top-Left - A person leads, AI inside (Lavender) */}
              <QuadrantBox
                quadrant={QUADRANTS['person-leads']}
                steps={getQuadrantSteps('person-leads')}
                isGuessTarget={guessMode && guessingStepId !== null}
                onQuadrantClick={() => handleQuadrantClick('person-leads')}
                onStepClick={(step) => {
                  setActiveStepId(step.id);
                  setHighlightedStepId(step.id);
                  setGuessFeedback(null);
                }}
                activeStepId={activeStepId}
                highlightedStepId={highlightedStepId}
              />

              {/* Quadrant 2: Top-Right - Agents run it, a person judges (Light blue-grey) */}
              <QuadrantBox
                quadrant={QUADRANTS['agents-run']}
                steps={getQuadrantSteps('agents-run')}
                isGuessTarget={guessMode && guessingStepId !== null}
                onQuadrantClick={() => handleQuadrantClick('agents-run')}
                onStepClick={(step) => {
                  setActiveStepId(step.id);
                  setHighlightedStepId(step.id);
                  setGuessFeedback(null);
                }}
                activeStepId={activeStepId}
                highlightedStepId={highlightedStepId}
              />
            </div>

            {/* ROW 2: Work that either of them can do alone */}
            <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_1fr] gap-3">
              {/* Row Label (Desktop) */}
              <div className="hidden md:flex flex-col justify-center bg-slate-100/80 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-left">
                <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200 leading-snug">
                  Work that either of them can do alone
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Autonomous execution
                </span>
              </div>

              {/* Quadrant 3: Bottom-Left - AI alone, with checks (Light blue-grey) */}
              <QuadrantBox
                quadrant={QUADRANTS['ai-alone']}
                steps={getQuadrantSteps('ai-alone')}
                isGuessTarget={guessMode && guessingStepId !== null}
                onQuadrantClick={() => handleQuadrantClick('ai-alone')}
                onStepClick={(step) => {
                  setActiveStepId(step.id);
                  setHighlightedStepId(step.id);
                  setGuessFeedback(null);
                }}
                activeStepId={activeStepId}
                highlightedStepId={highlightedStepId}
              />

              {/* Quadrant 4: Bottom-Right - A person decides, AI alongside (Lavender) */}
              <QuadrantBox
                quadrant={QUADRANTS['person-decides']}
                steps={getQuadrantSteps('person-decides')}
                isGuessTarget={guessMode && guessingStepId !== null}
                onQuadrantClick={() => handleQuadrantClick('person-decides')}
                onStepClick={(step) => {
                  setActiveStepId(step.id);
                  setHighlightedStepId(step.id);
                  setGuessFeedback(null);
                }}
                activeStepId={activeStepId}
                highlightedStepId={highlightedStepId}
              />
            </div>
          </div>

          {/* Small Legend for the four stages under the grid */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <span>Four workflow stages:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              {(Object.keys(STAGE_CONFIG) as Stage[]).map((stageKey) => {
                const conf = STAGE_CONFIG[stageKey];
                return (
                  <div key={stageKey} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${conf.dotClass}`} />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {conf.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Reason Panel below the grid with left accent border */}
        <section
          aria-live="polite"
          className="rounded-xl bg-white dark:bg-[#111927] border border-slate-200 dark:border-slate-800 border-l-[4px] border-l-rose-500 dark:border-l-rose-400 p-4 sm:p-5 shadow-xs mb-8 transition-all duration-200"
        >
          {guessFeedback && (
            <div className="mb-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              {guessFeedback.isCorrect ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  <Check className="w-3.5 h-3.5" /> Correct!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                  <Info className="w-3.5 h-3.5" /> Nice try!
                </span>
              )}
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {guessFeedback.message}
              </span>
            </div>
          )}

          {activeStep ? (
            <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Placement Rationale:
              </span>
              <span className="font-bold text-rose-600 dark:text-rose-400 text-base sm:text-lg">
                {activeStep.name}
              </span>{' '}
              <span className="text-slate-400 dark:text-slate-500 font-medium">→</span>{' '}
              <span className="font-bold text-[#0F172A] dark:text-white">
                {activeStep.quadrantName}
              </span>
              . <span className="text-slate-700 dark:text-slate-300">{activeStep.reason}</span>
            </div>
          ) : (
            <div className="text-sm sm:text-base text-slate-500 dark:text-slate-400 italic">
              Call the quadrant first, then click the step to see where I would place it and why.
            </div>
          )}
        </section>

        {/* 8. Row of Task Chips + Show all + Clear buttons */}
        <section className="mb-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Task Steps to Place (12)
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {placedStepIds.length === 12
                ? 'All steps placed'
                : `${12 - placedStepIds.length} remaining`}
            </span>
          </div>

          {/* Chips container */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 items-center">
            {TASK_STEPS.map((step) => {
              const isPlaced = placedStepIds.includes(step.id);
              const isGuessing = guessingStepId === step.id;
              const isFocused = highlightedStepId === step.id;
              const stageConf = STAGE_CONFIG[step.stage];

              return (
                <button
                  key={step.id}
                  onClick={() => handleChipClick(step)}
                  className={`group relative text-xs sm:text-sm font-medium rounded-full px-3.5 py-1.5 sm:py-2 transition-all duration-150 flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${
                    isPlaced
                      ? `${stageConf.activeChipClass} ring-1 ring-black/5`
                      : isGuessing
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-2 border-amber-500 animate-pulse'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-2xs'
                  } ${isFocused && isPlaced ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                  title={
                    isPlaced
                      ? `Placed in: ${step.quadrantName}. Click to inspect reasoning.`
                      : guessMode
                      ? `Click to guess quadrant for: ${step.name}`
                      : `Click to place: ${step.name}`
                  }
                >
                  {/* Stage indicator dot */}
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isPlaced ? 'bg-white/90' : stageConf.dotClass
                    }`}
                  />
                  <span>
                    <strong className="font-semibold">{step.stage}</strong> · {step.name}
                  </span>
                  {isPlaced && (
                    <Check className="w-3.5 h-3.5 opacity-80 shrink-0 stroke-[2.5]" />
                  )}
                </button>
              );
            })}

            {/* Action buttons: Show all & Clear */}
            <div className="flex items-center gap-2 ml-auto pt-2 sm:pt-0">
              <button
                onClick={handleShowAll}
                disabled={placedStepIds.length === 12}
                className="px-4 py-1.5 sm:py-2 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs sm:text-sm font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                Show all
              </button>
              <button
                onClick={handleClear}
                disabled={placedStepIds.length === 0}
                className="px-4 py-1.5 sm:py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </section>

        {/* 9. Small italic footnote */}
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
          Click a step to place it, or Show all. Placements are my own, for discussion.
        </p>
      </main>
    </div>
  );
}

// Quadrant Box Subcomponent
interface QuadrantBoxProps {
  quadrant: {
    id: QuadrantId;
    title: string;
    rowLabel: string;
    colLabel: string;
    bgClass: string;
    borderClass: string;
    badgeBg: string;
  };
  steps: TaskStep[];
  isGuessTarget: boolean;
  onQuadrantClick: () => void;
  onStepClick: (step: TaskStep) => void;
  activeStepId: number | null;
  highlightedStepId: number | null;
}

function QuadrantBox({
  quadrant,
  steps,
  isGuessTarget,
  onQuadrantClick,
  onStepClick,
  activeStepId,
  highlightedStepId,
}: QuadrantBoxProps) {
  return (
    <div
      onClick={isGuessTarget ? onQuadrantClick : undefined}
      className={`rounded-xl p-3.5 sm:p-4 border min-h-[170px] sm:min-h-[190px] flex flex-col justify-between transition-all duration-200 relative ${
        quadrant.bgClass
      } ${quadrant.borderClass} ${
        isGuessTarget
          ? 'cursor-pointer ring-2 ring-amber-400/80 hover:ring-amber-500 hover:scale-[1.008] shadow-md dark:ring-amber-400/60'
          : ''
      }`}
    >
      {/* Mobile/Tablet Context Badges (shown only when columns collapse on small screens) */}
      <div className="md:hidden flex flex-wrap gap-1.5 mb-2.5 pb-2 border-b border-black/5 dark:border-white/5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span className="bg-white/70 dark:bg-black/30 px-1.5 py-0.5 rounded">
          {quadrant.rowLabel}
        </span>
        <span>·</span>
        <span className="bg-white/70 dark:bg-black/30 px-1.5 py-0.5 rounded">
          {quadrant.colLabel}
        </span>
      </div>

      {/* Top Header of Quadrant: Title in bold at top-left */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-bold text-xs sm:text-sm text-[#0F172A] dark:text-slate-100 tracking-tight leading-snug">
          {quadrant.title}
        </h3>

        {/* Counter badge for quadrant */}
        {steps.length > 0 && (
          <span className="text-[11px] font-mono tabular-nums font-bold px-1.5 py-0.5 rounded bg-white/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 shrink-0">
            {steps.length}
          </span>
        )}
      </div>

      {/* Guess Target Prompt Overlay when Guessing */}
      {isGuessTarget && (
        <div className="mb-2 p-1.5 rounded-md bg-amber-500/10 border border-dashed border-amber-500/40 text-center text-xs font-semibold text-amber-800 dark:text-amber-300">
          Click here to guess this quadrant
        </div>
      )}

      {/* List of Placed Steps inside the Quadrant */}
      <div className="space-y-1.5 flex-1">
        <AnimatePresence>
          {steps.map((step) => {
            const stageConf = STAGE_CONFIG[step.stage];
            const isHighlighted = highlightedStepId === step.id;

            return (
              <motion.button
                key={step.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onStepClick(step);
                }}
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full text-left p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-800 dark:text-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-start gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isHighlighted
                    ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40'
                    : ''
                }`}
                title="Click to view placement reasoning"
              >
                {/* Dot matching the stage color */}
                <span
                  className={`w-2 h-2 rounded-full mt-1 shrink-0 ${stageConf.dotClass}`}
                />
                <span className="leading-snug">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    {step.stage}
                  </span>{' '}
                  · {step.name}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {steps.length === 0 && !isGuessTarget && (
          <div className="h-full min-h-[70px] flex items-center justify-center text-center text-xs text-slate-600 dark:text-slate-400 border border-dashed border-slate-300/60 dark:border-slate-800/60 rounded-lg">
            Empty
          </div>
        )}
      </div>
    </div>
  );
}
