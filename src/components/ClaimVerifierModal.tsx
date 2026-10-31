import React, { useState } from 'react';
import { X, Check, AlertTriangle, Trophy, Sparkles, Award } from 'lucide-react';
import { WINNING_PATTERNS, TAMBOLA_DATA } from '../data/tambolaPhrases';
import { soundEffects } from '../utils/audioSynthesizer';
import { triggerGrandCelebration } from '../utils/diwaliCrackerBurst';
import { speechAnchor } from '../utils/speechAnchor';

interface ClaimVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  calledNumbers: Set<number>;
  history: number[];
}

export const ClaimVerifierModal: React.FC<ClaimVerifierModalProps> = ({
  isOpen,
  onClose,
  calledNumbers,
  history,
}) => {
  const [selectedPattern, setSelectedPattern] = useState(WINNING_PATTERNS[0].id);
  const [inputNumbers, setInputNumbers] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'success' | 'bogey' | null;
    message: string;
    checkedNumbers: Array<{ num: number; called: boolean; order?: number }>;
  }>({ status: null, message: '', checkedNumbers: [] });

  if (!isOpen) return null;

  const currentPatternObj = WINNING_PATTERNS.find((p) => p.id === selectedPattern) || WINNING_PATTERNS[0];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse input numbers
    const parsed = inputNumbers
      .split(/[\s,]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 1 && n <= 90);

    const uniqueNums = Array.from(new Set(parsed));

    if (uniqueNums.length === 0) {
      setVerificationResult({
        status: 'bogey',
        message: 'Please enter at least one valid number between 1 and 90.',
        checkedNumbers: [],
      });
      soundEffects.playBuzzer();
      return;
    }

    const uncalledList = uniqueNums.filter((n) => !calledNumbers.has(n));
    const checkedDetails = uniqueNums.map((n) => ({
      num: n,
      called: calledNumbers.has(n),
      order: calledNumbers.has(n) ? history.indexOf(n) + 1 : undefined,
    }));

    if (uncalledList.length === 0) {
      // SUCCESS! ALL NUMBERS WERE CALLED
      setVerificationResult({
        status: 'success',
        message: `Mubarak ho! Valid ${currentPatternObj.name} claim! All numbers verified!`,
        checkedNumbers: checkedDetails,
      });
      soundEffects.playSuccessFanfare();
      triggerGrandCelebration();
      speechAnchor.speakCustom(`Badhaai ho! Shabaash, ${currentPatternObj.name} claim verified!`);
    } else {
      // BOGEY!
      setVerificationResult({
        status: 'bogey',
        message: `Bogey claim! The number(s) ${uncalledList.join(', ')} have NOT been called yet!`,
        checkedNumbers: checkedDetails,
      });
      soundEffects.playBuzzer();
      speechAnchor.speakCustom(`Arre nahi! Bogey claim! False call.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#250d38] via-[#1a072c] to-[#10031c] rounded-3xl border-2 border-amber-400/60 shadow-[0_0_50px_rgba(255,183,3,0.4)] p-6 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-900/50 hover:bg-purple-800 text-amber-300 border border-amber-500/30 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-amber-500/20 pb-4">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-amber-200">
              Claim Verification & Checker
            </h3>
            <p className="text-xs text-amber-300/70">
              Verify employee tickets instantly without disputes!
            </p>
          </div>
        </div>

        {/* Claim Pattern Selector */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
            1. Select Prize / Winning Pattern:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {WINNING_PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPattern(p.id);
                  setVerificationResult({ status: null, message: '', checkedNumbers: [] });
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition border ${
                  selectedPattern === p.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-yellow-200 shadow-md'
                    : 'bg-purple-950/40 text-amber-200/80 border-amber-500/20 hover:border-amber-400'
                }`}
              >
                <div>{p.name}</div>
                <div className="text-[10px] opacity-75 font-normal">{p.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Numbers input */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
              2. Enter Ticket Numbers to verify (space or comma separated):
            </label>
            <textarea
              rows={2}
              value={inputNumbers}
              onChange={(e) => setInputNumbers(e.target.value)}
              placeholder="e.g. 7, 22, 45, 68, 90"
              className="w-full px-4 py-2.5 rounded-2xl bg-black/40 border border-amber-500/40 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 text-amber-100 placeholder-amber-200/30 text-base font-mono outline-none resize-none"
            />
            <div className="text-[11px] text-amber-300/60 mt-1">
              Enter the numbers the player claims to have struck.
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:via-orange-400 hover:to-red-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Verify Claim Now</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setInputNumbers('');
                setVerificationResult({ status: null, message: '', checkedNumbers: [] });
              }}
              className="px-4 py-3 rounded-xl bg-purple-950/60 hover:bg-purple-900 text-amber-300 border border-amber-500/30 text-sm font-semibold transition"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Result Display */}
        {verificationResult.status && (
          <div
            className={`mt-4 p-4 rounded-2xl border ${
              verificationResult.status === 'success'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : 'bg-red-950/60 border-red-500 text-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {verificationResult.status === 'success' ? (
                <div className="p-1 rounded-full bg-emerald-500 text-slate-950">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              ) : (
                <div className="p-1 rounded-full bg-red-500 text-white">
                  <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                </div>
              )}
              <div className="flex-1">
                <div className="font-bold text-sm sm:text-base">
                  {verificationResult.message}
                </div>

                {/* Checked pills */}
                {verificationResult.checkedNumbers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {verificationResult.checkedNumbers.map((c) => (
                      <span
                        key={c.num}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                          c.called
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-red-500/30 text-red-300 border-red-500 line-through'
                        }`}
                      >
                        {c.called ? '✓' : '✗'} #{c.num}
                        {c.called && (
                          <span className="text-[10px] font-sans opacity-70">
                            (Call #{c.order})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

