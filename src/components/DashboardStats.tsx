import { BarChart3, Clock, Trophy } from 'lucide-react';
import type { Session } from '../App';
import './DashboardStats.css';

interface DashboardStatsProps {
    sessions: Session[];
}

const DAILY_GOAL_MINUTES = 120; // 2 hours

export default function DashboardStats({ sessions }: DashboardStatsProps) {
    const totalMinutes = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
    const totalSessions = sessions.length;
    const progressPercentage = Math.min((totalMinutes / DAILY_GOAL_MINUTES) * 100, 100);

    const formatHoursMinutes = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="card stats-card">
            <h2 className="card-title">
                <BarChart3 size={24} />
                Today's Progress
            </h2>

            <div className="stats-grid">
                <div className="stat-box">
                    <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                        <Clock size={20} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Focus Time</span>
                        <span className="stat-value">{formatHoursMinutes(totalMinutes)}</span>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                        <Trophy size={20} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Sessions</span>
                        <span className="stat-value">{totalSessions}</span>
                    </div>
                </div>
            </div>

            <div className="progress-section">
                <div className="progress-header">
                    <span className="progress-label">Daily Goal ({formatHoursMinutes(DAILY_GOAL_MINUTES)})</span>
                    <span className="progress-text">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
