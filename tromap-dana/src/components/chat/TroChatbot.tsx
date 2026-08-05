'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Loader2,
  Sparkles,
  MapPin,
  Home,
  DollarSign,
  RefreshCw,
} from 'lucide-react';
import { NhaTro } from '@/types';
import { formatPrice } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  troSuggestions?: NhaTro[];
  timestamp: Date;
}

// Suggested questions
const SUGGESTED_QUESTIONS = [
  {
    icon: MapPin,
    text: 'Nhà trọ gần ĐH Bách Khoa',
    query: 'Tìm nhà trọ gần trường Đại học Bách Khoa Đà Nẵng',
  },
  {
    icon: DollarSign,
    text: 'Trọ giá dưới 2 triệu',
    query: 'Tìm nhà trọ giá dưới 2 triệu đồng/tháng',
  },
  {
    icon: Home,
    text: 'Trọ có máy lạnh',
    query: 'Tìm nhà trọ có máy lạnh',
  },
  {
    icon: Sparkles,
    text: 'Gợi ý cho sinh viên',
    query: 'Gợi ý nhà trọ phù hợp cho sinh viên mới',
  },
];

interface TroChatbotProps {
  troList: NhaTro[];
  onTroSelect?: (tro: NhaTro) => void;
}

export default function TroChatbot({ troList, onTroSelect }: TroChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là TroBot, trợ lý tìm nhà trọ của TroMapDana. Bạn cần tôi giúp gì hôm nay?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setHasUnread(false);
    } else if (isOpen && messages[messages.length - 1]?.role === 'assistant') {
      setHasUnread(true);
    }
  }, [messages, isOpen, isMinimized, scrollToBottom]);

  // Send message
  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          troList: troList.slice(0, 20), // Send limited data
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        troSuggestions: data.suggestions,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, tôi đang gặp sự cố. Bạn có thể thử lại sau không?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggested question
  const handleSuggestedQuestion = (query: string) => {
    sendMessage(query);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Xin chào! 👋 Tôi là TroBot, trợ lý tìm nhà trọ của TroMapDana. Bạn cần tôi giúp gì hôm nay?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Chat button */}
      <motion.button
        onClick={() => {
          setIsOpen(true);
          setHasUnread(false);
        }}
        className={`fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-gradient-to-r from-[#00B4D8] to-[#52B788] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center ${
          isOpen ? 'hidden' : 'flex'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
            !
          </span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : '600px',
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[9999] w-[380px] md:w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00B4D8] to-[#52B788] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">TroBot</h3>
                  <p className="text-white/80 text-xs">Trợ lý tìm nhà trọ</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-[#00B4D8] to-[#52B788] text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {msg.role === 'assistant' && (
                            <Bot className="w-4 h-4 mt-1 text-[#00B4D8] flex-shrink-0" />
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>

                        {/* Tro suggestions */}
                        {msg.troSuggestions && msg.troSuggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {msg.troSuggestions.slice(0, 3).map((tro) => (
                              <button
                                key={tro.id}
                                onClick={() => onTroSelect?.(tro)}
                                className="w-full text-left p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                              >
                                <p className="font-medium text-gray-900 text-sm">{tro.tieu_de}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                  <span className="text-[#52B788] font-semibold">
                                    {formatPrice(tro.gia_thang)}/tháng
                                  </span>
                                  {tro.dia_chi && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {tro.dia_chi.split(',')[0]}
                                    </span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">TroBot đang suy nghĩ...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested questions */}
                {messages.length === 1 && !isLoading && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-gray-500 mb-2">Gợi ý:</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_QUESTIONS.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestedQuestion(q.query)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                        >
                          <q.icon className="w-3 h-3" />
                          {q.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex items-end gap-2">
                    <button
                      onClick={clearChat}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                      title="Xóa cuộc trò chuyện"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Hỏi TroBot về nhà trọ..."
                        rows={1}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl resize-none focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none text-sm"
                        style={{ maxHeight: '120px' }}
                      />
                    </div>
                    <motion.button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isLoading}
                      className="p-3 bg-gradient-to-r from-[#00B4D8] to-[#52B788] text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
