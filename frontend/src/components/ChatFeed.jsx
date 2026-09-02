import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Send, Bot, User, Package } from 'lucide-react';
import { searchAssets, createRequest } from '../services/api';
import '../index.css';

const CATEGORIES = [
  { label: 'Generator', search: 'generator' },
  { label: 'Drone', search: 'drone' },
  { label: 'Robotics', search: 'robotics' },
  { label: 'Excavator', search: 'excavator' },
  { label: 'Tool', search: 'tool' },
];

const MAX_RESULTS = 3;
const CARD_STAGGER_MS = 80;

/** Returns color class based on health score */
function getHealthColor(score) {
  if (score >= 80) return 'bg-green-600';
  if (score >= 55) return 'bg-amber-500';
  return 'bg-red-500';
}

/** Returns text color class based on health score */
function getHealthTextColor(score) {
  if (score >= 80) return 'text-green-600';
  if (score >= 55) return 'text-amber-500';
  return 'text-red-500';
}

/**
 * SegmentedHealthBar — horizontal bar divided into 5 segments,
 * colored green/amber/red based on score.
 */
function SegmentedHealthBar({ score }) {
  const segments = 5;
  const filled = Math.min(segments, Math.round((score / 100) * segments));
  const empty = segments - filled;
  const colorClass = getHealthColor(score);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: filled }).map((_, i) => (
        <div key={`f-${i}`} className={`h-2.5 flex-1 ${colorClass} rounded-sm`} />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <div key={`e-${i}`} className="h-2.5 flex-1 border border-border rounded-sm" />
      ))}
    </div>
  );
}

/**
 * AssetCard — styled card with category icon panel, colored health bar,
 * status badge, corner-bracket accents. Rows in consistent order:
 * Health, Distance, Location, Daily Rate, ETA.
 */
