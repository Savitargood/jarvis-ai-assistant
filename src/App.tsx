import { useRef, useState } from 'react';
import TopNav from './components/TopNav';
import Conversation from './components/Conversation';
import Composer from './components/Composer';
import TelemetryRail from './components/TelemetryRail';
import ReactorOrb from './components/ReactorOrb';
import type { Message } from './types';

const REPLIES = [
  'Todos os sistemas nominais, Senhor. Os diagnósticos de rotina não apresentaram anomalias.',
  'Entendido, Senhor. Solicitação registrada e recursos realocados conforme necessário.',
  'Muito observador, Senhor. Preparei um resumo dos dados mais recentes para sua análise.',
  'Às ordens. Iniciando o procedimento e mantendo o Senhor informado a cada etapa.',
];

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function now(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

let nextId = 2;

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'Todos os sistemas operacionais, Senhor. Uptime estável e nenhum alerta crítico nas últimas 24 horas.',
      time: now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceOut, setVoiceOut] = useState(true);
  const [resumeSignal, setResumeSignal] = useState(0);
  const replyIndex = useRef(0);
  const lastInputWasVoice = useRef(false);
  const voiceOutRef = useRef(voiceOut);
  voiceOutRef.current = voiceOut;

  function speak(text: string): boolean {
    if (!voiceOutRef.current || !('speechSynthesis' in window)) return false;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const isJarvisTimbre = (candidate: SpeechSynthesisVoice) =>
      (candidate.lang.includes('en-GB') || candidate.lang.includes('en-US')) &&
      /male|natural|george|daniel|ryan|arthur/i.test(candidate.name);
    const voice =
      voices.find(isJarvisTimbre) ??
      voices.find((candidate) => candidate.lang.includes('en-GB')) ??
      voices.find((candidate) => /pt[-_]br/i.test(candidate.lang)) ??
      voices.find((candidate) => /^pt/i.test(candidate.lang));
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'pt-BR';
    }
    // Modulação do timbre do J.A.R.V.I.S.: grave, pausado e elegante.
    utterance.pitch = 0.88;
    utterance.rate = 0.95;
    utterance.volume = 1;
    utterance.onend = () => {
      if (lastInputWasVoice.current) setResumeSignal((signal) => signal + 1);
    };
    synth.speak(utterance);
    return true;
  }

  function handleSend(text: string, viaVoice = false) {
    lastInputWasVoice.current = viaVoice;
    window.speechSynthesis?.cancel();
    const userMessage: Message = { id: nextId++, role: 'user', text, time: now() };
    setMessages((current) => [...current, userMessage]);
    setIsTyping(true);
    const reply = REPLIES[replyIndex.current % REPLIES.length];
    replyIndex.current += 1;
    window.setTimeout(() => {
      setIsTyping(false);
      setMessages((current) => [
        ...current,
        { id: nextId++, role: 'assistant', text: reply, time: now() },
      ]);
      if (!speak(reply) && viaVoice) setResumeSignal((signal) => signal + 1);
    }, 1200);
  }

  return (
    <div className="app-shell">
      <div className="hud-frame" aria-hidden="true">
        <span className="hud-bar hud-bar--tl" />
        <span className="hud-bar hud-bar--tl2" />
        <span className="hud-bar hud-bar--tr" />
        <span className="hud-bar hud-bar--bottom" />
      </div>
      <TopNav />
      <main className="console">
        <div className="console-main">
          <section className="orb-hero">
            <div className="orb-stage">
              <ReactorOrb />
            </div>
            <div className="orb-caption">
              <p className="hero-eyebrow">Sistema online · Canal seguro</p>
              <h1 className="hero-title">
                {greeting()}, <span className="hero-accent">Senhor</span>.
              </h1>
              <p className="hero-sub">
                Todos os subsistemas operando dentro dos parâmetros nominais.
              </p>
            </div>
          </section>
          <Conversation messages={messages} isTyping={isTyping} />
          <Composer
            onSend={handleSend}
            resumeSignal={resumeSignal}
            voiceOut={voiceOut}
            onToggleVoice={() => setVoiceOut((current) => !current)}
          />
        </div>
        <TelemetryRail />
      </main>
    </div>
  );
}
