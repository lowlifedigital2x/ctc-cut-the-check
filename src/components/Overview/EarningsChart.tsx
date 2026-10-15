import React, { useState } from 'react';
import { EARNINGS_TIMELINE_30D, PLATFORM_CONFIGS } from '../../data/mockData';
import { PlatformId } from '../../types';

interface EarningsChartProps {
  currencySymbol?: string;
}

export const EarningsChart: React.FC<EarningsChartProps> = ({ currencySymbol = '$' }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | 'all'>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = EARNINGS_TIMELINE_30D;

  const getValue = (item: (typeof data)[0]) => {
    if (selectedPlatform === 'all') return item.amount;
    return (item as any)[selectedPlatform] || 0;
  };

  const values = data.map(getValue);
  const maxValue = Math.max(...values, 100);
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 25;

  const getX = (index: number) => {
    return paddingX + (index / (data.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    const usableHeight = chartHeight - paddingY * 2;
    return chartHeight - paddingY - (val / maxValue) * usableHeight;
  };

  // Generate smooth SVG path
  const points = data.map((d, i) => `${getX(i)},${getY(getValue(d))}`);
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${getX(0)},${chartHeight - paddingY} L ${points.join(' L ')} L ${getX(
    data.length - 1
  )},${chartHeight - paddingY} Z`;

  const platformsList: (PlatformId | 'all')[] = [
    'all',
    'youtube',
    'kick',
    'tiktok',
    'spotify',
    'applemusic',
    'facebook'
  ];

  const activeColor =
    selectedPlatform === 'all'
      ? '#A855F7'
      : PLATFORM_CONFIGS[selectedPlatform]?.color || '#A855F7';

  return (
    <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Aggregated Monetization Velocity</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              +28.4% this cycle
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time daily earnings blended across streaming, ads, subscriptions & royalties
          </p>
        </div>

        {/* Platform filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {platformsList.map((p) => {
            const isSelected = selectedPlatform === p;
            const name = p === 'all' ? 'All Platforms' : PLATFORM_CONFIGS[p]?.name;
            const color = p === 'all' ? '#A855F7' : PLATFORM_CONFIGS[p]?.color;

            return (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span>{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-56 transition-all"
        >
          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={activeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
            const val = Math.round(ratio * maxValue);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#1F2937"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-zinc-500 font-mono"
                >
                  {currencySymbol}
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#earningsGradient)" />

          {/* Line stroke */}
          <path
            d={pathD}
            fill="none"
            stroke={activeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data points */}
          {data.map((item, i) => {
            const cx = getX(i);
            const val = getValue(item);
            const cy = getY(val);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 4}
                  fill="#0B0E14"
                  stroke={activeColor}
                  strokeWidth={isHovered ? 3 : 2}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {/* X labels */}
                <text
                  x={cx}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className="text-[10px] fill-zinc-400 font-mono"
                >
                  {item.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Popover */}
        {hoveredIndex !== null && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-zinc-900/95 border border-zinc-700/80 rounded-xl px-4 py-2.5 shadow-2xl backdrop-blur-md pointer-events-none flex items-center gap-4 z-20"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400">
                {data[hoveredIndex].day}
              </span>
              <div className="text-base font-extrabold text-white font-mono">
                {currencySymbol}
                {getValue(data[hoveredIndex]).toLocaleString()}
              </div>
            </div>
            {selectedPlatform === 'all' && (
              <div className="flex items-center gap-2 pl-3 border-l border-zinc-800 text-xs">
                <span className="text-red-400 font-mono">YT: ${data[hoveredIndex].youtube}</span>
                <span className="text-lime-400 font-mono">KC: ${data[hoveredIndex].kick}</span>
                <span className="text-cyan-400 font-mono">TT: ${data[hoveredIndex].tiktok}</span>
                <span className="text-emerald-400 font-mono">SP: ${data[hoveredIndex].spotify}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
