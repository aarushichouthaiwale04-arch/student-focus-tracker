import { useState } from 'react';
import { BookOpen, Plus, Tag } from 'lucide-react';
import type { Subject } from '../App';
import './SubjectManager.css';

interface SubjectManagerProps {
    subjects: Subject[];
    activeSubjectId: string | null;
    onSelectSubject: (id: string) => void;
    onAddSubject: (name: string, color: string) => void;
}

const PRESET_COLORS = [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f43f5e', // Rose
    '#f59e0b', // Amber
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#14b8a6', // Teal
];

export default function SubjectManager({
    subjects,
    activeSubjectId,
    onSelectSubject,
    onAddSubject
}: SubjectManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSubjectName.trim()) {
            onAddSubject(newSubjectName.trim(), selectedColor);
            setNewSubjectName('');
            setIsAdding(false);
            // Pick a random next color for convenience
            setSelectedColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
        }
    };

    return (
        <div className="card subject-card">
            <h2 className="card-title">
                <BookOpen size={24} />
                Study Subjects
            </h2>

            <div className="subjects-grid">
                {subjects.map((subject) => (
                    <button
                        key={subject.id}
                        className={`subject-btn ${activeSubjectId === subject.id ? 'active' : ''}`}
                        onClick={() => onSelectSubject(subject.id)}
                        style={{
                            '--subject-color': subject.color,
                            borderColor: activeSubjectId === subject.id ? subject.color : 'transparent',
                            backgroundColor: activeSubjectId === subject.id ? `${subject.color}15` : 'var(--bg-color)',
                        } as React.CSSProperties}
                    >
                        <span
                            className="subject-color-dot"
                            style={{ backgroundColor: subject.color }}
                        />
                        {subject.name}
                    </button>
                ))}

                {!isAdding && (
                    <button
                        className="subject-add-btn"
                        onClick={() => setIsAdding(true)}
                    >
                        <Plus size={18} />
                        Add Subject
                    </button>
                )}
            </div>

            {isAdding && (
                <form className="add-subject-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="E.g., Biology 101"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                            autoFocus
                            className="subject-input"
                        />
                    </div>

                    <div className="color-picker">
                        <label><Tag size={16} /> Color:</label>
                        <div className="color-options">
                            {PRESET_COLORS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={() => setIsAdding(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-submit"
                            disabled={!newSubjectName.trim()}
                            style={{ backgroundColor: selectedColor }}
                        >
                            Add
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
