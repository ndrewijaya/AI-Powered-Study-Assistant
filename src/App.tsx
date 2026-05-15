/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import { Mode, Subject, Message, ChatSession } from './types';
import { aiService } from './services/ai';
import { motion, AnimatePresence } from 'motion/react';
import { Menu } from 'lucide-react';

export default function App() {
  const [showApp, setShowApp] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('scholarai_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    return localStorage.getItem('scholarai_current_session_id');
  });

  const [activeSubject, setActiveSubject] = useState<Subject>('Informatics');
  const [activeMode, setActiveMode] = useState<Mode>('explain');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('scholarai_darkmode');
    return saved === 'true';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const appSectionRef = useRef<HTMLDivElement>(null);

  // Sync current session data when sessionId changes
  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      if (session) {
        setMessages(session.messages);
        setActiveSubject(session.subject);
        setActiveMode(session.mode);
      }
    } else {
      setMessages([]);
      setActiveSubject('Informatics');
      setActiveMode('explain');
    }
    localStorage.setItem('scholarai_current_session_id', currentSessionId || '');
  }, [currentSessionId]);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('scholarai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Update current session in the list whenever messages, subject or mode changes
  useEffect(() => {
    if (currentSessionId) {
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          // Update title based on first message if it's default
          let title = s.title;
          if (title === 'New Session' && messages.length > 0) {
            title = messages[0].content.slice(0, 30) + (messages[0].content.length > 30 ? '...' : '');
          }
          return { ...s, messages, subject: activeSubject, mode: activeMode, title };
        }
        return s;
      }));
    }
  }, [messages, activeSubject, activeMode]);

  useEffect(() => {
    localStorage.setItem('scholarai_darkmode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const handleStart = () => {
    setShowApp(true);
    if (sessions.length === 0) {
      handleNewSession();
    }
    setTimeout(() => {
      appSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      subject: 'Informatics',
      mode: 'explain',
      messages: [],
      title: 'New Session'
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(null);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      setMessages([]);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        subject: activeSubject,
        mode: activeMode,
        messages: [],
        title: content.slice(0, 30) + (content.length > 30 ? '...' : '')
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const modelMessageId = (Date.now() + 1).toString();
      let fullContent = "";

      setMessages(prev => [...prev, {
        id: modelMessageId,
        role: 'model',
        content: "",
        timestamp: Date.now()
      }]);

      const stream = aiService.sendMessageStream(
        content,
        messages.concat(userMessage),
        activeMode,
        activeSubject
      );

      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => prev.map(m => 
          m.id === modelMessageId ? { ...m, content: fullContent } : m
        ));
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "I apologize, but I'm having trouble connecting to my academic sources right now. Please try again in a moment.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubjectChange = (subject: Subject) => {
    setActiveSubject(subject);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/30 selection:text-indigo-900 transition-colors duration-300">
      <AnimatePresence mode="wait">
        {!showApp ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onStart={handleStart} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-screen flex flex-col md:flex-row overflow-hidden"
            ref={appSectionRef}
          >
            {/* Mobile Subject Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Menu size={20} className="dark:text-gray-400" />
                </button>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">ScholarAI</span>
              </div>
              <select 
                value={activeSubject} 
                onChange={(e) => handleSubjectChange(e.target.value as Subject)}
                className="bg-transparent text-sm font-medium focus:outline-none dark:text-gray-200"
              >
                <option value="Informatics">Informatics</option>
                <option value="Math">Math</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            {/* Mobile Backdrop */}
            {isMobileSidebarOpen && (
              <div 
                className="fixed inset-0 bg-gray-900/50 dark:bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            )}

            <ChatSidebar 
              activeSubject={activeSubject} 
              onSubjectChange={handleSubjectChange} 
              onNewSession={handleNewSession}
              sessions={sessions}
              currentSessionId={currentSessionId}
              onSelectSession={setCurrentSessionId}
              onDeleteSession={handleDeleteSession}
              className="md:flex md:w-72 shrink-0"
              isDarkMode={isDarkMode}
              isOpenMobile={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
            
            <main className="flex-1 relative flex flex-col min-w-0">
              <ChatWindow 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                isTyping={isTyping} 
                activeMode={activeMode}
                onModeChange={setActiveMode}
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                isDarkMode={isDarkMode}
                onClearHistory={handleClearHistory}
              />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

