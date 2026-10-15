import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';
import {
  Radio,
  Send,
  Smile,
  Paperclip,
  Mic,
  MicOff,
  Users,
  FileText,
  MessageSquare,
  Sparkles,
  Bot,
  Check,
  Headphones,
} from 'lucide-react';

interface CollaborationHubViewProps {
  currentUser: UserProfile;
  users: UserProfile[];
  messages: ChatMessage[];
  onSendMessage: (text: string, channelId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
}

export const CollaborationHubView: React.FC<CollaborationHubViewProps> = ({
  currentUser,
  users,
  messages,
  onSendMessage,
  onAddReaction,
}) => {
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [inputText, setInputText] = useState('');
  const [isHuddleActive, setIsHuddleActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [sharedNotes, setSharedNotes] = useState<string>(
    `# Prime Plus Sprint Notes & Architectural Decisions\n\n## Web Dev Pipeline:\n- [x] Integrate Next.js 15 Server Actions with CSRF protection\n- [x] Configure Cloud SQL connection pool\n- [ ] Finalize client staging user acceptance test\n\n## UI/UX Deliverables:\n- Apex Design System tokens v2.1 approved by client\n- Lumina Luxury 3D interactive model optimized for mobile\n\n## Growth Marketing Strategy:\n- LinkedIn B2B campaign budget: $150/day\n- Google Performance Max keywords tested: 'Full Stack React Agency', 'Enterprise UI/UX Design'`
  );
  const [notesSaveStatus, setNotesSaveStatus] = useState('All changes saved');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels = [
    { id: 'general', name: 'general-hq', desc: 'Main agency sprint announcements' },
    { id: 'web-dev', name: 'web-development', desc: 'Code reviews, APIs, CI/CD' },
    { id: 'design-reviews', name: 'design-critique', desc: 'Figma mockups, tokens & brand' },
    { id: 'marketing-growth', name: 'marketing-roas', desc: 'PPC performance, SEO & analytics' },
    { id: 'client-apex', name: 'client-apex-global', desc: 'Direct client communication line' },
  ];

  const channelMessages = messages.filter((m) => m.channelId === activeChannel);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText, activeChannel);
    setInputText('');
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSharedNotes(e.target.value);
    setNotesSaveStatus('Saving...');
    setTimeout(() => {
      setNotesSaveStatus('All changes saved to team cloud');
    }, 400);
  };

  const quickReactions = ['🚀', '🔥', '✨', '👍', '❤️'];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Toolbar & Audio Huddle Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Team Real-Time Collaboration Hub
            </h1>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Live multi-user communication, collaborative scratchpad, and audio huddle
          </p>
        </div>

        {/* Audio Huddle Pill */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              isHuddleActive
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium">
              {isHuddleActive ? 'Huddle Live (4 In Call)' : 'Voice Huddle Idle'}
            </span>
            <button
              onClick={() => setIsHuddleActive(!isHuddleActive)}
              className="ml-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              {isHuddleActive ? 'Leave' : 'Join'}
            </button>
            {isHuddleActive && (
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className="p-1 rounded bg-slate-800 text-slate-200 hover:text-white cursor-pointer ml-1"
                title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMicMuted ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Collaboration Canvas: Left Channels & Chat, Right Collaborative Whiteboard/Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Channel List + Chat Room (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[650px] shadow-sm">
          {/* Top Channel Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-2 overflow-x-auto">
              {channels.map((ch) => {
                const isActive = ch.id === activeChannel;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    #{ch.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {channelMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=f59e0b&color=090d16&bold=true`;
                    }}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className={`max-w-[78%] ${isMe ? 'items-end' : ''}`}>
                    <div
                      className={`flex items-center gap-2 text-[11px] mb-1 ${
                        isMe ? 'justify-end' : ''
                      }`}
                    >
                      <span className="font-semibold text-slate-200">{msg.senderName}</span>
                      <span className="text-slate-500">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-amber-500 text-slate-950 font-medium'
                          : 'bg-slate-800 text-slate-100 border border-slate-700/60'
                      }`}
                    >
                      {msg.text}

                      {/* Attachment if present */}
                      {msg.attachmentName && (
                        <div
                          className={`mt-2 p-2 rounded flex items-center gap-2 text-[11px] ${
                            isMe ? 'bg-amber-600/30 text-slate-950 font-semibold' : 'bg-slate-900 text-slate-200'
                          }`}
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>{msg.attachmentName}</span>
                        </div>
                      )}
                    </div>

                    {/* Reactions */}
                    <div
                      className={`flex items-center gap-1.5 mt-1.5 ${
                        isMe ? 'justify-end' : ''
                      }`}
                    >
                      {msg.reactions.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => onAddReaction(msg.id, r.emoji)}
                          className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] flex items-center gap-1 text-slate-300 transition-colors cursor-pointer"
                        >
                          <span>{r.emoji}</span>
                          <span className="font-mono text-[10px]">{r.count}</span>
                        </button>
                      ))}

                      {/* Add reaction trigger */}
                      <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                        {quickReactions.slice(0, 3).map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => onAddReaction(msg.id, emoji)}
                            className="p-1 text-xs hover:scale-125 transition-transform cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${activeChannel}...`}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors cursor-pointer"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Side: Live Collaborative Scratchpad & Notes (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[650px] shadow-sm">
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-semibold text-white">
                Live Shared Scratchpad
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {notesSaveStatus}
            </span>
          </div>

          <div className="p-3 bg-slate-950/30 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Collaborative Markdown & Sprint Retrospective</span>
            <span className="tabular-nums font-mono text-[10px]">
              {sharedNotes.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <textarea
            value={sharedNotes}
            onChange={handleNotesChange}
            placeholder="Type sprint decisions, architectural notes, or task checklists here..."
            className="flex-1 p-4 bg-slate-950/20 text-slate-200 text-xs font-mono leading-relaxed resize-none focus:outline-none"
          />

          <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Multi-User Cloud Sync Enabled</span>
            </div>
            <button
              onClick={() => {
                setSharedNotes((prev) => prev + `\n\n### New Sprint Action Item (${new Date().toLocaleTimeString()}):\n- `);
              }}
              className="text-amber-400 hover:text-amber-300 text-xs font-medium cursor-pointer"
            >
              + Add Sprint Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
