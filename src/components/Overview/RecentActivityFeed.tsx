import React, { useState } from 'react';
import { LiveChatEvent } from '../../types';
import { PlatformBadge } from '../common/PlatformBadge';
import { Gift, Zap, Sparkles, MessageSquare } from 'lucide-react';

interface RecentActivityFeedProps {
  events: LiveChatEvent[];
  onReply?: (user: string) => void;
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ events }) => {
  const [filter, setFilter] = useState<'all' | 'monetized' | 'chat'>('all');

  const filteredEvents = events.filter((ev) => {
    if (filter === 'monetized') return ev.isGift || ev.isSuperChat;
    if (filter === 'chat') return !ev.isGift && !ev.isSuperChat;
    return true;
  });

  return (
    <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-base font-bold text-white">Live Multi-Channel Stream Feed</h3>
        </div>
        <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 text-[11px] font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded-md transition ${
              filter === 'all' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('monetized')}
            className={`px-2 py-0.5 rounded-md transition ${
              filter === 'monetized' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Gifts & Tips
          </button>
          <button
            onClick={() => setFilter('chat')}
            className={`px-2 py-0.5 rounded-md transition ${
              filter === 'chat' ? 'bg-zinc-800 text-blue-400 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Chat
          </button>
        </div>
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
        {filteredEvents.map((ev) => {
          const isMonetized = ev.isGift || ev.isSuperChat;

          return (
            <div
              key={ev.id}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                isMonetized
                  ? 'bg-gradient-to-r from-amber-500/10 via-zinc-900/60 to-zinc-900/40 border-amber-500/30 shadow-sm'
                  : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <img
                src={ev.avatar}
                alt={ev.user}
                className="w-8 h-8 rounded-full border border-zinc-700 object-cover shrink-0 mt-0.5"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-xs text-white truncate">{ev.user}</span>
                    <PlatformBadge platformId={ev.platformId} size="sm" showLabel={false} />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                    {ev.timestamp}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed break-words">
                  {ev.message}
                </p>

                {isMonetized && (
                  <div className="mt-2 flex items-center gap-2">
                    {ev.isSuperChat && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40 font-mono">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        SuperChat {ev.superChatAmount}
                      </span>
                    )}
                    {ev.isGift && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40 font-mono">
                        <Gift className="w-3 h-3 text-rose-400" />
                        {ev.giftType} (+${ev.giftValue?.toFixed(2)})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
