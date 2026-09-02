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
