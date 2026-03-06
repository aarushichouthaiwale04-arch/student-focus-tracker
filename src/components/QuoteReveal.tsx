import { useEffect, useState } from 'react';
import { Quote, X, Sparkles } from 'lucide-react';
import './QuoteReveal.css';

interface QuoteRevealProps {
    onClose: () => void;
}

const QUOTES = [
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
];

export default function QuoteReveal({ onClose }: QuoteRevealProps) {
    const [quote, setQuote] = useState(QUOTES[0]);

    useEffect(() => {
        // Pick a random quote on mount
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        setQuote(randomQuote);

        // Auto-close after 8 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 8000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="quote-overlay">
            <div className="quote-card animate-popup">
                <button className="quote-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="quote-icon">
                    <Quote size={40} />
                </div>

                <div className="quote-content">
                    <div className="quote-header">
                        <Sparkles size={18} className="sparkle-icon" />
                        <span>Session Completed!</span>
                        <Sparkles size={18} className="sparkle-icon" />
                    </div>
                    <p className="quote-text">"{quote.text}"</p>
                    <p className="quote-author">— {quote.author}</p>
                </div>

                <button className="quote-continue-btn" onClick={onClose}>
                    Continue Building GREATNESS
                </button>
            </div>
        </div>
    );
}
