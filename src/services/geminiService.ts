import { GoogleGenAI } from '@google/genai';
import { PlatformId } from '../types';

// Read API key if available in environment
const apiKey = typeof process !== 'undefined' && process.env?.GEMINI_API_KEY
  ? process.env.GEMINI_API_KEY
  : (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI with key:', err);
  }
}

export interface OptimizedPlatformContent {
  platformId: PlatformId;
  title: string;
  caption: string;
  hashtags: string[];
  tips: string;
}

export interface StreamIdeasResponse {
  streamTitles: string[];
  engagementHooks: string[];
  monetizationTriggers: string[];
}

export async function generateMultiPlatformCopies(
  topicOrIdea: string,
  targetPlatforms: PlatformId[]
): Promise<OptimizedPlatformContent[]> {
  if (aiClient) {
    try {
      const prompt = `You are a world-class creator content strategist.
Given this creator's topic/title: "${topicOrIdea}"
Target Platforms: ${targetPlatforms.join(', ')}

Generate tailored versions for each platform following its exact audience psychology:
- TikTok: Fast hook, 3-5 high-traffic hashtags, curiosity-driven
- YouTube: High CTR title, structured description with chapters preview, SEO tags
- Kick: Gamer/Streamer hype language, short energetic title, interactive prompt
- Spotify: Podcast/Music episode description, show notes, listener takeaway
- Apple Music: Elegant editorial pitch, clean artist metadata
- Facebook: Conversational storytelling, relatable question hook

Return ONLY a JSON array with objects matching:
[{ "platformId": "tiktok", "title": "...", "caption": "...", "hashtags": ["#tag1", "#tag2"], "tips": "..." }]`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to local optimization engine:', e);
    }
  }

  // High-fidelity fallback algorithmic generator
  return targetPlatforms.map((platform) => {
    switch (platform) {
      case 'tiktok':
        return {
          platformId: 'tiktok',
          title: `Wait till the end... ${topicOrIdea.slice(0, 45)}`,
          caption: `Stop scrolling if you want to know the truth about ${topicOrIdea.toLowerCase()} 👀 Watch till the end and tell me in comments what you think!`,
          hashtags: ['#FYP', '#CreatorEconomy', '#ViralStrategy', '#TrendingNow', '#WatchTillEnd'],
          tips: 'Use 9:16 vertical crop, hook within 1.5s, add energetic background audio.'
        };
      case 'youtube':
        return {
          platformId: 'youtube',
          title: `How I Changed Everything: ${topicOrIdea} (Full Breakdown)`,
          caption: `In this video, we dive deep into ${topicOrIdea.toLowerCase()}.\n\n⏱️ Chapters:\n0:00 - The Big Secret\n01:45 - What Nobody Tells You\n04:30 - Complete Strategy\n08:15 - Monetization & Takeaways\n\n🔔 Subscribe & tap the bell for weekly masterclasses!`,
          hashtags: ['#YouTubeCreator', '#GrowthHacks', '#CreatorHub', '#Tutorial', '#DeepDive'],
          tips: 'Include high-contrast thumbnail with 3 words max. Monetization enabled.'
        };
      case 'kick':
        return {
          platformId: 'kick',
          title: `🔴 NO FILTER: ${topicOrIdea} | 95/5 Sub Hype & Q&A`,
          caption: `Live broadcast discussion & breakdown: ${topicOrIdea}. Chat decides the next move! Gift 5 subs to trigger the wheel!`,
          hashtags: ['#KickStreamer', '#LiveBroadcasting', '#KCIP', '#SubGoal'],
          tips: 'Set category to Just Chatting or Creative. Engage chat with polls.'
        };
      case 'spotify':
        return {
          platformId: 'spotify',
          title: `Ep. 104 - The Real Blueprint of ${topicOrIdea}`,
          caption: `Welcome back to the studio! In this episode, Alex Rivers unpacks the complete mechanisms behind ${topicOrIdea.toLowerCase()} with exclusive soundscapes and creator case studies.\n\nConnect with the show: @alexrivers.studio`,
          hashtags: ['#SpotifyPodcasts', '#AudioFirst', '#DeepTalk', '#MusicProduction'],
          tips: 'Upload with clean 320kbps MP3/WAV and 1:1 3000x3000 cover art.'
        };
      case 'applemusic':
        return {
          platformId: 'applemusic',
          title: `${topicOrIdea} (Studio Spatial Mix)`,
          caption: `Official audio release and artist spotlight master. Mixed for Dolby Atmos and Apple Lossless.`,
          hashtags: ['#AppleMusic', '#SpatialAudio', '#Lossless', '#NewMusic'],
          tips: 'Ensure 24-bit 48kHz audio stems and verified artist ISRC registry.'
        };
      case 'facebook':
        return {
          platformId: 'facebook',
          title: `The Untold Story Behind ${topicOrIdea}`,
          caption: `A lot of you have been asking about this in my DMs recently...\n\nHere is what really happened with ${topicOrIdea.toLowerCase()}. Have you ever experienced this in your own journey? Drop your thoughts below! 👇`,
          hashtags: ['#CreatorJourney', '#FacebookReels', '#Community', '#CreatorStories'],
          tips: 'Pin the best community comment to boost Facebook feed algorithm ranking.'
        };
      default:
        return {
          platformId: platform,
          title: topicOrIdea,
          caption: `Checking out ${topicOrIdea} across all channels!`,
          hashtags: ['#Creator', '#MultiPost'],
          tips: 'Cross-platform sync verified.'
        };
    }
  });
}

export async function generateStreamInsights(topic: string): Promise<StreamIdeasResponse> {
  if (aiClient) {
    try {
      const prompt = `For a multistream creator streaming simultaneously on YouTube, Kick, TikTok, and Facebook, provide:
1. 3 ultra-clickable stream titles
2. 3 live engagement hooks to keep concurrent viewers (CCV) high
3. 3 monetization triggers (getting live gifts, superchats, kick subs, facebook stars)
Topic: "${topic}"
Output strictly JSON:
{ "streamTitles": ["..."], "engagementHooks": ["..."], "monetizationTriggers": ["..."] }`;

      const res = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      if (res.text) {
        return JSON.parse(res.text);
      }
    } catch (e) {
      console.warn('Gemini stream ideas fallback:', e);
    }
  }

  return {
    streamTitles: [
      `🚨 LIVE MULTICAST: ${topic} (Chat Controls The Studio)`,
      `🔴 Doing What They Said Was Impossible | ${topic} + Live Q&A`,
      `💸 $1,000 Challenge + Behind The Scenes: ${topic}`
    ],
    engagementHooks: [
      'Pin a live chat poll asking "Are you watching from Kick, YouTube, TikTok, or FB?" to spark channel rivalry.',
      'Set an interactive 15-minute countdown alert for a major reveal or demo.',
      'Shout out the top viewer from each separate platform every 10 minutes.'
    ],
    monetizationTriggers: [
      'Offer to analyze or review a chat member’s profile for every Kick Sub or $10 SuperChat.',
      'TikTok Lion/Rose goal tracker overlay synced with stream visual effects.',
      'Facebook Stars goal: "Unlock exclusive unreleased preview at 5,000 stars".'
    ]
  };
}
