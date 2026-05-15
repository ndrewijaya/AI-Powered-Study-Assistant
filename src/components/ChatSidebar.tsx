import { Search, Plus, MessageSquare, BookOpen, Calculator, Atom, Beaker, Trash2, Clock, X } from "lucide-react";
import { Subject, ChatSession } from "../types";

interface SidebarProps {
  activeSubject: Subject;
  onSubjectChange: (s: Subject) => void;
  onNewSession: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  className?: string;
  isDarkMode: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const subjects: { name: Subject; icon: any }[] = [
  { name: "Informatics", icon: MessageSquare },
  { name: "Math", icon: Calculator },
  { name: "Physics", icon: Atom },
  { name: "Biology", icon: Beaker },
];

export default function ChatSidebar({ 
  activeSubject, 
  onSubjectChange, 
  onNewSession, 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onDeleteSession,
  className = "",
  isOpenMobile = false,
  onCloseMobile
}: SidebarProps) {
  return (
    <aside className={`flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-transform duration-300 ${className} fixed md:static inset-y-0 left-0 z-50 w-72 transform ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-6 shrink-0">
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 rounded-lg p-1.5">
                <BookOpen className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">ScholarAI</h2>
            </div>
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="md:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <button 
            onClick={() => {
              onNewSession();
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 mb-6"
          >
            <Plus size={18} />
            <span>New Session</span>
          </button>

          <div className="space-y-1 mb-8">
            <p className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Subjects</p>
            {subjects.map((sub) => (
              <button
                key={sub.name}
                onClick={() => {
                  onSubjectChange(sub.name);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSubject === sub.name
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                }`}
              >
                <sub.icon size={18} className={activeSubject === sub.name ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-600"} />
                <span>{sub.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <p className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">History</p>
          <div className="space-y-1">
            {sessions.length === 0 ? (
              <p className="p-3 text-xs text-gray-400 dark:text-gray-600 text-center italic">No history yet</p>
            ) : (
              sessions.map((session) => (
                <div 
                  key={session.id}
                  className={`group flex items-center justify-between gap-1 w-full px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    currentSessionId === session.id
                      ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-100 dark:border-gray-700"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                  }`}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                >
                  <div className="flex flex-col gap-0.5 truncate flex-1">
                    <span className="truncate block font-semibold">{session.title}</span>
                    <div className="flex items-center gap-2 text-[10px] opacity-70">
                      <span className="capitalize">{session.subject}</span>
                      <span>•</span>
                      <span className="capitalize">{session.mode}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <GraduationCap className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">University Student</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Pro Account</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function GraduationCap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
