import React, { useState } from 'react';
import {
  Calculator,
  Calendar,
  Sparkles,
  TrendingUp,
  DollarSign,
  Plus,
  Play,
  Layers,
  CheckCircle2,
  Sliders,
  Disc3,
  Award,
  ArrowUpRight,
  ShieldCheck,
  Video,
  Radio,
  Music,
  Zap
} from 'lucide-react';
import { ScheduledItem, ContentItem, PlatformConnection, PlatformId } from '../../types';
import { PLATFORM_CONFIGS, INITIAL_SCHEDULED_ITEMS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';

interface ProjectedEarningsCalculatorProps {
  scheduledItems?: ScheduledItem[];
  currencySymbol?: string;
  onNavigateToScheduler?: () => void;
}

export const ProjectedEarningsCalculator: React.FC<ProjectedEarningsCalculatorProps> = ({
  scheduledItems = INITIAL_SCHEDULED_ITEMS,
  currencySymbol = '$',
  onNavigateToScheduler
}) => {
  // Scenario Planner State
  const [releaseType, setReleaseType] = useState<'video' | 'stream_vod' | 'audio' | 'short'>('video');
  const [projectedViews, setProjectedViews] = useState<number>(350000);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([
    'youtube',
    'kick',
    'tiktok',
    'spotify'
  ]);
  const [engagementTier, setEngagementTier] = useState<'conservative' | 'expected' | 'viral'>('expected');
  const [customReleaseTitle, setCustomReleaseTitle] = useState('New Multi-Channel Broadcast');

  // RPM baseline per content type based on verified historical data
  const rpmRates: Record<string, number> = {
    video: 7.20,
    stream_vod: 14.10,
    audio: 5.80,
    short: 2.40
  };

  const engagementMultipliers = {
    conservative: 0.85,
    expected: 1.25,
    viral: 2.40
  };

  const baseRpm = rpmRates[releaseType];
  const activeMultiplier = engagementMultipliers[engagementTier];
  const effectiveRpm = baseRpm * activeMultiplier;

  // Platform split distribution weights
  const platformWeightMap: Record<string, number> = {
    youtube: 0.38,
    kick: 0.30,
    tiktok: 0.18,
    spotify: 0.08,
    applemusic: 0.06
  };

  const activeSelectedWeightSum = selectedPlatforms.reduce(
    (sum, p) => sum + (platformWeightMap[p] || 0.1),
    0
  );

  const scenarioProjectedTotal = (projectedViews / 1000) * effectiveRpm;

  const togglePlatform = (p: PlatformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p)
        ? prev.length > 1
          ? prev.filter((id) => id !== p)
          : prev
        : [...prev, p]
    );
  };

  // Pipeline calculate for all existing scheduled items
  const pipelineEstimates = scheduledItems.map((item) => {
    const estViews = item.type === 'stream' ? 280000 : item.mediaType === 'audio' ? 320000 : 420000;
    const estRate = item.type === 'stream' ? 14.10 : item.mediaType === 'audio' ? 5.80 : 7.20;
    const estTotal = (estViews / 1000) * estRate;
    return {
      item,
      estViews,
      estTotal
    };
  });

  const totalUpcomingPipelineRevenue = pipelineEstimates.reduce((sum, e) => sum + e.estTotal, 0);

  return (
    <div className="plaque-platinum p-6 lg:p-8 relative overflow-hidden space-y-6">
      {/* Vinyl Groove Accent */}
      <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full grooved-record-disc opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <span>Projected Earnings Calculator</span>
            </h3>
            <span className="engraved-plate-platinum text-[9px] font-black uppercase px-2 py-0.5 rounded text-slate-900 shadow-sm">
              SCHEDULED RELEASES SIMULATOR
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Estimate potential escrow payouts from upcoming scheduled drops using trailing cross-platform RPM models.
          </p>
        </div>

        <div className="engraved-plate-gold px-4 py-2 rounded-xl text-center shadow-lg shrink-0">
          <span className="text-[9px] font-mono uppercase font-black tracking-widest text-amber-950/80 block">
            UPCOMING PIPELINE REVENUE
          </span>
          <div className="text-2xl font-black font-mono text-amber-950 tracking-tight">
            {currencySymbol}{totalUpcomingPipelineRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[9px] font-bold text-amber-900">
            Across {scheduledItems.length} Verified Releases
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Release Simulator + Scheduled Pipeline Queue */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Scenario Simulator (7 cols) */}
        <div className="lg:col-span-7 bg-black/40 border border-slate-700/60 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Release Parameter Configurator
              </span>
            </div>
            <span className="text-[11px] text-amber-300 font-mono font-bold">
              Effective RPM: {currencySymbol}{effectiveRpm.toFixed(2)}
            </span>
          </div>

          {/* Release Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">Working Content Title</label>
            <input
              type="text"
              value={customReleaseTitle}
              onChange={(e) => setCustomReleaseTitle(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              placeholder="e.g. Master Studio Track / 4K Livestream Special"
            />
          </div>

          {/* Release Format Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300">Content Format / Distribution Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setReleaseType('video')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                  releaseType === 'video'
                    ? 'border-amber-400 bg-amber-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Video className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold">Long Video</span>
                <span className="text-[10px] text-zinc-500 font-mono">~$7.20 RPM</span>
              </button>

              <button
                type="button"
                onClick={() => setReleaseType('stream_vod')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                  releaseType === 'stream_vod'
                    ? 'border-amber-400 bg-amber-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Radio className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">Live Stream</span>
                <span className="text-[10px] text-zinc-500 font-mono">~$14.10 RPM</span>
              </button>

              <button
                type="button"
                onClick={() => setReleaseType('audio')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                  releaseType === 'audio'
                    ? 'border-amber-400 bg-amber-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Music className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold">Audio Track</span>
                <span className="text-[10px] text-zinc-500 font-mono">~$5.80 RPM</span>
              </button>

              <button
                type="button"
                onClick={() => setReleaseType('short')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                  releaseType === 'short'
                    ? 'border-amber-400 bg-amber-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Zap className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-bold">Viral Short</span>
                <span className="text-[10px] text-zinc-500 font-mono">~$2.40 RPM</span>
              </button>
            </div>
          </div>

          {/* Expected Views Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-300">Target Audience Reach (30-Day Window)</span>
              <span className="font-mono font-black text-white text-sm bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-700">
                {projectedViews.toLocaleString()} Views / Streams
              </span>
            </div>
            <input
              type="range"
              min={25000}
              max={2500000}
              step={25000}
              value={projectedViews}
              onChange={(e) => setProjectedViews(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>25k Indie</span>
              <span>500k Breakthrough</span>
              <span>1.5M Major Deal</span>
              <span>2.5M Viral Hit</span>
            </div>
          </div>

          {/* Platform Distribution Toggles */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300">Syndicated Distribution Platforms</label>
            <div className="flex flex-wrap gap-2">
              {(['youtube', 'kick', 'tiktok', 'spotify', 'applemusic', 'facebook'] as PlatformId[]).map((pid) => {
                const isSelected = selectedPlatforms.includes(pid);
                const cfg = PLATFORM_CONFIGS[pid];
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => togglePlatform(pid)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                      isSelected
                        ? 'border-amber-400/80 bg-amber-500/20 text-white shadow-sm'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <span>{cfg?.name || pid}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Engagement Scenario Tiers */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300">Engagement & Monetization Intensity</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEngagementTier('conservative')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  engagementTier === 'conservative'
                    ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400'
                }`}
              >
                <span className="text-xs block">Conservative</span>
                <span className="text-[10px] text-zinc-500 font-mono">0.85x Factor</span>
              </button>

              <button
                type="button"
                onClick={() => setEngagementTier('expected')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  engagementTier === 'expected'
                    ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400'
                }`}
              >
                <span className="text-xs block">Expected Trajectory</span>
                <span className="text-[10px] text-amber-300 font-mono">1.25x Factor</span>
              </button>

              <button
                type="button"
                onClick={() => setEngagementTier('viral')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  engagementTier === 'viral'
                    ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400'
                }`}
              >
                <span className="text-xs block">Breakout Hit</span>
                <span className="text-[10px] text-emerald-400 font-mono">2.40x Factor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Projection Breakdown Plaque (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="engraved-plate-gold p-6 rounded-2xl text-center shadow-2xl relative overflow-hidden">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-amber-950/80 block">
              ESTIMATED GROSS REVENUE DISBURSEMENT
            </span>
            <div className="text-4xl font-black font-mono text-amber-950 tracking-tight my-2">
              {currencySymbol}{scenarioProjectedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs font-bold text-amber-900 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-950" />
              <span>Projected Escrow for &quot;{customReleaseTitle}&quot;</span>
            </div>

            {/* Split Breakdown */}
            <div className="mt-5 pt-4 border-t border-amber-900/20 space-y-2 text-left text-xs font-mono">
              {selectedPlatforms.map((pid) => {
                const cfg = PLATFORM_CONFIGS[pid];
                const rawWeight = platformWeightMap[pid] || 0.1;
                const normalizedWeight = rawWeight / (activeSelectedWeightSum || 1);
                const platformShare = scenarioProjectedTotal * normalizedWeight;
                return (
                  <div key={pid} className="flex items-center justify-between text-amber-950 font-bold">
                    <span>{cfg?.name || pid}:</span>
                    <span>{currencySymbol}{platformShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Scheduled Queue Section */}
          <div className="bg-black/50 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Upcoming Scheduled Catalog</span>
              </span>
              {onNavigateToScheduler && (
                <button
                  onClick={onNavigateToScheduler}
                  className="text-[11px] font-bold text-amber-300 hover:underline flex items-center gap-1"
                >
                  <span>Open Scheduler</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {pipelineEstimates.map(({ item, estViews, estTotal }) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{item.title}</p>
                    <span className="text-[10px] text-zinc-400">
                      Target: {estViews.toLocaleString()} views
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-black text-amber-300 block">
                      +{currencySymbol}{estTotal.toFixed(0)}
                    </span>
                    <span className="text-[9px] text-zinc-500 uppercase font-mono">est. payout</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
