import React, { useState } from 'react';
import { MessageCircle, Phone, X, ExternalLink, Send, Sparkles } from 'lucide-react';

export const WHATSAPP_NUMBER = '03023608248';
export const WHATSAPP_INTL_NUMBER = '923023608248';
export const WHATSAPP_DISPLAY = '+92 302 3608248';

export const getWhatsAppUrl = (message?: string) => {
  const defaultMsg = 'Hello Prime Plus Team, I would like to discuss a project / services.';
  const encoded = encodeURIComponent(message || defaultMsg);
  return `https://wa.me/${WHATSAPP_INTL_NUMBER}?text=${encoded}`;
};

export const WhatsAppQuickButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickTemplates = [
    'Hello Prime Plus Team! I want to discuss a new Web Development project.',
    'Hi! I need Graphic Design & Branding services for my company.',
    'Hello! I want to inquire about Digital Marketing & SEO campaigns.',
    'Hi, I have a question regarding my ongoing project deliverables.',
  ];

  const handleSend = (text: string) => {
    const url = getWhatsAppUrl(text);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {/* Popover Card */}
      {isOpen && (
        <div className="absolute bottom-14 left-0 w-80 sm:w-88 bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-slate-200 mb-2">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">
                  Prime Plus Team WhatsApp
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {WHATSAPP_DISPLAY} · Online
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Prose */}
          <p className="text-[11px] text-slate-300 mt-3 leading-relaxed">
            Rabta karein direct hamari team se WhatsApp par. Web Development, Graphic Design aur Digital Marketing ke hawalay se fori jawab hasil karein.
          </p>

          {/* Quick Starter Templates */}
          <div className="mt-3 space-y-1.5">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Quick Messages:
            </p>
            {quickTemplates.map((template, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(template)}
                className="w-full text-left p-2 rounded-lg bg-slate-950/70 hover:bg-emerald-950/40 border border-slate-800/80 hover:border-emerald-500/40 text-[11px] text-slate-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
              >
                <span className="truncate pr-2">{template}</span>
                <Send className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0 transition-colors" />
              </button>
            ))}
          </div>

          {/* Custom Message Input */}
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type custom message..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customMsg.trim()) {
                    e.preventDefault();
                    handleSend(customMsg);
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={() => handleSend(customMsg.trim() || 'Hello Prime Plus Team!')}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Send</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full shadow-2xl shadow-emerald-500/30 transition-all transform hover:scale-105 cursor-pointer font-bold text-xs ring-2 ring-emerald-400/20"
        title={`WhatsApp: ${WHATSAPP_DISPLAY}`}
      >
        <div className="relative">
          <MessageCircle className="w-4 h-4 fill-current" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white animate-ping" />
        </div>
        <span className="font-semibold tracking-wide">
          WhatsApp: {WHATSAPP_NUMBER}
        </span>
      </button>
    </div>
  );
};
