import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Send, Bot, User, Package, Zap, Globe } from 'lucide-react';
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

function getHealthColor(score) {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 55) return 'bg-amber-400';
  return 'bg-rose-500';
}

function getHealthTextColor(score) {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 55) return 'text-amber-400';
  return 'text-rose-500';
}

function SegmentedHealthBar({ score }) {
  const segments = 5;
  const filled = Math.min(segments, Math.round((score / 100) * segments));
  const empty = segments - filled;
  const colorClass = getHealthColor(score);
  return (
    <div className="flex gap-0.5 flex-1">
      {Array.from({ length: filled }).map((_, i) => (
        <div key={`f-${i}`} className={`h-2.5 flex-1 ${colorClass} rounded-sm`} />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <div key={`e-${i}`} className="h-2.5 flex-1 bg-slate-200 rounded-sm" />
      ))}
    </div>
  );
}

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
      className="bg-white rounded-2xl w-full shadow-card animate-asset-enter border border-slate-100"
      style={{ animationDelay: animationDelay || '0ms' }}
    >
      {/* Colored top accent stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400" />

      {/* Icon panel + info */}
      <div className="flex gap-3 p-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md"
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)' }}
        >
          {icon || <Package size={22} className="text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm leading-snug break-words">
            {name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {assetCode} &middot; {category}
          </p>
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-500 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {status}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-slate-200 text-slate-500">
              {status}
            </span>
          )}
        </div>
      </div>

      {/* Segmented health bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Health</span>
          <SegmentedHealthBar score={healthScore} />
          <span className={`text-xs font-bold ${healthColor} whitespace-nowrap`}>{healthScore}</span>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 pb-3 space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Distance</span>
          <span className="text-slate-700 font-medium">{Number(distanceKm)} km</span>
        </div>
        {locationLabel && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Location</span>
            <span className="text-slate-700 font-medium text-right ml-2">{locationLabel}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Daily Rate</span>
          <span className="text-slate-700 font-medium">${Number(dailyRate).toFixed(2)}</span>
        </div>
        {etaLabel && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">ETA</span>
            <span className="text-slate-700 font-medium">{etaLabel}</span>
          </div>
        )}
      </div>

      {/* Gradient Request button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleRequest}
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)' }}
        >
          {loading ? 'Requesting...' : 'Request Asset'}
        </button>
      </div>
    </div>
  );
}

function translateSnippet(englishText) {
  if (typeof englishText !== 'string') return null;
  const translations = {
    'Found a match': { lang: 'es', text: 'Se encontró una coincidencia' },
    'Found 2 matches': { lang: 'es', text: 'Se encontraron 2 coincidencias' },
    'Found 3 matches': { lang: 'es', text: 'Se encontraron 3 coincidencias' },
    'No assets found matching': {
      lang: 'es',
      text: 'No se encontraron activos que coincidan con',
    },
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
    <div className="flex items-center gap-1.5 px-4 py-3 bg-white rounded-2xl rounded-bl-md shadow-bubble">
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

function CategoryChips({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4 mb-4">
      {CATEGORIES.map(({ label, search }) => (
        <button
          key={search}
          onClick={() => onSelect(search)}
          className="px-4 py-1.5 text-xs font-semibold border-2 border-white/30 text-white rounded-full hover:bg-white/20 backdrop-blur-sm transition-all duration-200 active:scale-95"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ChatMessage({ message, animationDelay }) {
  const isUser = message.role === 'user';
  const translation = !isUser ? translateSnippet(message.text) : null;
  const hasText = !!message.text;

  return (
    <div
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-message-enter`}
      style={animationDelay ? { animationDelay } : undefined}
    >
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md mt-1"
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)' }}
        >
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        {/* Only render text bubble if there is text */}
        {hasText && (
          <div
            className={`inline-block px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              isUser
                ? 'text-white rounded-br-md shadow-md'
                : 'bg-white text-slate-700 rounded-bl-md shadow-bubble'
            }`}
            style={
              isUser
                ? { background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }
                : undefined
            }
          >
            {message.text}
          </div>
        )}

        {/* Translation chip */}
        {translation && (
          <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full w-fit">
            <Globe size={12} className="text-white/80" />
            <span className="text-[11px] font-medium text-white/90">
              {translation.text}
            </span>
          </div>
        )}

        {/* Asset card */}
        {message.asset && (
          <div className="mt-3 w-full max-w-xs">
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
          <p className="text-xs text-white/60 mt-1">{message.errorText}</p>
        )}
      </div>

      {isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md mt-1"
          style={{ background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)' }}
        >
          <User size={16} className="text-white" />
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

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-slate-100"
    >
      {/* Mic button — always visible */}
      <button
        type="button"
        onClick={onMicToggle}
        className={`p-2.5 rounded-full transition-all duration-200 shrink-0 ${
          micActive
            ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-md mic-active'
            : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50 active:scale-95'
        }`}
        title={micActive ? 'Stop listening' : 'Start voice input'}
      >
        <Mic size={20} />
      </button>

      {/* Input field */}
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={micActive ? 'Listening...' : 'Type a message...'}
        disabled={disabled}
        className="flex-1 min-w-0 bg-slate-100 rounded-full px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:bg-white transition-all duration-200 disabled:opacity-50"
      />

      {/* Send button — always visible */}
      <button
        type="submit"
        disabled={!canSend}
        className={`p-2.5 rounded-full transition-all duration-200 shrink-0 active:scale-95 ${
          canSend
            ? 'text-white shadow-md hover:shadow-lg hover:brightness-110'
            : 'text-slate-300 cursor-default'
        }`}
        style={
          canSend
            ? { background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)' }
            : { background: '#E2E8F0' }
        }
        title="Send message"
      >
        <Send size={20} />
      </button>
    </form>
  );
}

export default function ChatFeed() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
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
        text: "Hello! I'm your Field Ops assistant. Tell me what equipment you need — type or use the mic — and I'll find the best match.",
      },
    ]);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="relative px-4 py-3 bg-white shadow-sm shrink-0">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400" />
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shrink-0"
            style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)' }}
          >
            <Zap size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-bold text-slate-800 leading-tight truncate">
              Field Ops Asset Requisition
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">AI-powered equipment assistant</p>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto chat-scroll px-4 pt-4 pb-6"
        style={{ background: 'linear-gradient(180deg, #4C1D95 0%, #2E1065 30%, #0D9488 100%)' }}
      >
        {messages.map((msg) => {
          const delay = msg.animationDelay || undefined;
          return <ChatMessage key={msg.id} message={msg} animationDelay={delay} />;
        })}

        {messages.length > 0 && !isTyping && (
          <CategoryChips onSelect={handleSend} />
        )}

        {isTyping && (
          <div className="flex gap-3 justify-start mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md mt-1"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)' }}
            >
              <Bot size={16} className="text-white" />
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
