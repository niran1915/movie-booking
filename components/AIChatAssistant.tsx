
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { gemini } from '../services/geminiService';

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hey! I\'m CineBot. Looking for something specific to watch or need help with booking?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const response = await gemini.getChatResponse(history, userMessage);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-6 z-[60]">
      {isOpen ? (
        <div className="w-80 h-96 glass rounded-2xl shadow-2xl flex flex-col border border-white/10 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-amber-500 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i className="fas fa-robot text-black"></i>
              <span className="font-bold text-black text-sm">CineBot AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-black/70 hover:text-black">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-xs ${
                  m.role === 'user' 
                    ? 'bg-amber-500 text-black font-medium rounded-tr-none' 
                    : 'bg-white/10 text-slate-100 rounded-tl-none border border-white/5'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-black/40 border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-grow bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500/50"
            />
            <button 
              onClick={handleSend}
              className="w-9 h-9 bg-amber-500 text-black rounded-lg flex items-center justify-center hover:bg-amber-400 transition-colors"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-amber-500 text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
        >
          <i className="fas fa-comment-dots text-xl"></i>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-600 border-2 border-[#0a0a0c]"></span>
          </span>
        </button>
      )}
    </div>
  );
};

export default AIChatAssistant;