function AssetCard({
  icon,
  name,
  assetCode,
  category,
  healthScore,
  distanceKm,
  locationLabel,
  dailyRate,
  etaLabel,
  status,
  onRequest,
  animationDelay,
}) {
  const [loading, setLoading] = useState(false);
  const healthColor = getHealthTextColor(healthScore);
  const isAvailable = status?.toUpperCase() === 'AVAILABLE';

  const handleRequest = async () => {
    setLoading(true);
    try {
      await onRequest();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="border border-border rounded-lg p-0 overflow-hidden max-w-xs animate-asset-enter"
      style={{ animationDelay: animationDelay || '0ms' }}
    >
      {/* Corner-bracket accents top */}
      <div className="flex justify-between px-3 pt-2 pb-0">
        <span className="text-ink text-xs leading-none">╔</span>
        <span className="text-ink text-xs leading-none">╗</span>
      </div>

      {/* Icon panel + info */}
      <div className="flex gap-3 p-3">
        <div className="w-14 h-14 bg-ink text-paper rounded-lg flex items-center justify-center shrink-0">
          {icon || <Package size={24} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink text-sm leading-tight truncate">{name}</p>
          <p className="text-xs text-muted">{assetCode} &middot; {category}</p>
          {/* Status badge */}
          <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            isAvailable ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-muted'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-muted'}`} />
            {status}
          </span>
        </div>
      </div>

      {/* Segmented health bar */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Health</span>
          <SegmentedHealthBar score={healthScore} />
          <span className={`text-xs font-medium ${healthColor}`}>{healthScore}</span>
        </div>
      </div>

      {/* Details — consistent order: Health, Distance, Location, Daily Rate, ETA */}
      <div className="px-3 pb-2 space-y-1.5 text-sm text-ink">
        <div className="flex justify-between">
          <span className="text-muted">Distance</span>
          <span>{Number(distanceKm)} km</span>
        </div>
        {locationLabel && (
          <div className="flex justify-between">
            <span className="text-muted">Location</span>
            <span>{locationLabel}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted">Daily Rate</span>
          <span>${Number(dailyRate).toFixed(2)}</span>
        </div>
        {etaLabel && (
          <div className="flex justify-between">
            <span className="text-muted">ETA</span>
            <span>{etaLabel}</span>
          </div>
        )}
      </div>

      {/* Corner-bracket accents bottom */}
      <div className="flex justify-between px-3 pb-2 pt-0">
        <span className="text-ink text-xs leading-none">╚</span>
        <span className="text-ink text-xs leading-none">╝</span>
      </div>

      {/* Request button */}
      <div className="px-3 pb-3">
        <button
          onClick={handleRequest}
          disabled={loading}
          className="w-full bg-ink text-paper py-2 rounded text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Requesting...' : 'Request Asset'}
        </button>
      </div>
    </div>
  );
}

/**
 * Translates common AI response snippets into a second language.
 * Only called on intro messages — returns null for everything else.
 */
function translateSnippet(englishText) {
  if (typeof englishText !== 'string') return null;
  const translations = {
    'Found a match': { lang: 'es', text: 'Se encontró una coincidencia' },
    'Found 2 matches': { lang: 'es', text: 'Se encontraron 2 coincidencias' },
    'Found 3 matches': { lang: 'es', text: 'Se encontraron 3 coincidencias' },
    'No assets found matching': { lang: 'es', text: 'No se encontraron activos que coincidan con' },
  };

  for (const [key, translation] of Object.entries(translations)) {
    if (englishText.includes(key)) {
      return { lang: translation.lang, text: translation.text };
    }
  }
  return null;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 text-muted text-sm py-2">
      <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

function CategoryChips({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3 mb-2">
      {CATEGORIES.map(({ label, search }) => (
        <button
          key={search}
          onClick={() => onSelect(search)}
          className="px-4 py-1.5 text-sm border border-ink text-ink rounded-full hover:bg-ink hover:text-paper transition-colors active:scale-95"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/**
 * ChatMessage — renders a single message.
 * Translation snippet only shown on intro messages ("Found N matches").
 */
function ChatMessage({ message, animationDelay }) {
  const isUser = message.role === 'user';
  const translation = !isUser ? translateSnippet(message.text) : null;

  return (
    <div
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-message-enter`}
      style={animationDelay ? { animationDelay } : undefined}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center shrink-0">
          <Bot size={16} />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block px-4 py-2 rounded-lg text-sm ${
            isUser
              ? 'bg-ink text-paper'
              : 'bg-transparent text-ink'
          }`}
        >
          {message.text}
        </div>

        {/* Translation badge — only on intro messages */}
        {translation && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-block px-1.5 py-0.5 bg-neutral-200 text-ink text-[10px] font-bold rounded uppercase">
              {translation.lang}
            </span>
            <span className="text-xs text-muted">{translation.text}</span>
          </div>
        )}

        {message.asset && (
          <div className="mt-2">
            <AssetCard
              name={message.asset.name}
              assetCode={message.asset.assetCode}
              category={message.asset.category}
              healthScore={message.asset.healthScore}
              distanceKm={message.asset.distanceKm}
              locationLabel={message.asset.locationLabel}
              dailyRate={message.asset.dailyRate}
              etaLabel={message.asset.etaLabel}
              status={message.asset.status}
              onRequest={message.onRequest}
              animationDelay={animationDelay}
            />
          </div>
        )}

        {message.isError && (
          <p className="text-xs text-muted mt-1">{message.errorText}</p>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center shrink-0">
          <User size={16} />
        </div>
      )}
    </div>
  );
}

function MessageInput({ onSend, onMicToggle, micActive, disabled }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3 bg-paper">
      <button
        type="button"
        onClick={onMicToggle}
        className={`p-2 rounded-full transition-colors ${
          micActive ? 'bg-ink text-paper mic-active' : 'text-muted hover:text-ink'
        }`}
        title={micActive ? 'Stop listening' : 'Start voice input'}
      >
        <Mic size={20} />
      </button>

      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={micActive ? 'Listening...' : 'Type a message...'}
        disabled={disabled}
        className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ink transition-colors disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="p-2 text-ink disabled:text-muted transition-colors"
        title="Send message"
      >
        <Send size={20} />
      </button>
    </form>
  );
}

/**
 * ChatFeed — manages messages, AI simulation, auto-scroll.
 */
export default function ChatFeed() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const simulateAI = useCallback(async (userText) => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1200));

    try {
      const results = await searchAssets(userText);
      const matches = results.slice(0, MAX_RESULTS);

      if (matches.length > 0) {
        const intro = {
          id: Date.now() + 1,
          role: 'ai',
          text: `Found ${matches.length} match${matches.length > 1 ? 'es' : ''} for that:`,
        };

        const cardMessages = matches.map((asset, idx) => ({
          id: Date.now() + 2 + idx,
          role: 'ai',
          asset,
          onRequest: async () => {
            try {
              const created = await createRequest(asset.id, 'Field Manager');
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now() + 100 + idx,
                  role: 'ai',
                  text: `Requisition submitted for ${asset.name} (ID: ${created.id}). Status: PENDING.`,
                },
              ]);
            } catch {
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now() + 101 + idx,
                  role: 'ai',
                  text: 'Failed to submit request. Please try again.',
                  isError: true,
                },
              ]);
            }
          },
        }));

        setMessages((prev) => [
          ...prev,
          intro,
          ...cardMessages.map((msg, idx) => ({
            ...msg,
            animationDelay: `${idx * CARD_STAGGER_MS}ms`,
          })),
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'ai',
            text: `No assets found matching "${userText}". Try searching for equipment like "generator", "drone", or "excavator".`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          text: 'Sorry, I could not connect to the backend. Make sure the Spring Boot server is running on port 8080.',
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const handleSend = (text) => {
    setShowChips(false);
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text }]);
    simulateAI(text);
  };

  const toggleMic = () => {
    setMicActive((prev) => !prev);
  };

  useEffect(() => {
    setMessages([
      {
        id: 0,
        role: 'ai',
        text: 'Hello! I\'m your Field Ops assistant. Tell me what equipment you need — type or use the mic — and I\'ll find the best match.',
      },
    ]);
  }, []);

  return (
    <div className="flex flex-col h-full bg-paper">
      <header className="border-b border-border px-4 py-3 bg-paper">
        <h1 className="text-lg font-semibold text-ink">Field Ops Asset Requisition</h1>
        <p className="text-xs text-muted">AI-powered equipment assistant</p>
      </header>

      <div ref={feedRef} className="flex-1 overflow-y-auto chat-scroll px-4 py-4">
        {messages.map((msg) => {
          const delay = msg.animationDelay || undefined;
          return <ChatMessage key={msg.id} message={msg} animationDelay={delay} />;
        })}

        {showChips && messages.length > 0 && !isTyping && (
          <CategoryChips onSelect={handleSend} />
        )}

        {isTyping && (
          <div className="flex gap-3 justify-start mb-4">
            <div className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <TypingIndicator />
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSend}
        onMicToggle={toggleMic}
        micActive={micActive}
        disabled={isTyping}
      />
    </div>
  );
}
