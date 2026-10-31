import React, { useState, useEffect } from 'react';
import { X, Volume2, Mic, Settings as SettingsIcon, AlertCircle, RefreshCw, Sparkles, Keyboard } from 'lucide-react';
import { speechAnchor, SpeechStyle } from '../utils/speechAnchor';
import { soundEffects } from '../utils/audioSynthesizer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  soundFxEnabled: boolean;
  onToggleSoundFx: () => void;
  onResetGame: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  voiceEnabled,
  onToggleVoice,
  soundFxEnabled,
  onToggleSoundFx,
  onResetGame,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(speechAnchor.selectedVoiceURI);
  const [speechStyle, setSpeechStyle] = useState<SpeechStyle>(speechAnchor.speechStyle);
  const [speechRate, setSpeechRate] = useState<number>(speechAnchor.speechRate);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const updateVoices = () => {
      setVoices(speechAnchor.getAvailableVoices());
    };
    updateVoices();
    speechAnchor.registerOnVoicesLoaded(updateVoices);
  }, []);

  if (!isOpen) return null;

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uri = e.target.value;
    setSelectedVoice(uri);
    speechAnchor.selectedVoiceURI = uri;
  };

  const handleStyleChange = (style: SpeechStyle) => {
    setSpeechStyle(style);
    speechAnchor.speechStyle = style;
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    setSpeechRate(rate);
    speechAnchor.speechRate = rate;
  };

  const testVoice = () => {
    speechAnchor.speak(7);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#250d38] via-[#1a072c] to-[#10031c] rounded-3xl border-2 border-amber-400/60 shadow-[0_0_50px_rgba(255,183,3,0.4)] p-6 max-h-[90vh] overflow-y-auto">
        
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
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-amber-200">
              Anchor & Sound Settings
            </h3>
            <p className="text-xs text-amber-300/70">
              Customize Indian voice announcer, rhymes, and audio
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Audio Toggles */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onToggleVoice}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition text-left ${
                voiceEnabled
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-black/30 border-purple-800/40 text-gray-400'
              }`}
            >
              <Mic className={`w-5 h-5 ${voiceEnabled ? 'text-amber-400' : 'text-gray-500'}`} />
              <div>
                <div className="font-bold text-sm">Voice Calling</div>
                <div className="text-[11px] opacity-75">{voiceEnabled ? 'Enabled' : 'Muted'}</div>
              </div>
            </button>

            <button
              type="button"
              onClick={onToggleSoundFx}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition text-left ${
                soundFxEnabled
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-black/30 border-purple-800/40 text-gray-400'
              }`}
            >
              <Volume2 className={`w-5 h-5 ${soundFxEnabled ? 'text-amber-400' : 'text-gray-500'}`} />
              <div>
                <div className="font-bold text-sm">Festive Sound FX</div>
                <div className="text-[11px] opacity-75">{soundFxEnabled ? 'Crackers/Chimes ON' : 'Off'}</div>
              </div>
            </button>
          </div>

          {/* Voice Anchor Style */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Calling Style & Tone:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'hinglish', label: '🎉 Desi Bollywood / Hinglish', desc: 'High energy, rhymes & Hindi names' },
                { id: 'indian_english', label: '🇮🇳 Indian English (Tambola)', desc: 'Clear numbers + classic nicknames' },
                { id: 'hindi_primary', label: '🪔 Pure Hindi Dhamaka', desc: 'Hindi numbers (Ek, Do, Teen...)' },
                { id: 'quick_number', label: '⚡ Fast / Crisp Calling', desc: 'Direct digits without extra rhymes' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleStyleChange(style.id as SpeechStyle)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    speechStyle === style.id
                      ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 border-amber-400 text-yellow-200 shadow-sm'
                      : 'bg-purple-950/30 border-purple-800/40 text-amber-200/70 hover:border-amber-500/40'
                  }`}
                >
                  <div className="text-xs font-bold">{style.label}</div>
                  <div className="text-[10px] opacity-75">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selector Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Select Indian / Browser Voice:
              </label>
              <button
                type="button"
                onClick={testVoice}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Test Voice Sample
              </button>
            </div>
            <select
              value={selectedVoice}
              onChange={handleVoiceChange}
              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-amber-500/40 text-amber-100 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            >
              <option value="">Auto-Detect Indian Accent (Recommended)</option>
              {voices.map((v) => {
                const isIndian =
                  v.lang.includes('IN') ||
                  v.name.toLowerCase().includes('india') ||
                  v.name.toLowerCase().includes('hindi');
                return (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {isIndian ? '🇮🇳 ' : ''}
                    {v.name} ({v.lang})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Speed slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
              <span>Speech Speed:</span>
              <span className="font-mono text-yellow-400">{speechRate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={speechRate}
              onChange={handleRateChange}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-amber-300/60 mt-1">
              <span>Slower / Clear</span>
              <span>Normal</span>
              <span>Fast Pace</span>
            </div>
          </div>

          {/* Keyboard Shortcuts Guide */}
          <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/20 text-xs text-amber-200/90">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 uppercase text-[11px] mb-2">
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
              <div><kbd className="px-1.5 py-0.5 rounded bg-amber-900/60 font-mono text-amber-300 border border-amber-500/30">SPACE</kbd> Next Number</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-amber-900/60 font-mono text-amber-300 border border-amber-500/30">R</kbd> Repeat Voice</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-amber-900/60 font-mono text-amber-300 border border-amber-500/30">A</kbd> Auto-Play</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-amber-900/60 font-mono text-amber-300 border border-amber-500/30">F</kbd> Fullscreen</div>
            </div>
          </div>

          {/* Reset Game Section */}
          <div className="pt-3 border-t border-amber-500/20">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-300 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Start New Game / Reset Board</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500 text-center animate-fadeIn">
                <div className="flex items-center justify-center gap-1 text-red-200 font-bold text-xs mb-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>Are you sure? This will wipe the current board!</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetGame();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                  >
                    Yes, Reset Game
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 rounded-lg bg-purple-900 hover:bg-purple-800 text-gray-200 font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

