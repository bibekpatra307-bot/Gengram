import React, { useState, useEffect } from 'react';
import { 
  PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, 
  VolumeX, ShieldCheck, Sparkles, Maximize2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CallModal: React.FC = () => {
  const { activeCallState, setActiveCallState } = useApp();

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(activeCallState?.type === 'video');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!activeCallState?.isOpen) {
      setCallDuration(0);
      setIsConnected(false);
      return;
    }

    // Simulate connection after 2 seconds
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
    }, 2200);

    return () => clearTimeout(connectTimer);
  }, [activeCallState]);

  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  if (!activeCallState?.isOpen) return null;

  const user = activeCallState.user;
  const isVideoCall = activeCallState.type === 'video';

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setActiveCallState(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-lg h-[80vh] max-h-[680px] bg-[#0d0d12]/95 border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col justify-between p-6">
        {/* Top Header */}
        <div className="flex items-center justify-between text-xs text-neutral-400 z-10">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>End-to-End Encrypted HD Voice</span>
          </div>
          <span className="font-mono text-white font-bold">{formatTime(callDuration)}</span>
        </div>

        {/* Center Calling Avatar / Video Feed */}
        <div className="flex-1 flex flex-col items-center justify-center relative my-6">
          {isVideoCall && isConnected ? (
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black border border-white/[0.08] flex items-center justify-center">
              <img 
                src={user?.avatar} 
                alt="Video Participant"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-emerald-400 font-bold border border-white/[0.08]">
                1080p 60FPS
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              {/* Ripple Ring Animation */}
              <div className="relative">
                {!isConnected && (
                  <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping [animation-duration:2s]" />
                )}
                <img 
                  src={user?.avatar} 
                  alt={user?.displayName}
                  className="relative w-32 h-32 rounded-full object-cover ring-4 ring-indigo-500 shadow-2xl z-10"
                />
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-white tracking-tight">{user?.displayName}</h3>
                <p className="text-xs text-neutral-400 mt-1 font-medium">
                  {isConnected ? 'Connected • Audio Pipeline Live' : 'Calling on Gengram Direct...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Call Controls Toolbar */}
        <div className="flex items-center justify-center gap-5 z-10">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition cursor-pointer backdrop-blur-md ${
              isMuted ? 'bg-rose-600/80 text-white ring-2 ring-rose-400' : 'bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {isVideoCall && (
            <button 
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={`p-4 rounded-full transition cursor-pointer backdrop-blur-md ${
                !isVideoEnabled ? 'bg-rose-600/80 text-white ring-2 ring-rose-400' : 'bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-white'
              }`}
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          )}

          <button 
            id="end_call_button"
            onClick={handleEndCall}
            className="p-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/30 transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
