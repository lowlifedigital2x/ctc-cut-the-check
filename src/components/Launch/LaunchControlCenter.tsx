import React, { useState } from 'react';
import {
  Rocket,
  Radio,
  Send,
  Sparkles,
  Music,
  Video,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Crown,
  Award,
  Zap,
  Activity,
  ArrowRight,
  TrendingUp,
  Disc3,
  Flame,
  ExternalLink
} from 'lucide-react';
import { MultiStreamState, PlatformConnection, PlatformId, SubscriptionTierId } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { PreFlightDiagnostics } from './PreFlightDiagnostics';
import { LaunchCountdownModal } from './LaunchCountdownModal';
import ctcEagleDiamondImg from '../../assets/images/ctc_eagle_diamond.jpg';

interface LaunchControlCenterProps {
  streamState: MultiStreamState;
  onToggleStream: () => void;
  connections: PlatformConnection[];
  onNavigateToTab: (tab: string) => void;
  subscriptionTier?: SubscriptionTierId;
}

export type LaunchProfile = 'omni_drop' | 'music_release' | 'simulcast_live';

export const LaunchControlCenter: React.FC<LaunchControlCenterProps> = ({
  streamState,
  onToggleStream,
  connections,
  onNavigateToTab,
  subscriptionTier = 'paid'
}) => {
  const [profile, setProfile] = useState<LaunchProfile>('omni_drop');
  const [missionTitle, setMissionTitle] = useState('Midnight Frequency – Global Deluxe Drop & Live Studio Jam');
  const [isArmed, setIsArmed] = useState(false);
  const [isCountdownOpen, setIsCountdownOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<PlatformId, boolean>>({
    youtube: true,
    spotify: true,
    tiktok: true,
    kick: true,
    applemusic: true,
    amazonmusic: true,
    soundcloud: true,
    facebook: true,
    instagram: true,
    twitter: false,
    twitch: false,
    rumble: false,
    linkedin: false,
    custom_rtmp: false
  });

  const [hasLaunchedRecently, setHasLaunchedRecently] = useState(false);

  const selectedCount = Object.values(selectedPlatforms).filter(Boolean).length;

  const handleSelectAllPlatforms = () => {
    const updated: any = {};
    (Object.keys(PLATFORM_CONFIGS) as PlatformId[]).forEach((p) => {
      updated[p] = true;
    });
    setSelectedPlatforms(updated);
  };

  const handleSelectMusicOnly = () => {
    const musicOnly: PlatformId[] = ['spotify', 'applemusic', 'amazonmusic', 'soundcloud', 'youtube', 'tiktok'];
    const updated: any = {};
    (Object.keys(PLATFORM_CONFIGS) as PlatformId[]).forEach((p) => {
      updated[p] = musicOnly.includes(p);
    });
    setSelectedPlatforms(updated);
  };

  const handleTogglePlatform = (p: PlatformId) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [p]: !prev[p]
    }));
  };

  const handleTriggerLaunch = () => {
    if (!isArmed) return;
    setIsCountdownOpen(true);
  };

  const handleLaunchCompleted = () => {
    if (!streamState.isBroadcasting) {
      onToggleStream();
    }
    setHasLaunchedRecently(true);
  };

  return (
    <div className="space-y-6">
      {/* Launch Control Banner Header */}
      <div className="plaque-gold p-6 lg:p-8 relative overflow-hidden">
        {/* Ambient Grooved Record Watermark */}
        <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full grooved-record-disc opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 shadow-xl flex items-center justify-center">
              <img
                src={ctcEagleDiamondImg}
                alt="CTC Eagle Medallion"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
                  Launch Control Command Center
                </h1>
                <span className="engraved-plate-gold text-[9px] uppercase font-black px-2.5 py-0.5 rounded shadow-sm">
                  GLOBAL DROP SYSTEM
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-1 max-w-xl">
                Execute synchronized multi-DSP music drops, premiere videos, and ignite simultaneous live broadcasts with zero drop frame telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-black/60 border border-amber-900/60 text-right">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                Launch Readiness
              </span>
              <span className="text-sm font-black text-emerald-400 font-mono flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>100% GREEN FOR LAUNCH</span>
              </span>
            </div>

            <button
              onClick={() => onNavigateToTab('milestone_awards')}
              className="deal-btn-platinum py-2.5 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <Award className="w-4 h-4 text-slate-800" />
              <span className="hidden sm:inline">Plaque Trophy Wall</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Selector (Music Drop vs Simulcast vs Omni-Campaign) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: 'omni_drop',
            title: 'Omni-Campaign Master Drop',
            subtitle: 'Music + Video + Live + Shorts',
            icon: Rocket,
            desc: 'Simultaneous 14-channel audio drop, YouTube video premiere, and live studio simulcast party.'
          },
          {
            id: 'music_release',
            title: 'Music Drop Day (1-Click)',
            subtitle: 'DSPs & Audio Streaming',
            icon: Music,
            desc: 'Instant lossless audio release across Spotify, Apple Music, Amazon, SoundCloud, and YouTube.'
          },
          {
            id: 'simulcast_live',
            title: 'Simulcast Go-Live Ignition',
            subtitle: '4-Way Live Multicast',
            icon: Radio,
            desc: 'Pre-flight verified live stream to TikTok, YouTube, Kick, and Facebook in pristine 1080p60.'
          }
        ].map((p) => {
          const Icon = p.icon;
          const isSelected = profile === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                setProfile(p.id as LaunchProfile);
                if (p.id === 'music_release') handleSelectMusicOnly();
                else if (p.id === 'omni_drop') handleSelectAllPlatforms();
              }}
              className={`p-4 rounded-xl text-left transition border ${
                isSelected
                  ? 'plaque-gold border-amber-400 shadow-xl ring-1 ring-amber-300'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-400 text-amber-950 font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase px-2 py-0.5 rounded bg-amber-950/60 border border-amber-600/40">
                    Active Profile
                  </span>
                )}
              </div>
              <h4 className="text-sm font-black text-white">{p.title}</h4>
              <p className="text-[11px] font-semibold text-amber-300/90">{p.subtitle}</p>
              <p className="text-xs text-zinc-400 mt-2">{p.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Pre-Flight Diagnostics Section */}
      <PreFlightDiagnostics
        connections={connections}
        isBroadcasting={streamState.isBroadcasting}
      />

      {/* Mission Configuration & Ignition Room */}
      <div className="plaque-diamond p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
          
          {/* Mission Name & Settings */}
          <div className="flex-1 space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-sky-300 block">
              Mission Designation & Campaign Title:
            </label>
            <input
              type="text"
              value={missionTitle}
              onChange={(e) => setMissionTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-sky-400/40 text-white font-mono text-sm focus:outline-none focus:border-sky-300 shadow-inner"
              placeholder="e.g. Project Album Drop 2026"
            />
            <p className="text-[11px] text-zinc-400 font-mono">
              Tagged for automated Escrow smart contracts and cryptographic RIAA milestone tracking.
            </p>
          </div>

          {/* Quick Platform Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSelectMusicOnly}
              className="deal-btn-gold px-3.5 py-2 rounded-xl text-xs font-bold shadow-md"
            >
              <span>🎵 Select All Music DSPs</span>
            </button>
            <button
              onClick={handleSelectAllPlatforms}
              className="deal-btn-platinum px-3.5 py-2 rounded-xl text-xs font-bold shadow-md"
            >
              <span>🌐 Select All 14 Channels</span>
            </button>
          </div>
        </div>

        {/* Selected Destinations Grid */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase">
              Target Launch Platforms ({selectedCount}/14 Selected):
            </span>
            <span className="text-xs text-sky-300 font-mono">100% Ready for Push</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map((pid) => {
              const cfg = PLATFORM_CONFIGS[pid];
              const isSelected = !!selectedPlatforms[pid];
              return (
                <button
                  key={pid}
                  onClick={() => handleTogglePlatform(pid)}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition border ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-sky-400/60 shadow-md ring-1 ring-sky-400/30'
                      : 'bg-zinc-950/60 text-zinc-500 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: isSelected ? cfg?.color : '#4B5563' }}
                  />
                  <span className="truncate">{cfg?.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Master Ignition Controls */}
        <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Arm Safety Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsArmed(!isArmed)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition border ${
                isArmed
                  ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600'
              }`}
            >
              {isArmed ? '🔴 LAUNCH ARMED & LOCKED' : '⚪ ARM LAUNCH SEQUENCE'}
            </button>
            <span className="text-xs text-zinc-400">
              {isArmed ? 'Safety interlocks released. Ready for ignition.' : 'Toggle switch to enable master launch.'}
            </span>
          </div>

          {/* Master Ignition Button */}
          <button
            onClick={handleTriggerLaunch}
            disabled={!isArmed}
            className={`py-3 px-8 rounded-2xl text-sm font-black uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-2xl ${
              isArmed
                ? 'deal-btn-gold scale-105 animate-bounce shadow-[0_0_30px_rgba(245,158,11,0.6)]'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
            }`}
          >
            <Rocket className="w-5 h-5" />
            <span>IGNITE GLOBAL LAUNCH</span>
          </button>
        </div>
      </div>

      {/* Live Mission Telemetry Readout (Active when broadcast or recently launched) */}
      {(streamState.isBroadcasting || hasLaunchedRecently) && (
        <div className="plaque-platinum p-6 rounded-2xl relative overflow-hidden animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Live Mission Telemetry Stream
              </h3>
            </div>
            <span className="engraved-plate-platinum text-[9px] font-black px-2.5 py-0.5 rounded shadow-sm">
              TRANSMITTING ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">Live Concurrent Viewers</span>
              <span className="text-2xl font-black text-white font-mono">
                {streamState.totalLiveViewers.toLocaleString()} CCV
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">+2,400 / min influx</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">Encoder Bitrate</span>
              <span className="text-2xl font-black text-sky-400 font-mono">
                {streamState.bitrateKbps} kbps
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold block mt-1">60.0 FPS • Zero dropped</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">Syndicated Relays</span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                {selectedCount} Active
              </span>
              <span className="text-[10px] text-amber-300/80 font-semibold block mt-1">100% loss-free sync</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">Cut The Check Escrow</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                $50,280.00
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Auto-disbursing royalties</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-zinc-400 font-mono">
              Broadcasting with official CTC Eagle Medallion watermark anchored in 1080p60.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToTab('cut_the_chat')}
                className="deal-btn-gold py-1.5 px-3 rounded-lg text-xs font-bold"
              >
                Go to Cut The Chat →
              </button>
              <button
                onClick={() => onNavigateToTab('climb_the_charts')}
                className="deal-btn-platinum py-1.5 px-3 rounded-lg text-xs font-bold"
              >
                View Live Chart Analytics →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* T-Minus Countdown Modal */}
      <LaunchCountdownModal
        isOpen={isCountdownOpen}
        onClose={() => setIsCountdownOpen(false)}
        onLaunchComplete={handleLaunchCompleted}
        missionName={missionTitle}
        selectedPlatformsCount={selectedCount}
      />
    </div>
  );
};
