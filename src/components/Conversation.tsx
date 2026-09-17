import { useEffect, useRef } from 'react';
import type { Message } from '../types';

interface ConversationProps {
  messages: Message[];
  isTyping: boolean;
}

export default function Conversation({ messages, isTyping }: ConversationProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  return (
    <section className="thread" aria-label="Conversa com o assistente" aria-live="polite">
      {messages.map((message) => (
        <article key={message.id} className={`bubble bubble--${message.role}`}>
          <header className="bubble-head">
            <span className="bubble-author">
              {message.role === 'assistant' ? 'J.A.R.V.I.S.' : 'Senhor'}
            </span>
            <span className="bubble-time">{message.time}</span>
          </header>
          <p className="bubble-text">{message.text}</p>
        </article>
      ))}
      {isTyping && (
        <article className="bubble bubble--assistant bubble--typing" aria-label="Assistente digitando">
          <header className="bubble-head">
            <span className="bubble-author">J.A.R.V.I.S.</span>
          </header>
          <p className="bubble-text">
            <span className="typing-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </p>
        </article>
      )}
      <div ref={endRef} aria-hidden="true" />
    </section>
  );
}
