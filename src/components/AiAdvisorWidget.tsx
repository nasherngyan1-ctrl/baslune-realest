import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MessageSquare, Send, X } from 'lucide-react';
import { ChatMessage, Language } from '../types/estate';
import { TranslationBundle } from '../i18n/translations';
import { getLocalAdvisorReply } from '../utils/localAdvisor';

interface AiAdvisorWidgetProps {
  language: Language;
  t: TranslationBundle;
  activePropertyId?: string | null;
  activePropertyTitle?: string;
}

export const AiAdvisorWidget: React.FC<AiAdvisorWidgetProps> = ({
  language,
  t,
  activePropertyId,
  activePropertyTitle,
}) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: t.advisor.welcome,
        timestamp: 'now',
      },
    ]);
  }, [language, t.advisor.welcome]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, open]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const minTypingDelay = new Promise<void>((resolve) => setTimeout(resolve, 600));
    let replyText: string | null = null;

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 4000);

      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          language,
          contextProperty: activePropertyTitle ?? '',
        }),
        signal: controller.signal,
      });

      window.clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as { fallback?: boolean; reply?: string | null };
        if (!data.fallback && typeof data.reply === 'string' && data.reply.trim()) {
          replyText = data.reply.trim();
        }
      }
    } catch {
      // Seamless local fallback guaranteed below
    }

    await minTypingDelay;

    const finalReply = replyText || getLocalAdvisorReply(trimmed, language, activePropertyId);

    setMessages((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: finalReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-5 end-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 20, scale: 0.92 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.94 }
            }
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="mb-3.5 w-[calc(100vw-2.5rem)] sm:w-[390px] rounded-2xl bg-[#14171F] border border-[#D4AF37]/40 shadow-2xl overflow-hidden flex flex-col max-h-[520px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-[#0B0D11] border-b border-[#E5C97B]/15">
              <div>
                <div className="text-sm font-semibold text-[#F5F3EE]">{t.advisor.title}</div>
                <div className="text-[11px] text-[#B8B3A8]">{t.advisor.subtitle}</div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.modal.close}
                className="p-1.5 rounded-lg text-[#B8B3A8] hover:text-[#F5F3EE] hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0F1219]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#D4AF37] text-[#0B0D11] font-medium'
                        : 'bg-[#14171F] text-[#F5F3EE] border border-[#E5C97B]/15'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 bg-[#14171F] border border-[#E5C97B]/15 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              )}

              <div ref={scrollEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-[#14171F] border-t border-white/8 flex gap-1.5 overflow-x-auto">
              {t.advisor.quickPrompts.map((prompt, idx) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-[#0B0D11] border border-[#E5C97B]/20 text-[11px] text-[#E5C97B] hover:border-[#D4AF37] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2 p-3 bg-[#0B0D11] border-t border-[#E5C97B]/15"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.advisor.placeholder}
                className="flex-1 bg-[#14171F] border border-white/12 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#F5F3EE] placeholder:text-[#B8B3A8]/60 focus:outline-none focus:border-[#D4AF37]"
              />
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label={t.advisor.send}
                className="p-2.5 rounded-xl bg-[#D4AF37] text-[#0B0D11] hover:bg-[#E5C97B] disabled:opacity-45 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Gold Advisor Button with Soft Concentric Breathing Ring */}
      <div className="relative inline-flex">
        {!prefersReducedMotion && !open && (
          <motion.span
            aria-hidden="true"
            animate={{
              scale: [1, 1.18, 1],
              opacity: [0.45, 0.08, 0.45],
            }}
            transition={{
              duration: 2.8,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            className="pointer-events-none absolute -inset-1.5 rounded-2xl border border-[#D4AF37]/60"
          />
        )}

        <motion.button
          whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.03 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#D4AF37] text-[#0B0D11] font-semibold text-sm shadow-[0_8px_28px_rgba(212,175,55,0.3)] hover:bg-[#E5C97B] transition-colors whitespace-nowrap cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.advisor.buttonLabel}</span>
        </motion.button>
      </div>
    </div>
  );
};
