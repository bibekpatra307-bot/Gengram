import React, { useState } from 'react';
import { 
  TrendingUp, Users, Eye, Heart, Bookmark, Share2, DollarSign, 
  ArrowUpRight, Award, ShieldCheck, Sparkles, BarChart3, 
  Calendar, Layers, Zap, Gift, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreatorDashboardView: React.FC = () => {
  const { currentUser } = useApp();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [subscriptionPrice, setSubscriptionPrice] = useState('4.99');
  const [activeTier, setActiveTier] = useState('Supporter');

  const stats = {
    totalReach: '248.6K',
    reachGrowth: '+18.4%',
    impressions: '612.9K',
    impressionsGrowth: '+24.1%',
    engagementRate: '9.2%',
    engagementGrowth: '+1.5%',
    monthlyEarnings: '$3,840.50',
    earningsGrowth: '+32.0%',
    activeSubscribers: 342,
  };

  const topContent = [
    {
      id: 'c1',
      title: 'Generative Neural Worlds: Spatial UX Breakdown',
      type: 'Reel',
      views: '184.2K',
      likes: '24.9K',
      saves: '8.4K',
      shares: '4.1K',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'c2',
      title: 'Brutalist Concrete Aesthetics in Scandinavian Architecture',
      type: 'Post',
      views: '92.4K',
      likes: '14.1K',
      saves: '5.2K',
      shares: '2.3K',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'c3',
      title: 'Modular Synthesizer Soundscapes & Binaural Waves',
      type: 'Reel',
      views: '76.8K',
      likes: '11.8K',
      saves: '3.9K',
      shares: '1.9K',
      thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const demographics = [
    { country: 'United States', percentage: 38, flag: '🇺🇸' },
    { country: 'Japan', percentage: 22, flag: '🇯🇵' },
    { country: 'Germany', percentage: 16, flag: '🇩🇪' },
    { country: 'United Kingdom', percentage: 12, flag: '🇬🇧' },
    { country: 'Other', percentage: 12, flag: '🌐' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl nexora-gradient text-white shadow-lg shadow-indigo-500/20">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display flex items-center gap-2">
                Gengram Creator Studio
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-mono border border-indigo-500/30">
                  Level 3 Creator
                </span>
              </h1>
              <p className="text-xs text-neutral-400">
                Audience analytics, engagement velocity, and subscriber monetization.
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-2xl border border-white/[0.08]">
          {(['7d', '30d', '90d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                timeframe === t 
                  ? 'bg-white/10 text-white shadow' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t === '7d' ? 'Last 7 Days' : t === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#090c13] border border-white/[0.08] space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Total Reach</span>
            <span className="flex items-center text-emerald-400 font-bold text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {stats.reachGrowth}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            {stats.totalReach}
          </p>
          <p className="text-[11px] text-neutral-400">Unique accounts discovered</p>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition" />
        </div>

        <div className="p-5 rounded-3xl bg-[#090c13] border border-white/[0.08] space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Impressions</span>
            <span className="flex items-center text-emerald-400 font-bold text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {stats.impressionsGrowth}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            {stats.impressions}
          </p>
          <p className="text-[11px] text-neutral-400">Total feed & reel deliveries</p>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/20 transition" />
        </div>

        <div className="p-5 rounded-3xl bg-[#090c13] border border-white/[0.08] space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Engagement Rate</span>
            <span className="flex items-center text-emerald-400 font-bold text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {stats.engagementGrowth}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            {stats.engagementRate}
          </p>
          <p className="text-[11px] text-neutral-400">Likes, saves, comments ratio</p>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl group-hover:bg-violet-500/20 transition" />
        </div>

        <div className="p-5 rounded-3xl bg-[#090c13] border border-white/[0.08] space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Estimated Revenue</span>
            <span className="flex items-center text-emerald-400 font-bold text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {stats.earningsGrowth}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            {stats.monthlyEarnings}
          </p>
          <p className="text-[11px] text-neutral-400">Subscriptions & tips payout</p>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition" />
        </div>
      </div>

      {/* Growth Velocity & Performance SVG Chart */}
      <div className="p-6 rounded-3xl bg-[#090c13] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Impressions & Engagement Velocity
            </h2>
            <p className="text-xs text-neutral-400">Visualizing 30-day algorithmic distribution curve</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Reels
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Posts
            </span>
          </div>
        </div>

        {/* Scalable Vector Visualization */}
        <div className="h-44 w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 150">
            <defs>
              <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="30" x2="700" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="700" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1="0" y1="130" x2="700" y2="130" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

            {/* Reels Area */}
            <path
              d="M 0 120 Q 80 90, 160 85 T 320 40 T 480 50 T 600 20 T 700 15 L 700 140 L 0 140 Z"
              fill="url(#chartGrad1)"
            />
            {/* Reels Curve */}
            <path
              d="M 0 120 Q 80 90, 160 85 T 320 40 T 480 50 T 600 20 T 700 15"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
            />

            {/* Posts Area */}
            <path
              d="M 0 135 Q 100 115, 200 100 T 400 80 T 550 70 T 700 45 L 700 140 L 0 140 Z"
              fill="url(#chartGrad2)"
            />
            {/* Posts Curve */}
            <path
              d="M 0 135 Q 100 115, 200 100 T 400 80 T 550 70 T 700 45"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>

      {/* Two-Column: Top Content & Audience Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Content */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#090c13] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Top Performing Content</h3>
            <span className="text-xs text-indigo-400 font-semibold cursor-pointer hover:underline">
              View Detailed Breakdown
            </span>
          </div>

          <div className="space-y-3">
            {topContent.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">
                      {item.type}
                    </span>
                    <p className="text-xs font-bold text-white truncate">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-neutral-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-neutral-500" />
                      {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      {item.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                      {item.saves}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                      {item.shares}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics & Geographic Reach */}
        <div className="p-6 rounded-3xl bg-[#090c13] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white">Audience Demographics</h3>
          <p className="text-xs text-neutral-400 -mt-2">Geographic distribution of active watchers</p>

          <div className="space-y-3 pt-2">
            {demographics.map((item) => (
              <div key={item.country} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-neutral-300">
                    <span>{item.flag}</span>
                    <span>{item.country}</span>
                  </span>
                  <span className="font-mono font-bold text-white">{item.percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className="h-full rounded-full nexora-gradient"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monetization & Subscriptions Section */}
      <div className="p-6 rounded-3xl bg-[#090c13] border border-white/[0.08] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Creator Monetization & Membership Tiers
            </h3>
            <p className="text-xs text-neutral-400">
              Configure subscriber-exclusive stories, behind-the-scenes drops, and badge perks.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Payout Status: Active (Stripe / Bank Wire)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Supporter Tier */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Supporter</span>
              <span className="text-sm font-black text-indigo-400 font-mono">$4.99/mo</span>
            </div>
            <p className="text-xs text-neutral-400">Exclusive badge in comments & early access to posts.</p>
            <button className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer">
              Edit Tier
            </button>
          </div>

          {/* Insider Tier */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">VIP Insider</span>
              <span className="text-sm font-black text-indigo-300 font-mono">$9.99/mo</span>
            </div>
            <p className="text-xs text-neutral-300">Close Friends story access + direct private channel.</p>
            <button className="w-full py-2 rounded-xl nexora-gradient text-white text-xs font-semibold transition cursor-pointer">
              Manage Perks
            </button>
          </div>

          {/* Digital Drops */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Digital Collectibles</span>
              <span className="text-xs text-cyan-400 font-mono font-bold">3 Active Drops</span>
            </div>
            <p className="text-xs text-neutral-400">LUT presets, Lightroom filters, and generative stems.</p>
            <button className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer">
              Publish New Drop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
