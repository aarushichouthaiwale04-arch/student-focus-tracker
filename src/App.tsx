import { useState, useEffect } from 'react';
import { Timer, Moon, Sun } from 'lucide-react';
import PomodoroTimer from './components/PomodoroTimer';
import SubjectManager from './components/SubjectManager';
import DashboardStats from './components/DashboardStats';
import QuoteReveal from './components/QuoteReveal';

export type Subject = {
  id: string;
  name: string;
  color: string;
};

export type Session = {
  id: string;
  subjectId: string;
  durationMinutes: number;
  timestamp: Date;
};

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'Mathematics', color: 'var(--primary)' },
    { id: '2', name: 'Computer Science', color: 'var(--success)' },
    { id: '3', name: 'Literature', color: 'var(--accent)' },
  ]);

  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(subjects.length > 0 ? subjects[0].id : null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference on init
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleSessionComplete = (durationMinutes: number) => {
    if (!activeSubjectId) return;

    const newSession: Session = {
      id: crypto.randomUUID(),
      subjectId: activeSubjectId,
      durationMinutes,
      timestamp: new Date(),
    };

    setSessions(prev => [...prev, newSession]);
    setShowQuote(true);
  };

  const handleAddSubject = (name: string, color: string) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    setSubjects(prev => [...prev, newSubject]);
    if (!activeSubjectId) {
      setActiveSubjectId(newSubject.id);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Timer className="header-icon" size={28} />
          <h1>Student Focus Tracker</h1>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          style={{ position: 'absolute', right: '2rem' }}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="main-content">
        <div className="left-column" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <PomodoroTimer
            activeSubject={subjects.find(s => s.id === activeSubjectId)}
            onComplete={handleSessionComplete}
          />

          <DashboardStats sessions={sessions} />
        </div>

        <div className="right-column" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SubjectManager
            subjects={subjects}
            activeSubjectId={activeSubjectId}
            onSelectSubject={setActiveSubjectId}
            onAddSubject={handleAddSubject}
          />
        </div>
      </main>

      {showQuote && <QuoteReveal onClose={() => setShowQuote(false)} />}
    </div>
  );
}

export default App;
