import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle2, FileDown, Receipt } from 'lucide-react';

type ChatMessage = {
  id: string;
  who: 'user' | 'ai';
  text: string;
  ts: string;
};

const API_URL = (((import.meta as any) || {}).env?.VITE_API_URL as string) || 'http://localhost:4000';

function pickDecemberDateIso(): { iso: string; pretty: string } {
  const today = new Date();
  const year = today.getMonth() > 11 - 1 ? today.getFullYear() + 1 : today.getFullYear();
  const day = 14; // nice weekend mid-month default for demo
  const iso = `${year}-12-${String(day).padStart(2, '0')}`;
  const pretty = `December ${day}, ${year}`;
  return { iso, pretty };
}

function randomPhone(): string {
  // US-style demo number
  const base = 1000000 + Math.floor(Math.random() * 8999999);
  return `+1214${String(base).padStart(7, '0')}`;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const DemoChat2: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<any | null>(null);

  const [tourId, setTourId] = useState<string | null>(null);
  const [leadName, setLeadName] = useState<string>('');
  const [leadPhone, setLeadPhone] = useState<string>('');

  const urlify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, idx) => {
      if (part.match(urlRegex)) {
        return (
          <a key={idx} href={part} className="text-mauve underline" target="_blank" rel="noreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const addAi = (text: string) => {
    setMessages((m) => [
      ...m,
      { id: Math.random().toString(36).slice(2), who: 'ai', text, ts: new Date().toISOString() },
    ]);
  };
  const addUser = (text: string) => {
    setMessages((m) => [
      ...m,
      { id: Math.random().toString(36).slice(2), who: 'user', text, ts: new Date().toISOString() },
    ]);
  };

  // Ensure we have at least one tour to convert, otherwise create one quickly
  useEffect(() => {
    const w = window as any;
    if (w.__demoChat2Init) return;
    w.__demoChat2Init = true;

    (async () => {
      try {
        const state = await axios.get(`${API_URL}/api/state`);
        const tours = (state.data?.tours || []) as any[];
        if (tours.length > 0) {
          const pick = tours.find((t) => t.status === 'scheduled') || tours[0];
          setTourId(pick.id);
          const lead = (state.data?.leads || []).find((l: any) => l.id === pick.leadId);
          setLeadName(pick.leadName || lead?.name || 'Guest');
          setLeadPhone(lead?.phone || '');
        } else {
          const name = 'Ava & Liam';
          const phone = randomPhone();
          try {
            await axios.post(`${API_URL}/api/simulate/pricing-guide`, { name, phone, email: 'ava.liam@example.com' });
          } catch {}
          await axios.post(`${API_URL}/api/book`, {
            phone,
            date: 'today',
            time: '1pm',
          });
          const refreshed = await axios.get(`${API_URL}/api/state`);
          const rtours = (refreshed.data?.tours || []) as any[];
          const pick = rtours.find((t) => t.status === 'scheduled') || rtours[0];
          setTourId(pick?.id || null);
          const lead = (refreshed.data?.leads || []).find((l: any) => l.id === pick?.leadId);
          setLeadName(pick?.leadName || lead?.name || name);
          setLeadPhone(lead?.phone || phone);
        }
      } catch {}

      addAi(`So great showing you around today — you two have a beautiful vision.`);
      addAi(`When you're ready, I can reserve your date and send the booking packet. Just tell me you'd like to lock in December and I’ll take care of the rest.`);
    })();
  }, []);

  const { iso: decemberIso, pretty: decemberPretty } = useMemo(() => pickDecemberDateIso(), []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    addUser(text);
    setInput('');

    if (confirmed) return;

    setTyping(true);
    await wait(900);
    setTyping(false);

    // Always treat first reply as an intent to confirm for the December demo
    let bookingId: string | null = null;
    try {
      if (tourId) {
        const resp = await axios.post(`${API_URL}/api/confirm-event`, { tourId, eventDate: decemberIso });
        bookingId = resp.data?.booking?.id || null;
      }
    } catch {}

    setTyping(true);
    await wait(1200);
    addAi(`Wonderful — I’ve reserved ${decemberPretty} for you at The Rowan House.`);
    await wait(900);
    addAi(`I’m emailing your invoice and booking documents now. Once the retainer is in, the date is officially yours. I’m thrilled to celebrate with you!`);

    // Create demo invoice and show a pretty card with download
    try {
      if (bookingId) {
        const invResp = await axios.post(`${API_URL}/api/invoice`, { bookingId });
        setInvoice(invResp.data?.invoice || null);
        if (invResp.data?.invoice?.id) {
          const link = `${window.location.origin}/invoice/${invResp.data.invoice.id}`;
          addAi(`Here’s your invoice: ${link}`);
        }
      }
    } catch {}
    setTyping(false);
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 overflow-hidden">
        <div className="h-[520px] overflow-y-auto p-6 space-y-3 flex flex-col">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.who === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${m.who === 'user' ? 'bg-gradient-to-r from-blush to-mauve text-white' : 'bg-champagne/30 text-charcoal'} max-w-[70%] rounded-2xl px-4 py-3 shadow-soft`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{m.who === 'ai' ? urlify(m.text) : m.text}</p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-champagne/50 text-gray-700 max-w-[70%] rounded-2xl px-4 py-3 shadow-soft">
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
                  <span className="inline-block h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="inline-block h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-champagne/30">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder=""
                rows={2}
                className="w-full px-4 py-3 bg-champagne/30 border border-champagne/50 rounded-2xl text-charcoal placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blush/30 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-3 bg-gradient-to-r from-blush to-mauve text-white rounded-2xl shadow-soft hover:shadow-elegant transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {confirmed && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm shadow-card rounded-2xl border border-champagne/30 px-4 py-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <div className="text-sm text-gray-700">Wedding confirmed for {decemberPretty}. Check the Events tab.</div>
        </div>
      )}
    </div>
  );
};

export default DemoChat2;


