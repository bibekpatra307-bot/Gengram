import React, { useState } from 'react';
import { 
  User, Shield, Lock, Bell, Moon, Sun, Smartphone, 
  HelpCircle, AlertTriangle, Trash2, Check, BarChart3, 
  Eye, MessageSquare, Send, Sparkles, RefreshCw 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReportComplaint } from '../../types';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    currentUser, 
    updateCurrentUser, 
    submitReport, 
    reports 
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    'account' | 'privacy' | 'notifications' | 'creator' | 'theme' | 'reports'
  >('account');

  // Bug report state
  const [reportType, setReportType] = useState<ReportComplaint['type']>('bug');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSeverity, setReportSeverity] = useState<ReportComplaint['severity']>('medium');
  const [reportSubmittedToast, setReportSubmittedToast] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleSubmitBugReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDescription.trim()) return;

    submitReport({
      type: reportType,
      title: reportTitle.trim(),
      description: reportDescription.trim(),
      severity: reportSeverity
    });

    setReportTitle('');
    setReportDescription('');
    setReportSubmittedToast(true);
    setTimeout(() => setReportSubmittedToast(false), 3000);
  };

  const accentColors = [
    { id: 'indigo', name: 'Gengram Indigo', class: 'bg-indigo-500' },
    { id: 'purple', name: 'Cyber Purple', class: 'bg-purple-500' },
    { id: 'pink', name: 'Neon Pink', class: 'bg-pink-500' },
    { id: 'emerald', name: 'Nordic Emerald', class: 'bg-emerald-500' },
    { id: 'cyan', name: 'Tokyo Cyan', class: 'bg-cyan-500' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Toast */}
      {reportSubmittedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4" />
          Feedback ticket submitted to Gengram Core Engineering.
        </div>
      )}

      {/* Main Container */}
      <div className="bg-[#0d0d12]/90 border border-white/[0.08] rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl shadow-black/60 grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-white/[0.08] p-4 space-y-1 bg-[#09090e]/60">
          <div className="px-3 py-2 mb-2">
            <h2 className="text-sm font-extrabold text-white tracking-tight">Platform Settings</h2>
            <p className="text-[10px] text-neutral-400">Manage security, privacy, and interface</p>
          </div>

          <button
            onClick={() => setActiveSection('account')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSection === 'account' ? 'bg-white/[0.08] text-white shadow-sm ring-1 ring-white/[0.12]' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
            }`}
          >
            <User className="w-4 h-4 text-indigo-400" />
            Account & Security
          </button>

          <button
            onClick={() => setActiveSection('privacy')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSection === 'privacy' ? 'bg-white/[0.08] text-white shadow-sm ring-1 ring-white/[0.12]' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            Privacy & Permissions
          </button>

          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSection === 'notifications' ? 'bg-white/[0.08] text-white shadow-sm ring-1 ring-white/[0.12]' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
            }`}
          >
            <Bell className="w-4 h-4 text-pink-400" />
            Notification Alerts
          </button>

          <button
            onClick={() => setActiveSection('creator')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSection === 'creator' ? 'bg-white/[0.08] text-white shadow-sm ring-1 ring-white/[0.12]' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Creator & Analytics
          </button>

          <button
            onClick={() => setActiveSection('theme')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSection === 'theme' ? 'bg-white/[0.08] text-white shadow-sm ring-1 ring-white/[0.12]' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
            }`}
          >
            <Moon className="w-4 h-4 text-purple-400" />
            Appearance & Theme
          </button>

          <button
            onClick={() => setActiveSection('reports')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSection === 'reports' ? 'bg-white/[0.08] text-white shadow-sm ring-1 ring-white/[0.12]' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            Help, Feedback & Complaints
          </button>
        </div>

        {/* Section Content Panel */}
        <div className="md:col-span-8 p-6 overflow-y-auto space-y-6">
          {/* Account & Security */}
          {activeSection === 'account' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Account & Credential Security</h3>
                <p className="text-neutral-400">Manage identity credentials and two-factor authentication.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#09090e]/70 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Gengram Handle</div>
                    <div className="text-[11px] text-neutral-400">@{currentUser.username}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[10px] text-neutral-300">Verified</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <div>
                    <div className="font-semibold text-white">Account Email</div>
                    <div className="text-[11px] text-neutral-400">bibekpatra307@gmail.com</div>
                  </div>
                  <button className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer">Edit</button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#09090e]/70 border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Two-Factor Authentication (2FA)</div>
                    <div className="text-[11px] text-neutral-400">Require an authenticator code when logging into Gengram</div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => updateSettings({ twoFactorAuth: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div>
                    <div className="font-semibold text-white">Active Sessions</div>
                    <div className="text-[11px] text-emerald-400 font-medium">Chrome on macOS • San Francisco, US (Current)</div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 font-bold transition border border-white/[0.06] cursor-pointer">Log out other devices</button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  Danger Zone
                </div>
                <p className="text-[11px] text-neutral-400">
                  Deleting your account permanently wipes all your published media, reels, stories, direct messages, and followers.
                </p>
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Request Account Deletion
                </button>
              </div>
            </div>
          )}

          {/* Privacy & Permissions */}
          {activeSection === 'privacy' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Privacy & Safety Controls</h3>
                <p className="text-neutral-400">Control who can discover, message, and interact with your content.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#09090e]/70 border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Private Account</div>
                    <div className="text-[11px] text-neutral-400">Only approved followers can view your feed and reels</div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.isPrivateAccount}
                    onChange={(e) => updateSettings({ isPrivateAccount: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div>
                    <div className="font-semibold text-white">Show Activity Status</div>
                    <div className="text-[11px] text-neutral-400">Allow accounts you follow to see when you are online</div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.showActivityStatus}
                    onChange={(e) => updateSettings({ showActivityStatus: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div>
                    <div className="font-semibold text-white">Read Receipts</div>
                    <div className="text-[11px] text-neutral-400">Let senders know when you have read their direct messages</div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.readReceipts}
                    onChange={(e) => updateSettings({ readReceipts: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Notification Preferences</h3>
                <p className="text-neutral-400">Customize push notifications and alert digests.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#09090e]/70 border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Push Notifications</div>
                    <div className="text-[11px] text-neutral-400">Real-time alerts for likes, comments, and story replies</div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => updateSettings({ pushNotifications: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div>
                    <div className="font-semibold text-white">Weekly Creator Email Digest</div>
                    <div className="text-[11px] text-neutral-400">Summary of follower growth and trending conversations</div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(e) => updateSettings({ emailAlerts: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Creator & Analytics Dashboard */}
          {activeSection === 'creator' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Creator Studio & Analytics</h3>
                <p className="text-neutral-400">Performance insights on your visual publications.</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#09090e]/70 border border-white/[0.08] text-center">
                  <div className="text-lg font-black text-indigo-400">142.8K</div>
                  <div className="text-[10px] text-neutral-400">Total Impressions</div>
                  <div className="text-[9px] text-emerald-400 font-bold mt-1">+24.5% this week</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#09090e]/70 border border-white/[0.08] text-center">
                  <div className="text-lg font-black text-pink-400">8.4%</div>
                  <div className="text-[10px] text-neutral-400">Engagement Rate</div>
                  <div className="text-[9px] text-emerald-400 font-bold mt-1">Above average</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#09090e]/70 border border-white/[0.08] text-center">
                  <div className="text-lg font-black text-purple-400">14,280</div>
                  <div className="text-[10px] text-neutral-400">Followers</div>
                  <div className="text-[9px] text-emerald-400 font-bold mt-1">+342 new</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#09090e]/70 border border-white/[0.08] space-y-2">
                <div className="font-semibold text-white">4K Video Transcoding Engine</div>
                <p className="text-neutral-400">Your account is granted high-bitrate adaptive H.265/AV1 CDN streaming.</p>
                <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden mt-2">
                  <div className="gengram-gradient h-full w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Appearance & Theme */}
          {activeSection === 'theme' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Appearance & Visual Style</h3>
                <p className="text-neutral-400">Switch color modes and customize UI accent hues.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    settings.theme === 'dark' 
                      ? 'bg-white/[0.08] border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                      : 'bg-[#09090e]/70 border-white/[0.08] text-neutral-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-5 h-5 text-indigo-400 mb-2" />
                  <div className="font-bold text-white">OLED Dark Mode</div>
                  <div className="text-[10px] text-neutral-400">Deep blacks & high contrast</div>
                </button>

                <button
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    settings.theme === 'light' 
                      ? 'bg-white/[0.08] border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                      : 'bg-[#09090e]/70 border-white/[0.08] text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-400 mb-2" />
                  <div className="font-bold text-white">Studio Minimal Light</div>
                  <div className="text-[10px] text-neutral-400">Clean, daytime aesthetic</div>
                </button>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-2">Accent Highlight Hue</label>
                <div className="flex items-center gap-3">
                  {accentColors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => updateSettings({ accentColor: color.id as any })}
                      className={`w-8 h-8 rounded-full ${color.class} flex items-center justify-center transition cursor-pointer ${
                        settings.accentColor === color.id ? 'ring-4 ring-white/40 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {settings.accentColor === color.id && <Check className="w-4 h-4 text-white font-bold" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Help, Feedback & Complaint Center */}
          {activeSection === 'reports' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Help, Feedback & Bug Report Center</h3>
                <p className="text-neutral-400">Report bugs, submit complaints, or request new platform capabilities.</p>
              </div>

              <form onSubmit={handleSubmitBugReport} className="p-4 rounded-2xl bg-[#09090e]/70 border border-white/[0.08] space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Report Category</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#14141c] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="bug">Technical Bug / Glitch</option>
                      <option value="content_violation">Content / Policy Violation</option>
                      <option value="harassment">Harassment / Safety Issue</option>
                      <option value="spam">Spam / Bot Activity</option>
                      <option value="other">General Platform Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Severity</label>
                    <select
                      value={reportSeverity}
                      onChange={(e) => setReportSeverity(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#14141c] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="low">Low (Minor visual issue)</option>
                      <option value="medium">Medium (Feature degraded)</option>
                      <option value="high">High (Blocking/Safety critical)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Issue Title</label>
                  <input 
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Brief summary of the issue..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14141c] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Detailed Description & Steps to Reproduce</label>
                  <textarea 
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Please explain what happened, expected behavior, and device details..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14141c] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl gengram-gradient text-white font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
                  >
                    Submit Report Ticket
                  </button>
                </div>
              </form>

              {/* Submitted Tickets Log */}
              {reports.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Your Submitted Tickets</h4>
                  <div className="space-y-2">
                    {reports.map(rep => (
                      <div key={rep.id} className="p-3 rounded-xl bg-[#09090e]/70 border border-white/[0.08] flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-indigo-400 font-bold">{rep.ticketNumber}</span>
                            <span className="font-bold text-white">{rep.title}</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-1">{rep.description}</p>
                          <span className="text-[9px] text-neutral-500 mt-1 block">{rep.createdAt}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold capitalize">
                          {rep.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0d0d12] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete Gengram Account?</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              This will request an automated account deactivation. You will have 30 days to recover your data before permanent purging.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button 
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 text-xs font-bold transition border border-white/[0.08] cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('Account deletion scheduled in accordance with privacy compliance.');
                  setDeleteConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
