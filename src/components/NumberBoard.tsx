import React, { useState } from 'react';
import { LayoutGrid, Eye, EyeOff, Search } from 'lucide-react';
import { TAMBOLA_DATA } from '../data/tambolaPhrases';

interface NumberBoardProps {
  calledNumbers: Set<number>;
  currentNumber: number | null;
  history: number[];
  onSelectNumber: (num: number) => void;
}

export const NumberBoard: React.FC<NumberBoardProps> = ({
  calledNumbers,
  currentNumber,
  history,
  onSelectNumber,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredNumber, setHoveredNumber] = useState<number | null>(null);

  // Group into 9 rows of 10 numbers (1-10, 11-20, ... 81-90)
  const rows = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 10 }, (_, c) => r * 10 + c + 1)
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-3">
      <div className="rounded-3xl bg-[#180829]/90 border border-amber-500/30 shadow-2xl p-4 sm:p-6 backdrop-blur-md">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base sm:text-lg text-amber-200 tracking-wide">
              Master Tambola Board (1 - 90)
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
              {calledNumbers.size} / 90
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-amber-300 border border-amber-500/30 transition"
              title="Toggle board visibility"
            >
              {collapsed ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Show Board</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide Board</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hovered info strip */}
        {hoveredNumber && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between animate-fadeIn">
            <span className="font-bold text-amber-300">
              #{hoveredNumber}: {TAMBOLA_DATA[hoveredNumber]?.nickname || 'Number ' + hoveredNumber}
            </span>
            <span>
              Hindi: <strong className="text-yellow-300">{TAMBOLA_DATA[hoveredNumber]?.hindiName}</strong> ({TAMBOLA_DATA[hoveredNumber]?.hindi})
            </span>
            <span className={calledNumbers.has(hoveredNumber) ? 'text-emerald-400 font-semibold' : 'text-gray-400'}>
              {calledNumbers.has(hoveredNumber) ? '✓ Already Called' : '⏳ Not yet called'}
            </span>
          </div>
        )}

        {/* The 10x9 Grid */}
        {!collapsed && (
          <div className="grid grid-cols-10 gap-1 sm:gap-2 select-none">
            {rows.flat().map((num) => {
              const isCalled = calledNumbers.has(num);
              const isCurrent = currentNumber === num;
              const callOrder = isCalled ? history.indexOf(num) + 1 : null;

              return (
                <button
                  key={num}
                  onClick={() => onSelectNumber(num)}
                  onMouseEnter={() => setHoveredNumber(num)}
                  onMouseLeave={() => setHoveredNumber(null)}
                  title={`#${num} ${TAMBOLA_DATA[num]?.nickname || ''} ${
                    isCalled ? `(Called #${callOrder})` : '(Not called)'
                  } - Click to announce`}
                  className={`relative aspect-square sm:aspect-auto sm:h-12 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center font-bold text-sm sm:text-base transition-all duration-200 ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-yellow-300 via-amber-400 to-orange-500 text-slate-950 font-black shadow-[0_0_25px_rgba(255,200,0,1)] ring-4 ring-yellow-300 scale-105 z-10 animate-pulse'
                      : isCalled
                      ? 'bg-gradient-to-b from-amber-500/90 to-amber-600/90 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95'
                      : 'bg-purple-950/40 text-purple-200/50 hover:text-white hover:bg-purple-900/60 border border-purple-800/30'
                  }`}
                >
                  <span className={`${isCalled ? 'font-extrabold' : 'font-semibold'}`}>
                    {num}
                  </span>

                  {/* Tiny Devanagari or Call Order mark for called numbers */}
                  {isCalled && !isCurrent && (
                    <span className="hidden sm:block text-[9px] font-semibold text-slate-900/80 -mt-1">
                      {TAMBOLA_DATA[num]?.devanagari || `✓`}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="hidden sm:block text-[9px] font-black uppercase tracking-tight text-slate-950 -mt-1">
                      NOW
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Legend */}
        {!collapsed && (
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-amber-200/80 mt-4 pt-3 border-t border-amber-500/20">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-md bg-gradient-to-tr from-yellow-300 to-orange-500 ring-2 ring-yellow-300" />
              <span>Current Number</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-md bg-gradient-to-b from-amber-500 to-amber-600" />
              <span>Called / Struck</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-md bg-purple-950/40 border border-purple-800/30" />
              <span>Remaining ({90 - calledNumbers.size})</span>
            </div>
            <div className="text-gray-400 italic">
              💡 Tip: Click any number to hear its announcement
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

