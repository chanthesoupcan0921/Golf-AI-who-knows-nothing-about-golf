import React, { useState, useRef, useEffect } from 'react';
import { Send, Trophy, HelpCircle } from 'lucide-react';
import { Message } from '../types';
import { sendChatMessage } from '../services/geminiService';

const QUICK_PROMPTS = [
  "How do I fix my slice?",
  "My driver is behaving badly",
  "I am stuck in a bunker",
  "What is the best wood?",
  "Help me with my grip"
];

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Welcome to the Tee. I am your Caddie (a container for tea). Ask me how to improve your 'swing', whatever that means.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendChatMessage(history, userMsg.text);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
      <div className="bg-gray-800 p-4 text-gray-100 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-club-gold" />
          <h2 className="font-serif text-xl font-bold text-gray-100">The Caddie Shack</h2>
        </div>
        <span className="text-xs text-club-gold uppercase tracking-widest">Expert Advice</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800/50" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-emerald-700 text-white rounded-br-none border border-emerald-600'
                  : 'bg-gray-700 border border-gray-600 text-gray-100 rounded-bl-none shadow-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <span className={`text-[10px] mt-2 block ${msg.role === 'user' ? 'text-emerald-200' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-gray-700 border border-gray-600 p-4 rounded-2xl rounded-bl-none">
              <span className="text-sm text-gray-400 italic">Consulting the tea leaves...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="whitespace-nowrap px-3 py-1.5 bg-gray-800 text-emerald-400 text-xs font-medium rounded-full border border-gray-600 hover:border-club-gold hover:text-club-gold transition-colors flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
            placeholder="Ask about your slice, grip, or irons..."
            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-gold/50 focus:border-transparent text-gray-100 placeholder:text-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={isLoading}
            className="bg-emerald-700 hover:bg-emerald-600 text-white p-3 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;