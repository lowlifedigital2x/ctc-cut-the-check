import React, { useState, useEffect } from 'react';
import {
  Rocket,
  CheckCircle2,
  Radio,
  Sparkles,
  ShieldCheck,
  Disc3,
  Award,
  Crown,
  Volume2,
  X
} from 'lucide-react';
import ctcEagleDiamondImg from '../../assets/images/ctc_eagle_diamond.jpg';

interface LaunchCountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchComplete: () => void;
  missionName: string;
  selectedPlatformsCount: number;
}

export const LaunchCountdownModal: React.FC<LaunchCountdownModalProps> = ({
  isOpen,
  onClose,
  onLaunchComplete,
  missionName,
  selectedPlatformsCount
}) => {
  const [countdown, setCountdown] = useState(10);
  const [stage, setStage] = useState('Initializing Codec Handshake...');
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(10);
      setIsLaunched(false);
      setStage('Initializing Codec Handshake...');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLaunched(true);
          onLaunchComplete();
          return 0;
        }

        const nextVal = prev - 1;
        if (nextVal > 7) setStage('Locking 1080p60 Hardware Encoders...');
        else if (nextVal > 5) setStage(`Firing ${selectedPlatformsCount} Syndicated RTMP Relays...`);
        else if (nextVal > 3) setStage('Arming Official CTC Eagle Broadcast Watermark...');
        else if (nextVal > 1) setStage('Initializing Automated Cut The Check Escrow Ledger...');
        else setStage('GLOBAL SYNCHRONIZATION IMMINENT...');

        return nextVal;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, selectedPlatformsCount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl plaque-gold p-6 sm:p-8 rounded-3xl border-2 border-amber-400 shadow-2xl text-center overflow-hidden">
        
        {/* Ambient Grooved Record Watermark in Background */}
        <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full grooved-record-disc opacity-20 pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full grooved-record-disc opacity-20 pointer-events-none" />

        {/* Close Button (only before launch or after completed) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center Official CTC Eagle Diamond Medallion */}
        <div className="relative mx-auto mb-4 w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 shadow-2xl flex items-center justify-center">
          <img
            src={ctcEagleDiamondImg}
            alt="CTC Eagle Medallion"
            className="w-full h-full object-cover rounded-full"
          />
          {countdown > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 animate-ping" />
          )}
        </div>

        {!isLaunched ? (
          <div>
            <div className="inline-block engraved-plate-gold text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded shadow-sm mb-3">
              MISSION CONTROL • GLOBAL LAUNCH COUNTDOWN
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
              {missionName}
            </h3>

            {/* Giant T-Minus Countdown Display */}
            <div className="my-6">
              <div className="text-6xl sm:text-7xl font-black font-mono text-gold-gradient tracking-tight drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]">
                T-{countdown}s
              </div>
              <p className="text-xs font-mono font-bold text-amber-300 mt-2 uppercase tracking-wider animate-pulse">
                {stage}
              </p>
            </div>

            {/* Stage Progress Pills */}
            <div className="grid grid-cols-4 gap-2 my-5 text-left">
              {[
                { label: 'Encoders', pass: countdown <= 8 },
                { label: 'Relays', pass: countdown <= 6 },
                { label: 'Watermark', pass: countdown <= 4 },
                { label: 'Escrow', pass: countdown <= 2 }
              ].map((s, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border text-center transition ${
                    s.pass
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase block">{s.label}</span>
                  <span className="text-[9px] font-mono">{s.pass ? 'ACTIVE' : 'ARMED'}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-zinc-400">
              Synchronizing with {selectedPlatformsCount} destinations simultaneously. Zero packet loss tolerance enforced.
            </p>
          </div>
        ) : (
          /* Post-Launch Celebration Confirmation */
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <div className="inline-block engraved-plate-platinum text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded shadow-sm">
              🚀 LAUNCH SUCCESSFUL • TRANSMITTING GLOBALLY
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase text-diamond-gradient">
              ALL CHANNELS ONLINE
            </h3>

            <p className="text-xs text-amber-200 font-mono">
              The broadcast engine and music release catalog are now live across all {selectedPlatformsCount} streaming networks.
            </p>

            <div className="p-4 rounded-xl bg-black/60 border border-amber-500/30 text-left text-xs space-y-1.5 my-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Mission:</span>
                <span className="font-bold text-white font-mono">{missionName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Telemetry CCV:</span>
                <span className="font-bold text-emerald-400 font-mono">18,450 Live Viewers Arriving</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Certified Watermark:</span>
                <span className="font-bold text-amber-300 font-mono">CTC Eagle Medallion Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">New Milestone Earned:</span>
                <span className="font-bold text-sky-300 font-mono">🏆 Launch Day Pioneer Plaque Ready</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="deal-btn-gold px-6 py-2.5 rounded-xl text-xs font-black shadow-xl"
            >
              Enter Live Mission Telemetry →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
