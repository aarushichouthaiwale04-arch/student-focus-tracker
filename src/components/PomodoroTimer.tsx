import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, GraduationCap } from 'lucide-react';
import type { Subject } from '../App';
import './PomodoroTimer.css';

interface PomodoroTimerProps {
    activeSubject?: Subject;
    onComplete: (durationMinutes: number) => void;
}

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

type TimerMode = 'work' | 'break';

export default function PomodoroTimer({ activeSubject, onComplete }: PomodoroTimerProps) {
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(WORK_MINUTES * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: number | undefined;

        if (isActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            setIsActive(false);
            if (mode === 'work') {
                onComplete(WORK_MINUTES);
                setMode('break');
                setTimeLeft(BREAK_MINUTES * 60);
            } else {
                setMode('work');
                setTimeLeft(WORK_MINUTES * 60);
            }

            // Play sound
            try {
                const audio = new Audio('/notification.mp3');
                audio.play().catch(e => console.log('Audio play failed:', e));
            } catch (e) {
                // Ignore audio errors
            }
        }

        return () => {
            if (interval !== undefined) {
                clearInterval(interval);
            }
        };
    }, [isActive, timeLeft, mode, onComplete]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'work') {
            setTimeLeft(WORK_MINUTES * 60);
        } else {
            setTimeLeft(BREAK_MINUTES * 60);
        }
    };

    const switchMode = (newMode: TimerMode) => {
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(newMode === 'work' ? WORK_MINUTES * 60 : BREAK_MINUTES * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = mode === 'work'
        ? ((WORK_MINUTES * 60 - timeLeft) / (WORK_MINUTES * 60)) * 100
        : ((BREAK_MINUTES * 60 - timeLeft) / (BREAK_MINUTES * 60)) * 100;

    // Use subject color for timer if studying, otherwise use primary
    const timerColor = mode === 'work' && activeSubject ? activeSubject.color : 'var(--primary)';

    return (
        <div className="card timer-card">
            <div className="timer-header">
                <h2 className="card-title">
                    {mode === 'work' ? <GraduationCap size={24} /> : <Coffee size={24} />}
                    {mode === 'work' ? 'Focus Session' : 'Short Break'}
                </h2>

                {mode === 'work' && activeSubject && (
                    <div className="active-subject-badge" style={{ backgroundColor: `${activeSubject.color}20`, color: activeSubject.color }}>
                        {activeSubject.name}
                    </div>
                )}
            </div>

            <div className="timer-mode-selector">
                <button
                    className={`mode-btn ${mode === 'work' ? 'active' : ''}`}
                    onClick={() => switchMode('work')}
                >
                    Pomodoro (25m)
                </button>
                <button
                    className={`mode-btn ${mode === 'break' ? 'active' : ''}`}
                    onClick={() => switchMode('break')}
                >
                    Short Break (5m)
                </button>
            </div>

            <div className="timer-display-container">
                <div
                    className="timer-circle"
                    style={{
                        background: `conic-gradient(${timerColor} ${progress}%, var(--primary-light) ${progress}%)`
                    }}
                >
                    <div className="timer-inner">
                        <div className="time-text">{formatTime(timeLeft)}</div>
                        <div className="time-status">{isActive ? 'Running' : 'Paused'}</div>
                    </div>
                </div>
            </div>

            <div className="timer-controls">
                <button
                    className="control-btn play-btn"
                    onClick={toggleTimer}
                    style={{ backgroundColor: isActive ? 'var(--warning, #f59e0b)' : timerColor }}
                >
                    {isActive ? (
                        <>
                            <Pause size={28} />
                            <span>Pause</span>
                        </>
                    ) : (
                        <>
                            <Play size={28} />
                            <span>Start</span>
                        </>
                    )}
                </button>
                <button className="control-btn reset-btn" onClick={resetTimer}>
                    <RotateCcw size={24} />
                    <span>Reset</span>
                </button>
            </div>
        </div>
    );
}
