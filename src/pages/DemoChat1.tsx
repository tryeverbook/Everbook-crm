import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle2 } from 'lucide-react';
// no navigation on completion per request

type ChatMessage = {
  id: string;
  who: 'user' | 'ai';
  text: string;
  ts: string;
};

const API_URL = (((import.meta as any) || {}).env?.VITE_API_URL as string) || 'http://localhost:4000';
// Guard to avoid double intro in React Strict Mode during development
// Uses window-scoped flag so it persists across mount/unmount cycles


export const DemoChat1: React.FC = () => {
  const [input, setInput] = useState('');
  const [step, setStep] = useState<'init'|'askedTimes'|'pickedSlot'|'confirmed'>('init');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [leadPhone] = useState<string>('+15551234567');
  const [leadName] = useState<string>('Emma & Noah');
  const [typing, setTyping] = useState<boolean>(false);

  const addAi = (text: string) => {
    setMessages((m) => [...m, { id: Math.random().toString(36).slice(2), who: 'ai', text, ts: new Date().toISOString() }]);
  };
  const addUser = (text: string) => {
    setMessages((m) => [...m, { id: Math.random().toString(36).slice(2), who: 'user', text, ts: new Date().toISOString() }]);
  };

  // On mount, create lead and send initial messages (once per page load)
  useEffect(() => {
    const w = window as any;
    if (w.__demoChat1Init) return;
    w.__demoChat1Init = true;

    (async () => {
      try {
        // Create a lead via pricing-guide simulate
        await axios.post(`${API_URL}/api/simulate/pricing-guide`, {
          name: leadName,
          phone: leadPhone,
          email: 'emma.noah@example.com',
        });
      } catch {}

      // Add hardcoded initial messages
      addAi(`Hey Emma, thanks for inquiring! Did you get the pricing guide?`);
      addAi(`I'd love to invite you for a tour to see the space. What's a good time that works for you?`);
    })();
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    addUser(text);
    setInput('');

    if (step === 'init') {
      // User asks about availability - show hardcoded Saturday times
      setStep('askedTimes');
      setTyping(true);
      setTimeout(() => {
        addAi(`Absolutely! For Saturday (2025-09-27), I can host you at: 10:00, 11:30, 1:00, 4:30. Do any of these work for you?`);
        setTyping(false);
      }, 2000);
      return;
    }

    if (step === 'askedTimes') {
      // User picks 1pm - book the tour
      setStep('pickedSlot');
      setTyping(true);
      
      try {
        // Book the tour via API - this will move the lead to tours
        await axios.post(`${API_URL}/api/book`, { 
          phone: leadPhone, 
          date: '2025-09-27', 
          time: '13:00' 
        });
        
        setTimeout(() => {
          addAi(`Perfect! I've scheduled your tour. You should get a confirmation email.`);
          setTyping(false);
          setStep('confirmed');
          // No redirect; other pages will fetch server state when opened
        }, 2000);
      } catch (error) {
        setTimeout(() => {
          addAi(`Perfect! I've scheduled your tour. You should get a confirmation email.`);
          setTyping(false);
          setStep('confirmed');
          // No redirect
        }, 2000);
      }
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 overflow-hidden">
        <div className="h-[520px] overflow-y-auto p-6 space-y-3 flex flex-col">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.who === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${m.who === 'user' ? 'bg-gradient-to-r from-blush to-mauve text-white' : 'bg-champagne/30 text-charcoal'} max-w-[70%] rounded-2xl px-4 py-3 shadow-soft`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{m.text}</p>
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
      {step === 'confirmed' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm shadow-card rounded-2xl border border-champagne/30 px-4 py-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <div className="text-sm text-gray-700">Tour booked for Saturday (2025-09-27) at 1:00 PM. Lead moved to Tours tab.</div>
        </div>
      )}
    </div>
  );
};

export default DemoChat1;


