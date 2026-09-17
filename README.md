# J.A.R.V.I.S. — AI Voice Assistant

> *Just A Rather Very Intelligent System*

Assistente pessoal com interface inspirada no reator holográfico do Homem de Ferro: conversa por texto, **reconhecimento de voz** e **respostas faladas** — 100% front-end, sem backend e sem chaves de API.

![Stack](https://img.shields.io/badge/React%2019-TypeScript-blue) ![Bundler](https://img.shields.io/badge/Vite-6-purple) ![CI/CD](https://img.shields.io/badge/CI%2FGitHub_Actions-deploy-green)

## Funcionalidades

- **Reator holográfico animado** — núcleo pulsante, anéis de arcos orbitantes e partículas, renderizado proceduralmente em `<canvas>` (sem imagens)
- **Conversa por voz** — fale pelo microfone (Web Speech API, `pt-BR`); a fala vira texto e é enviada automaticamente
- **Respostas faladas** — o assistente responde em voz alta com timbre grave e pausado, priorizando vozes britânicas/americanas com fallback pt-BR
- **Modo conversa contínua** — após responder em voz, o assistente volta a ouvir sozinho; mãos livres
- **Telemetria HUD** — painéis de uptime, tarefas e notificações com mini-gráficos
- **Moldura HUD** — barras translúcidas âmbar, grade técnica e glow controlado
- **Acessibilidade** — `aria-live` na conversa, foco visível, `prefers-reduced-motion` respeitado

## Tecnologias

| Camada | Escolha |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 6 |
| Estilo | CSS puro (variáveis customizadas, sem Tailwind) |
| Voz (STT) | Web Speech API — `SpeechRecognition` |
| Voz (TTS) | Web Speech API — `speechSynthesis` |
| CI/CD | GitHub Actions → GitHub Pages |

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento → http://localhost:5173
npm run build    # build de produção → dist/
npm run preview  # serve o build localmente
```

Requisitos: Node.js 20+.

## Como usar a voz

1. Clique no ícone de **microfone** no compositor e autorize o microfone
2. Fale — a transcrição aparece ao vivo no campo e a mensagem é enviada ao terminar a frase
3. O assistente responde **em voz alta** e volta a ouvir automaticamente
4. O ícone de **alto-falante** silencia as respostas faladas

> Reconhecimento de voz funciona melhor no **Chrome/Edge** e, em produção, exige **HTTPS** (o GitHub Pages já atende).

## Deploy

O pipeline em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) roda a cada push na `main`:

1. **Audit & Build** — instala dependências, valida arquivos e compila (`npm ci && npm run build`)
2. **Deploy to GitHub Pages** — publica a pasta `dist/` na branch `gh-pages`

Após o primeiro run verde, ative em `Settings → Pages → Branch: gh-pages`. O app fica disponível em:

```
https://savitargood.github.io/jarvis-ai-assistant/
```

## Estrutura

```
src/
├── App.tsx                        # Estado da conversa, síntese de voz, orquestração
├── components/
│   ├── ReactorOrb.tsx             # Reator holográfico (canvas 2D procedural)
│   ├── TopNav.tsx                 # Barra superior com relógio e status
│   ├── Conversation.tsx           # Fio de mensagens com rolagem automática
│   ├── Composer.tsx               # Entrada por texto/voz + controles de áudio
│   ├── TelemetryRail.tsx          # Painéis de telemetria
│   └── icons.tsx                  # Ícones SVG inline
├── hooks/
│   └── useSpeechRecognition.ts    # Reconhecimento de voz (pt-BR, interim results)
└── style.css                      # Tema âmbar/HUD completo
```

## Roadmap

- [ ] Respostas por IA real (Gemini/OpenAI) via backend serverless
- [ ] Voz neural premium (OpenAI TTS) — timbre indistinguível de humano
- [ ] Histórico de conversas persistente
- [ ] Temas alternativos (ciano clássico, verde terminal)

---

*Todos os sistemas nominais, Senhor.*
