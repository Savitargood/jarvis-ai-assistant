import { useEffect, useState } from 'react';
import { LogoMark } from './icons';
import { auth, supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function TopNav() {
  const [clock, setClock] = useState(() => formatTime());
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setClock(formatTime()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const displayName = user?.email?.split('@')[0] ?? null;

  return (
    <header className="topnav">
      <a className="wordmark" href="/" aria-label="J.A.R.V.I.S. — início">
        <LogoMark />
        <span>J.A.R.V.I.S.</span>
      </a>
      <div className="nav-status">
        <span className="nav-clock">{clock}</span>
        <span className="status-pill" role="status">
          <span className="status-dot" aria-hidden="true" />
          Online
        </span>
        {user ? (
          <span className="auth-area">
            <span className="auth-user" title={user.email ?? ''}>
              {displayName}
            </span>
            <button
              type="button"
              className="auth-btn"
              onClick={() => supabase.auth.signOut()}
            >
              Sair
            </button>
          </span>
        ) : (
          <button
            type="button"
            className="auth-btn auth-btn--primary"
            onClick={() => auth.openSignInModal()}
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}

function formatTime(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
