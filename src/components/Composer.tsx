import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { MicIcon, SendIcon, SpeakerIcon, SpeakerOffIcon, StopIcon } from './icons';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ComposerProps {
  onSend: (text: string, viaVoice?: boolean) => void;
  resumeSignal: number;
  voiceOut: boolean;
  onToggleVoice: () => void;
}

export default function Composer({ onSend, resumeSignal, voiceOut, onToggleVoice }: ComposerProps) {
  const [value, setValue] = useState('');
  const { supported, listening, interim, error, toggle, start } = useSpeechRecognition((text) =>
    onSend(text, true),
  );
  const speechOutSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const beginListening = useCallback(() => {
    window.speechSynthesis?.cancel();
    start();
  }, [start]);

  useEffect(() => {
    if (resumeSignal > 0) {
      beginListening();
    }
  }, [resumeSignal, beginListening]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  }

  const canSend = Boolean(value.trim()) && !listening;

  return (
    <div className="composer-wrap">
      <form
        className={`composer${listening ? ' composer--listening' : ''}`}
        onSubmit={handleSubmit}
        aria-label="Enviar mensagem"
      >
        <input
          className="composer-input"
          type="text"
          value={listening ? interim : value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={listening ? 'Ouvindo, Senhor...' : 'Fale ou digite sua mensagem...'}
          aria-label="Mensagem para o assistente"
          autoComplete="off"
          maxLength={500}
        />
        {speechOutSupported && (
          <button
            type="button"
            className={`composer-voice${voiceOut ? ' is-on' : ''}`}
            onClick={onToggleVoice}
            aria-pressed={voiceOut}
            aria-label={voiceOut ? 'Desativar respostas faladas' : 'Ativar respostas faladas'}
            title={voiceOut ? 'Respostas faladas: ativas' : 'Respostas faladas: silenciadas'}
          >
            {voiceOut ? <SpeakerIcon /> : <SpeakerOffIcon />}
          </button>
        )}
        {supported && (
          <button
            type="button"
            className={`composer-mic${listening ? ' is-listening' : ''}`}
            onClick={listening ? toggle : beginListening}
            aria-pressed={listening}
            aria-label={listening ? 'Parar escuta' : 'Falar mensagem'}
            title={listening ? 'Parar escuta' : 'Falar em vez de digitar'}
          >
            {listening ? <StopIcon /> : <MicIcon />}
          </button>
        )}
        <button className="composer-send" type="submit" disabled={!canSend}>
          <SendIcon />
          <span>Enviar</span>
        </button>
      </form>
      {error && (
        <p className="composer-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
