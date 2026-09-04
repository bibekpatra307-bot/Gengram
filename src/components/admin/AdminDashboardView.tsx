import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, UserX, CheckCircle, XCircle, 
  Search, Award, Server, Activity, Database, Users, 
  Flag, MessageSquare, Trash2, ShieldAlert, Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ReportItem {
  id: string;
  type: 'post' | 'comment' | 'user';
  targetUser: string;
  reporter: string;
  reason: string;
  snippet: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
}

interface VerificationItem {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  category: string;
  followers: number;
  requestedBadge: 'Verified' | 'Creator' | 'Business';
  date: string;
}

export const AdminDashboardView: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'moderation' | 'verification' | 'system'>('moderation');
  
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: 'rep_1',
      type: 'comment',
      targetUser: 'crypto_bot_99',
      reporter: 'maya.chen',
      reason: 'Automated spam & malicious crypto phishing links',
      snippet: '"CLAIM FREE $5000 ETH NOW IN BIO DIRECT LINK"',
      severity: 'high',
      time: '12m ago'
    },
    {
      id: 'rep_2',
      type: 'post',
      targetUser: 'urban_shadows',
      reporter: 'liam_vance',
      reason: 'Copyright infringement on original spatial audio stem',
      snippet: 'Audio track re-uploaded without attribution or creative license',
      severity: 'medium',
      time: '34m ago'
    },
    {
      id: 'rep_3',
      type: 'user',
      targetUser: 'impersonator_vip',
      reporter: 'elena_rostova',
      reason: 'Impersonation of verified creator architecture portfolio',
      snippet: 'Cloned avatar, duplicated bio and reposting proprietary project photos',
      severity: 'high',
      time: '1h ago'
    }
  ]);

  const [verifications, setVerifications] = useState<VerificationItem[]>([
    {
      id: 'v_1',
      username: 'kai_design',
      displayName: 'Kai Sato',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      category: 'Design & Architecture',
      followers: 48200,
      requestedBadge: 'Creator',
      date: 'Today'
    },
    {
      id: 'v_2',
      username: 'nordic_minimalism',
      displayName: 'Nordic Studio',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      category: 'Interior & Industrial Design Brand',
      followers: 124000,
      requestedBadge: 'Business',
      date: 'Yesterday'
    }
  ]);

  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleResolveReport = (reportId: string, action: 'dismiss' | 'remove' | 'ban') => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    setActionSuccessMessage(
      action === 'dismiss' 
        ? 'Report dismissed as non-violating.' 
        : action === 'remove' 
          ? 'Offending content removed and warning issued.' 
          : 'User account suspended immediately.'
    );
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleVerifyDecision = (verificationId: string, approved: boolean) => {
    setVerifications((prev) => prev.filter((v) => v.id !== verificationId));
    setActionSuccessMessage(approved ? 'Account verified with official badge!' : 'Verification application declined.');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display flex items-center gap-2">
                Gengram Safety & Admin Console
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30">
                  SUPER ADMIN
                </span>
              </h1>
              <p className="text-xs text-neutral-400">
                Content moderation, creator verification, and platform safety.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-2xl border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'moderation' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Moderation Queue ({reports.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'verification' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Verification ({verifications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'system' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Telemetry</span>
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Quick Server Health Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#090c13] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Storage Engine</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-sm font-bold text-white">Operational (Healthy)</p>
          <p className="text-[10px] text-neutral-500">Sync Status: Active • Latency: 11ms</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#090c13] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Real-time Engine</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-sm font-bold text-white">Socket.IO WebSockets</p>
          <p className="text-[10px] text-neutral-500">Active rooms: 412 • Events/s: 2,890</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#090c13] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>AI Moderation Filter</span>
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
          </div>
          <p className="text-sm font-bold text-white">Safety Guardrails Active</p>
          <p className="text-[10px] text-neutral-500">Auto-flagged spam rate: 99.4%</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#090c13] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Platform Status</span>
            <span className="text-emerald-400 font-bold text-[10px]">99.98% SLA</span>
          </div>
          <p className="text-sm font-bold text-white">Operational</p>
          <p className="text-[10px] text-neutral-500">Zero degraded microservices</p>
        </div>
      </div>

      {/* Tab Content 1: Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="p-6 rounded-3xl bg-[#090c13] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-400" />
                Community Flagged Reports Queue
              </h2>
              <p className="text-xs text-neutral-400">Review pending user reports for spam, copyright, or harassment.</p>
            </div>
            <span className="text-xs text-neutral-500 font-mono">Auto-prioritized by AI severity</span>
          </div>

          {reports.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 space-y-2">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-400/60" />
              <p className="text-sm font-semibold text-neutral-300">Moderation Queue Clear</p>
              <p className="text-xs">No pending flags requiring manual staff review.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 hover:border-white/[0.1] transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rep.severity === 'high' 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {rep.severity} severity
                      </span>
                      <span className="text-xs font-bold text-white">Reported: @{rep.targetUser}</span>
                      <span className="text-[11px] text-neutral-500">by @{rep.reporter} • {rep.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'dismiss')}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-xs font-semibold transition cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'remove')}
                        className="px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
                      >
                        Remove Content
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'ban')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/40 hover:bg-rose-600/60 text-rose-200 border border-rose-500/40 text-xs font-semibold transition cursor-pointer"
                      >
                        Suspend User
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300">
                    <span className="text-neutral-500 font-semibold">Violation reason: </span>
                    {rep.reason}
                  </p>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-neutral-300 font-mono">
                    {rep.snippet}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Verification Workflow */}
      {activeTab === 'verification' && (
        <div className="p-6 rounded-3xl bg-[#090c13] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                Creator & Business Verification Applications
              </h2>
              <p className="text-xs text-neutral-400">Review authenticity proofs for official checkmarks.</p>
            </div>
          </div>

          {verifications.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 space-y-2">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-400/60" />
              <p className="text-sm font-semibold text-neutral-300">All Applications Processed</p>
              <p className="text-xs">No pending verification requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {verifications.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <img src={v.avatar} alt={v.displayName} className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/10" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{v.displayName}</span>
                        <span className="text-xs text-neutral-400">@{v.username}</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                          {v.requestedBadge} Badge
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">{v.category} • {(v.followers).toLocaleString()} followers</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerifyDecision(v.id, false)}
                      className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-xs font-semibold transition cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleVerifyDecision(v.id, true)}
                      className="px-4 py-2 rounded-xl nexora-gradient text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:opacity-90 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve & Grant Badge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: System Telemetry */}
      {activeTab === 'system' && (
        <div className="p-6 rounded-3xl bg-[#090c13] border border-white/[0.08] space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Microservices & Node.js Server Telemetry
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <span className="text-xs text-neutral-400">Memory Usage</span>
              <p className="text-lg font-bold text-white font-mono">142 MB / 512 MB</p>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-[28%]" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <span className="text-xs text-neutral-400">HTTP Request Rate</span>
              <p className="text-lg font-bold text-white font-mono">48.2 req/sec</p>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full w-[45%]" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <span className="text-xs text-neutral-400">Active Connections</span>
              <p className="text-lg font-bold text-white font-mono">4 Active / 10 Max</p>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-[40%]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
