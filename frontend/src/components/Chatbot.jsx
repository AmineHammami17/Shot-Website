import { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant S.HOT 🌿 Comment puis-je vous aider ?",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg = { id: Date.now(), text: trimmed, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      const reply = data.reply || "Je n'ai pas pu générer une réponse.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: reply, sender: 'bot' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Désolé, je rencontre un problème de connexion. Réessayez dans un instant !",
          sender: 'bot',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickReplies = [
    'Quels sont vos produits ?',
    'Quel est le prix ?',
    'Délai de livraison ?',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col items-end gap-3">

      {/* Chat window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[370px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden border border-gray-100"
          style={{ maxHeight: '520px', animation: 'chatSlideUp 0.25s ease' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a6e60] to-[#238d7b] px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🌿
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Assistant S.HOT</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  <span className="text-green-100 text-[10px] font-medium">En ligne</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Fermer le chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 flex flex-col gap-3 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#238d7b] flex items-center justify-center text-[10px] mr-2 mt-1 shrink-0">
                    🌿
                  </div>
                )}
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'bot'
                    ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    : 'bg-[#238d7b] text-white rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-[#238d7b] flex items-center justify-center text-[10px] shrink-0">
                  🌿
                </div>
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies — shown only when no conversation yet */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 flex-wrap shrink-0">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); setTimeout(handleSend, 0); }}
                  className="text-[11px] font-medium text-[#238d7b] border border-[#238d7b]/40 rounded-full px-3 py-1 hover:bg-[#238d7b] hover:text-white transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 items-center shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              type="text"
              placeholder="Écrivez votre message..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#238d7b]/30 transition disabled:opacity-50 placeholder:text-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="w-9 h-9 rounded-full bg-[#238d7b] flex items-center justify-center text-white hover:bg-[#1a6e60] transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed shrink-0 shadow-md"
              aria-label="Envoyer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-[#238d7b] text-white shadow-[0_8px_30px_rgba(35,141,123,0.5)] hover:bg-[#1a6e60] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center relative"
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
      >
        {/* Unread badge */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-[9px] font-bold">1</span>
          </span>
        )}

        {/* Icon toggle with smooth transition */}
        <span className={`absolute transition-all duration-200 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </span>
        <span className={`absolute transition-all duration-200 ${isOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
      </button>

      {/* CSS animation */}
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
