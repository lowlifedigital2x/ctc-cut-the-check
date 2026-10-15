import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Settings,
  Sparkles,
  Wifi,
  Copy,
  Check,
  Shield,
  Layers,
  Volume2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { MultiStreamState, PlatformId, LiveChatEvent } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';
import { UnifiedLiveChat } from './UnifiedLiveChat';
import ctcEagleDiamondImg from '../../assets/images/ctc_eagle_diamond.jpg';

interface MultiLiveStudioProps {
  streamState: MultiStreamState;
  onToggleStream: () => void;
  onTogglePlatformStream: (p: PlatformId) => void;
  chatEvents: LiveChatEvent[];
  onSendMessage: (msg: string, target: PlatformId | 'all') => void;
  onAddSimulatedChat: (chat: LiveChatEvent) => void;
}

export const MultiLiveStudio: React.FC<MultiLiveStudioProps> = ({
  streamState,
  onToggleStream,
  onTogglePlatformStream,
  chatEvents,
  onSendMessage,
  onAddSimulatedChat
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [showRtmpModal, setShowRtmpModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Audio VU meter simulation
  const [vuLevels, setVuLevels] = useState<number[]>([40, 55, 70, 85, 60, 45, 90, 75]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let animInterval: any;
    if (micActive) {
      animInterval = setInterval(() => {
        setVuLevels((prev) =>
          prev.map(() => Math.floor(Math.random() * 65) + (streamState.isBroadcasting ? 30 : 15))
        );
      }, 150);
    }
    return () => clearInterval(animInterval);
  }, [micActive, streamState.isBroadcasting]);

  // Request actual camera if user activates it
  const handleToggleCamera = async () => {
    if (!cameraActive) {
      try {
        if (navigator?.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setCameraActive(true);
        } else {
          setCameraActive(true);
        }
      } catch (err) {
        console.warn('Camera permission not available or denied, using simulated studio view:', err);
        setCameraActive(true);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedCount = Object.values(streamState.selectedPlatforms).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Studio Header & Broadcast Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Radio className="w-6 h-6 text-red-500" />
              <span>Multi-Live Broadcast Control Room</span>
            </h2>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                streamState.isBroadcasting
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {streamState.isBroadcasting ? 'Live Multicasting' : 'Offline'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Encode and distribute your live stream to TikTok, YouTube, Kick, and Facebook in synchronized 1080p60.
          </p>
        </div>

        {/* Master One-Click Go Live Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRtmpModal(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 border border-zinc-700 transition flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>RTMP Relay Keys</span>
          </button>

          <button
            onClick={onToggleStream}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-xl flex items-center gap-2 ${
              streamState.isBroadcasting
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/50 animate-pulse'
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-rose-900/40'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                streamState.isBroadcasting ? 'bg-white' : 'bg-red-200'
              }`}
            />
            <span>
              {streamState.isBroadcasting
                ? 'End Multistream Broadcast'
                : `Go Live Everywhere (${selectedCount} Channels)`}
            </span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport & Chat Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Video Viewport & Hardware Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Virtual Studio Canvas Card */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-[#090C12] shadow-2xl flex items-center justify-center group">
            {/* Live Camera Feed if enabled */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
                cameraActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
              }`}
            />

            {/* Test Pattern / Virtual Studio Card when camera is off */}
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-br from-[#0D111A] via-[#101420] to-[#0A0D15]">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-purple-400 shadow-2xl">
                    <Radio className="w-10 h-10" />
                  </div>
                  {streamState.isBroadcasting && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-ping" />
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {streamState.isBroadcasting
                      ? 'Live Multicast Stream Relaying Active'
                      : 'OmniCast Virtual Studio Preview'}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-md">
                    Connect your webcam, screen share, or feed directly from OBS / vMix using the unified RTMP ingest endpoint below.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleToggleCamera}
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-zinc-700"
                  >
                    <Video className="w-3.5 h-3.5 text-blue-400" />
                    <span>Enable Studio Webcam</span>
                  </button>
                </div>
              </div>
            )}

            {/* Top Overlay HUD Bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md ${
                    streamState.isBroadcasting
                      ? 'bg-red-600/90 text-white shadow-lg shadow-red-900/50'
                      : 'bg-zinc-900/80 text-zinc-400 border border-zinc-700/60'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      streamState.isBroadcasting ? 'bg-white animate-pulse' : 'bg-zinc-500'
                    }`}
                  />
                  <span>{streamState.isBroadcasting ? 'ON AIR' : 'PREVIEW'}</span>
                </span>

                {streamState.isBroadcasting && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-black/70 text-white border border-zinc-700 backdrop-blur-md font-mono">
                    👥 {streamState.totalLiveViewers.toLocaleString()} CCV
                  </span>
                )}
              </div>

              {/* Official CTC Eagle Medallion Watermark & Streaming Destinations */}
              <div className="flex items-center gap-2 pointer-events-auto">
                {/* Official Broadcast Watermark */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/85 border border-amber-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400">
                    <img src={ctcEagleDiamondImg} alt="CTC Eagle Medallion Watermark" className="w-full h-full object-cover scale-105" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-gold-gradient uppercase">
                    CTC WATERMARK
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-1">
                  {(['youtube', 'kick', 'tiktok', 'facebook'] as PlatformId[]).map((pid) => {
                    const isBroadcastingHere =
                      streamState.isBroadcasting && streamState.selectedPlatforms[pid];
                    const cfg = PLATFORM_CONFIGS[pid];
                    return (
                      <span
                        key={pid}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-md flex items-center gap-1 transition ${
                          isBroadcastingHere
                            ? 'bg-black/80 text-white border-emerald-500/80 shadow-sm'
                            : 'bg-black/50 text-zinc-500 border-zinc-800'
                        }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: isBroadcastingHere ? cfg?.color : '#4B5563' }}
                        />
                        <span>{cfg?.name}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Stream Telemetry Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-300 pointer-events-auto">
                <div className="flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{streamState.bitrateKbps} kbps</span>
                </div>
                <div className="text-zinc-600">|</div>
                <div>{streamState.fps.toFixed(1)} FPS</div>
                <div className="text-zinc-600">|</div>
                <div>{streamState.quality}</div>
                <div className="text-zinc-600">|</div>
                <div className="text-emerald-400 font-semibold">Drop: 0.0%</div>
              </div>

              {/* Mic VU Meter Bar */}
              <div className="flex items-end gap-0.5 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-zinc-800 h-8 pointer-events-auto">
                <Volume2 className="w-3.5 h-3.5 text-zinc-400 self-center mr-1" />
                {vuLevels.map((lvl, idx) => (
                  <div
                    key={idx}
                    className="w-1 rounded-sm transition-all duration-100"
                    style={{
                      height: `${lvl}%`,
                      backgroundColor: lvl > 80 ? '#EF4444' : lvl > 60 ? '#F59E0B' : '#10B981'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Hardware & Device Controls */}
          <div className="p-4 rounded-2xl bg-[#111622] border border-zinc-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleCamera}
                className={`p-2.5 rounded-xl border transition ${
                  cameraActive
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
                title="Toggle Studio Camera"
              >
                {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setMicActive(!micActive)}
                className={`p-2.5 rounded-xl border transition ${
                  micActive
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-rose-950/40 text-rose-400 border-rose-800'
                }`}
                title="Toggle Microphone"
              >
                {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setScreenSharing(!screenSharing)}
                className={`p-2.5 rounded-xl border transition ${
                  screenSharing
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
                title="Share Screen"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* Test Trigger: Send sample TikTok Rose or Kick Sub */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onAddSimulatedChat({
                    id: `chat-${Date.now()}`,
                    platformId: 'tiktok',
                    user: 'neon_rider',
                    avatar: 'https://i.pravatar.cc/100?img=53',
                    message: 'Sent 10x Roses to the stream! 🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹',
                    timestamp: 'Just now',
                    isGift: true,
                    giftType: 'Roses x10',
                    giftValue: 10
                  });
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition"
              >
                🌹 Test TikTok Gift
              </button>

              <button
                onClick={() => {
                  onAddSimulatedChat({
                    id: `chat-${Date.now()}`,
                    platformId: 'kick',
                    user: 'SubSniper99',
                    avatar: 'https://i.pravatar.cc/100?img=17',
                    message: 'Subscribed for 3 Months! (95/5 Creator Split) 🟢',
                    timestamp: 'Just now',
                    badge: 'Tier 1 Sub'
                  });
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition"
              >
                🟢 Test Kick Sub
              </button>
            </div>
          </div>

          {/* Multistream Channels Ingest Grid */}
          <div className="p-5 rounded-2xl bg-[#111622] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Simultaneous Ingest Destinations
              </h3>
              <span className="text-[11px] text-zinc-400 font-mono">
                Active Relay: US-East Relay Server (12ms ping)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['youtube', 'kick', 'tiktok', 'facebook'] as PlatformId[]).map((pid) => {
                const isSelected = !!streamState.selectedPlatforms[pid];
                const cfg = PLATFORM_CONFIGS[pid];
                const viewers = streamState.platformViewers[pid] || 0;

                return (
                  <div
                    key={pid}
                    className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-zinc-900/90 border-zinc-700 shadow-md'
                        : 'bg-zinc-950/40 border-zinc-800/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PlatformBadge platformId={pid} size="md" />
                      <div>
                        <span className="text-xs font-bold text-white block">{cfg.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {streamState.isBroadcasting && isSelected
                            ? `Streaming • ${viewers.toLocaleString()} Viewers`
                            : isSelected
                            ? 'Armed & Ready'
                            : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onTogglePlatformStream(pid)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        isSelected
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isSelected ? 'Enabled' : 'Bypass'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Unified Live Chat & Alert Box */}
        <div className="lg:col-span-1">
          <UnifiedLiveChat
            chatEvents={chatEvents}
            onSendMessage={onSendMessage}
            isBroadcasting={streamState.isBroadcasting}
          />
        </div>
      </div>

      {/* RTMP Ingest Keys Modal */}
      {showRtmpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111622] rounded-2xl border border-zinc-800 w-full max-w-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>Multistream RTMP & Ingest Credentials</span>
              </h3>
              <button
                onClick={() => setShowRtmpModal(false)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Copy these secure ingest server URLs into OBS Studio, Prism Live, or vMix to stream to all platforms simultaneously with 1 stream key.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Universal Relay Server (RTMP)
                </span>
                <div className="flex items-center justify-between gap-2 font-mono text-xs bg-zinc-950 p-2 rounded-lg text-zinc-200">
                  <span className="truncate">rtmp://live.omnicast.io/relay/app</span>
                  <button
                    onClick={() =>
                      copyToClipboard('rtmp://live.omnicast.io/relay/app', 'relay_url')
                    }
                    className="p-1 text-purple-400 hover:text-white"
                  >
                    {copiedKey === 'relay_url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Master Relay Stream Key
                </span>
                <div className="flex items-center justify-between gap-2 font-mono text-xs bg-zinc-950 p-2 rounded-lg text-zinc-200">
                  <span className="truncate">live_omni_88192039_x99_sec</span>
                  <button
                    onClick={() =>
                      copyToClipboard('live_omni_88192039_x99_sec', 'master_key')
                    }
                    className="p-1 text-purple-400 hover:text-white"
                  >
                    {copiedKey === 'master_key' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setShowRtmpModal(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
