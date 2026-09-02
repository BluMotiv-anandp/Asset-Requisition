# Field Ops Asset Requisition — Full Frontend Code

> React + Vite + Tailwind CSS
> Backend: Spring Boot on `localhost:8080`
> Frontend dev server: `localhost:3000`

---

## Project Structure

```
frontend/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── PhoneFrame.jsx
    │   └── ChatFeed.jsx
    └── services/
        └── api.js
```

---

## 1. `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Field Ops Asset Requisition</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="bg-paper text-ink font-sans antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## 2. `package.json`

```json
{
  "name": "field-ops-asset-requisition",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "vite": "^4.4.5"
  }
}
```

---

## 3. `postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## 4. `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Minimalist B&W palette
        ink: '#111111',
        paper: '#FFFFFF',
        muted: '#888888',
        border: '#DDDDDD',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
```

---

## 5. `vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 6. `src/main.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 7. `src/App.jsx`

```jsx
import PhoneFrame from './components/PhoneFrame';
import ChatFeed from './components/ChatFeed';

/**
 * App — root component. Wraps the chat UI in an iPhone 17 Pro Max
 * device frame for presentation.
 */
export default function App() {
  return (
    <PhoneFrame>
      <ChatFeed />
    </PhoneFrame>
  );
}
```

---

## 8. `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar for chat feed */
.chat-scroll::-webkit-scrollbar {
  width: 4px;
}
.chat-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.chat-scroll::-webkit-scrollbar-thumb {
  background: #888888;
  border-radius: 2px;
}

/* Pulse animation for mic button */
@keyframes mic-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
.mic-active {
  animation: mic-pulse 1.5s ease-in-out infinite;
}

/* New message entrance: fades in and slides up slightly (~200ms ease-out) */
@keyframes message-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-message-enter {
  animation: message-enter 200ms ease-out forwards;
}

/* Asset Card entrance: delayed ~100ms after preceding text message */
@keyframes asset-enter {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-asset-enter {
  animation: asset-enter 200ms ease-out forwards;
}
```

---

## 9. `src/components/PhoneFrame.jsx`

```jsx
import { Battery, Signal, Wifi } from 'lucide-react';

/**
 * PhoneFrame — wraps children in a realistic iPhone 17 Pro Max device mockup.
 */
export default function PhoneFrame({ children }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-100 p-6">
      {/* Outer metallic edge */}
      <div
        className="relative flex flex-col items-center overflow-hidden"
        style={{
          aspectRatio: '440 / 956',
          maxHeight: '90vh',
          maxWidth: '90vw',
          alignSelf: 'center',
          borderRadius: '55px',
          background:
            'linear-gradient(145deg, #e0e0e0, #b0b0b0, #d0d0d0, #a0a0a0)',
          padding: '3px',
          boxShadow:
            '0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)',
        }}
      >
        {/* Inner black bezel */}
        <div
          className="relative flex flex-col w-full h-full overflow-hidden"
          style={{
            borderRadius: '52px',
            background: '#000000',
          }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-20"
            style={{
              width: '126px',
              height: '37px',
              borderRadius: '20px',
              background: '#000000',
            }}
          />

          {/* Screen area */}
          <div
            className="relative flex flex-col w-full h-full overflow-hidden"
            style={{
              borderRadius: '49px',
              margin: '3px',
              width: 'calc(100% - 6px)',
              height: 'calc(100% - 6px)',
              background: '#FFFFFF',
            }}
          >
            {/* Status bar */}
            <div className="relative flex items-center justify-between px-8 pt-4 pb-1 text-xs font-semibold text-ink z-10">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal size={13} />
                <Wifi size={13} />
                <Battery size={15} />
              </div>
            </div>

            {/* Chat content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 10. `src/components/ChatFeed.jsx`

```jsx
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
```

---

## 11. `src/services/api.js`

```js
/**
 * API service layer — centralizes all backend HTTP calls.
 * Every function returns a promise that resolves to JSON data.
 */

const BASE_URL = '/api';

/**
 * Fetch all assets from the backend.
 * GET /api/assets
 */
export async function fetchAssets() {
  const res = await fetch(`${BASE_URL}/assets`);
  if (!res.ok) throw new Error('Failed to fetch assets');
  return res.json();
}

/**
 * Search assets by name query.
 * GET /api/assets/search?q={query}
 */
export async function searchAssets(query) {
  const res = await fetch(
    `${BASE_URL}/assets/search?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

/**
 * Fetch a single asset by ID.
 * GET /api/assets/{id}
 */
export async function fetchAssetById(id) {
  const res = await fetch(`${BASE_URL}/assets/${id}`);
  if (!res.ok) throw new Error('Asset not found');
  return res.json();
}

/**
 * Create a new requisition request.
 * POST /api/requests  body: { assetId: number, requestedBy: string }
 */
export async function createRequest(assetId, requestedBy = 'anonymous') {
  const res = await fetch(`${BASE_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assetId, requestedBy }),
  });
  if (!res.ok) throw new Error('Failed to create request');
  return res.json();
}

/**
 * Fetch all requisition requests.
 * GET /api/requests
 */
export async function fetchRequests() {
  const res = await fetch(`${BASE_URL}/requests`);
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

/**
 * Approve a requisition request.
 * PUT /api/requests/{id}/approve
 */
export async function approveRequest(id) {
  const res = await fetch(`${BASE_URL}/requests/${id}/approve`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to approve request');
  return res.json();
}

/**
 * Reject a requisition request.
 * PUT /api/requests/{id}/reject
 */
export async function rejectRequest(id) {
  const res = await fetch(`${BASE_URL}/requests/${id}/reject`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to reject request');
  return res.json();
}
```

---

## Setup Instructions

```bash
cd frontend
npm install
npm run dev      # starts on http://localhost:3000
```

Backend must be running on `http://localhost:8080` with the `/api` endpoints.
