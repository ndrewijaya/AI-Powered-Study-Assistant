import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, User, Bot, Sparkles, Sun, Moon, Trash2, BookOpen, Zap, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message, Mode } from "../types";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isTyping: boolean;
  activeMode: Mode;
  onModeChange: (mode: Mode) => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  onClearHistory: () => void;
}

export default function ChatWindow({ 
  messages, 
  onSendMessage, 
  isTyping, 
  activeMode,
  onModeChange,
  onToggleDarkMode,
  isDarkMode,
  onClearHistory
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const modes: { id: Mode; label: string; icon: any }[] = [
    { id: "explain", label: "Explain", icon: BookOpen },
    { id: "quiz", label: "Quiz", icon: Zap },
    { id: "summary", label: "Summary", icon: ClipboardList },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 transition-colors">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">AI Tutor Assistant</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Specializing in academic excellence</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleDarkMode}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            onClick={onClearHistory}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Clear Chat History"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-8 py-6 space-y-8 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto"
            >
              <div className="bg-indigo-50 dark:bg-indigo-500/10 p-5 rounded-3xl mb-4 transition-colors">
                <Bot size={40} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Hello! I'm ScholarAI</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Choose a mode below and ask me anything. I'm trained to help you understand, not just give answers.
              </p>
            </motion.div>
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                message.role === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700'
              }`}>
                {message.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              
              <div className={`max-w-[80%] px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
                message.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-gray-800/40 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
              }`}>
                <div className="prose prose-sm max-w-none prose-slate dark:prose-invert">
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                   </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-gray-600 dark:text-gray-400" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 transition-colors">
        <div className="max-w-4xl mx-auto">
          {/* Internal Mode Toggles */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeMode === mode.id
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500 shadow-md scale-[1.02]"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                }`}
              >
                <mode.icon size={14} className={activeMode === mode.id ? "text-white" : "text-indigo-600 dark:text-indigo-400"} />
                <span>{mode.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="relative group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Type here for ${activeMode} mode...`}
              className="w-full pl-6 pr-14 py-4.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 dark:focus:border-indigo-500 transition-all dark:text-gray-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2.5 top-2.5 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all active:scale-90"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-4 font-medium uppercase tracking-wider">
            Socratic Method Active • Step-by-step guidance enabled
          </p>
        </div>
      </div>
    </div>
  );
}


