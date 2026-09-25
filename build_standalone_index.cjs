const fs = require('fs');

const embeddedImages = JSON.parse(fs.readFileSync('/tmp/embedded_images.json', 'utf-8'));

const htmlContent = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>O Segredo da Mansão Ravenwood - Mistério Gótico</title>
  <meta name="description" content="Jogo point-and-click de terror psicológico e romance gótico com puzzles profundos e atmosfera imersiva." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            gothic: {
              950: '#07060b',
              900: '#110d18',
              850: '#181224',
              800: '#231a33',
            }
          }
        }
      }
    }
  </script>

  <!-- React 18 & Babel Standalone CDNs -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <style>
    @layer base {
      :root {
        --font-gothic: 'Cinzel', serif;
        --font-vintage: 'Cormorant Garamond', Georgia, serif;
        --font-ui: 'Plus Jakarta Sans', sans-serif;
      }
    }
    .font-gothic { font-family: 'Cinzel', serif; }
    .font-vintage { font-family: 'Cormorant Garamond', Georgia, serif; }
    .font-ui { font-family: 'Plus Jakarta Sans', sans-serif; }

    @keyframes candle-flicker {
      0%, 100% { opacity: 0.92; filter: drop-shadow(0 0 16px rgba(251, 146, 60, 0.45)); }
      25% { opacity: 0.82; filter: drop-shadow(0 0 10px rgba(251, 146, 60, 0.3)); }
      50% { opacity: 1; filter: drop-shadow(0 0 22px rgba(251, 146, 60, 0.6)); }
      75% { opacity: 0.88; filter: drop-shadow(0 0 14px rgba(251, 146, 60, 0.38)); }
    }
    .animate-candle { animation: candle-flicker 3s infinite ease-in-out; }

    @keyframes pulse-ghostly {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.02); }
    }
    .animate-ghostly { animation: pulse-ghostly 4s infinite ease-in-out; }

    @keyframes pendulum-swing {
      0%, 100% { transform: translate(-50%, -50%) rotate(8deg); }
      50% { transform: translate(-50%, -50%) rotate(-8deg); }
    }
    .animate-pendulum { animation: pendulum-swing 2.2s infinite ease-in-out; }

    @keyframes flame-flutter {
      0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 0.85; }
      25% { transform: translate(-50%, -50%) scale(1.06, 0.94) rotate(-2deg); opacity: 0.75; }
      50% { transform: translate(-50%, -50%) scale(0.96, 1.05) rotate(1.5deg); opacity: 0.95; }
      75% { transform: translate(-50%, -50%) scale(1.04, 0.98) rotate(-1deg); opacity: 0.8; }
    }
    .animate-flame { animation: flame-flutter 1.6s infinite ease-in-out; }

    /* Custom gothic scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #110f17; }
    ::-webkit-scrollbar-thumb { background: #393046; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #5d4f73; }
  </style>
</head>
<body class="bg-[#08070b] text-[#e2d9cc] select-none antialiased overflow-hidden">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef } = React;

    // Embedded High-Resolution Base64 Images for complete standalone offline execution
    const EMBEDDED_IMAGES = ${JSON.stringify(embeddedImages)};

    const IMAGES = {
      classic: {
        livingRoom: EMBEDDED_IMAGES['mansion_living_room_1790334288800.jpg'],
        musicRoom: EMBEDDED_IMAGES['mansion_music_room_1790334302460.jpg'],
        bedroom: EMBEDDED_IMAGES['mansion_bedroom_1790334316310.jpg'],
        crypt: EMBEDDED_IMAGES['mansion_crypt_ritual_1790334327762.jpg'],
        portraitBride: EMBEDDED_IMAGES['portrait_eleonora_1790334340370.jpg'],
      },
      animation: {
        livingRoom: EMBEDDED_IMAGES['anim_living_room_1790334786286.jpg'],
        musicRoom: EMBEDDED_IMAGES['anim_music_room_1790334799958.jpg'],
        bedroom: EMBEDDED_IMAGES['anim_bedroom_1790334810663.jpg'],
        crypt: EMBEDDED_IMAGES['anim_crypt_tomb_1790334821889.jpg'],
        portraitBride: EMBEDDED_IMAGES['anim_bride_portrait_1790334835726.jpg'],
      }
    };

    // PROCEDURAL WEB AUDIO SYNTHESIZER (No external sound files required)
    class GothicAudioEngine {
      constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.ambientGain = null;
        this.isBgmPlaying = false;
        this.bgmTimeoutId = null;
        this.tensionLevel = 1;
        this.noteFrequencies = {
          C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00, Ab3: 207.65, A3: 220.00, B3: 246.94,
          C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.00, Ab4: 415.30, A4: 440.00, B4: 493.88,
          C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99, Ab5: 830.61, A5: 880.00, B5: 987.77,
        };
      }

      init() {
        if (this.ctx) return;
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);

          this.musicGain = this.ctx.createGain();
          this.musicGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
          this.musicGain.connect(this.masterGain);

          this.sfxGain = this.ctx.createGain();
          this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
          this.sfxGain.connect(this.masterGain);

          this.ambientGain = this.ctx.createGain();
          this.ambientGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
          this.ambientGain.connect(this.masterGain);

          this.startRainAmbience();
        } catch(e) {}
      }

      ensureContext() {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      }

      toggleMute() {
        this.ensureContext();
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.ctx) {
          this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
        }
        return this.isMuted;
      }

      setTension(lvl) {
        this.tensionLevel = Math.max(1, Math.min(3, lvl));
      }

      playPianoNote(note, duration = 2.5, velocity = 0.8) {
        this.ensureContext();
        if (!this.ctx || !this.musicGain || this.isMuted) return;
        const freq = this.noteFrequencies[note] || 440;
        const now = this.ctx.currentTime;
        const harmonics = [
          { ratio: 1.0, gain: 0.85 },
          { ratio: 2.0, gain: 0.40 },
          { ratio: 3.0, gain: 0.22 },
          { ratio: 4.0, gain: 0.12 },
          { ratio: 5.0, gain: 0.05 },
        ];
        harmonics.forEach(({ ratio, gain }) => {
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();
          osc.type = ratio === 1 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq * ratio, now);
          const peakAmp = gain * velocity * 0.45;
          oscGain.gain.setValueAtTime(0.0001, now);
          oscGain.gain.linearRampToValueAtTime(peakAmp, now + 0.015);
          oscGain.gain.exponentialRampToValueAtTime(peakAmp * 0.4, now + 0.3);
          oscGain.gain.exponentialRampToValueAtTime(0.00001, now + duration);
          osc.connect(oscGain);
          oscGain.connect(this.musicGain);
          osc.start(now);
          osc.stop(now + duration);
        });
      }

      startSoundtrack() {
        this.ensureContext();
        if (this.isBgmPlaying) return;
        this.isBgmPlaying = true;
        this.playNextPhrase(0);
      }

      playNextPhrase(step) {
        if (!this.isBgmPlaying || !this.ctx) return;
        const phrases = [
          [
            { note: 'C3', delay: 0, dur: 4.0, vel: 0.6 },
            { note: 'G3', delay: 0.4, dur: 3.5, vel: 0.5 },
            { note: 'Eb4', delay: 0.8, dur: 3.0, vel: 0.7 },
            { note: 'G4', delay: 1.2, dur: 2.8, vel: 0.65 },
            { note: 'C5', delay: 1.6, dur: 3.2, vel: 0.75 },
            { note: 'Eb5', delay: 2.2, dur: 2.6, vel: 0.6 },
          ],
          [
            { note: 'Ab3', delay: 0, dur: 4.0, vel: 0.6 },
            { note: 'Eb4', delay: 0.4, dur: 3.5, vel: 0.55 },
            { note: 'C4', delay: 0.8, dur: 3.2, vel: 0.6 },
            { note: 'G4', delay: 1.3, dur: 3.0, vel: 0.75 },
            { note: 'Ab4', delay: 1.8, dur: 3.0, vel: 0.7 },
          ],
          [
            { note: 'F3', delay: 0, dur: 4.0, vel: 0.65 },
            { note: 'C4', delay: 0.4, dur: 3.5, vel: 0.55 },
            { note: 'Ab4', delay: 0.8, dur: 3.0, vel: 0.7 },
            { note: 'D5', delay: 1.3, dur: 3.0, vel: 0.75 },
            { note: 'C5', delay: 1.9, dur: 2.6, vel: 0.7 },
          ],
          [
            { note: 'G3', delay: 0, dur: 4.5, vel: 0.7 },
            { note: 'D4', delay: 0.4, dur: 3.8, vel: 0.6 },
            { note: 'B4', delay: 0.9, dur: 3.5, vel: 0.75 },
            { note: 'F4', delay: 1.4, dur: 3.2, vel: 0.65 },
            { note: 'D5', delay: 1.9, dur: 3.0, vel: 0.7 },
          ]
        ];
        const phrase = phrases[step % phrases.length];
        phrase.forEach(item => {
          setTimeout(() => {
            if (this.isBgmPlaying) {
              const adjustedVel = Math.min(1, item.vel * (1 + (this.tensionLevel - 1) * 0.25));
              this.playPianoNote(item.note, item.dur, adjustedVel);
            }
          }, item.delay * 1000);
        });
        this.bgmTimeoutId = setTimeout(() => {
          this.playNextPhrase(step + 1);
        }, 4100);
      }

      startRainAmbience() {
        if (!this.ctx || !this.ambientGain) return;
        try {
          const bufferSize = this.ctx.sampleRate * 2;
          const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.035;
          }
          const rainSource = this.ctx.createBufferSource();
          rainSource.buffer = noiseBuffer;
          rainSource.loop = true;
          const rainFilter = this.ctx.createBiquadFilter();
          rainFilter.type = 'lowpass';
          rainFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
          rainSource.connect(rainFilter);
          rainFilter.connect(this.ambientGain);
          rainSource.start(0);
        } catch(e) {}
      }

      playTapSound() {
        this.ensureContext();
        if (!this.ctx || !this.sfxGain || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.025);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.035);
      }

      playThunder() {
        this.ensureContext();
        if (!this.ctx || !this.sfxGain || this.isMuted) return;
        const now = this.ctx.currentTime;
        const dur = 3.5;
        const bufferSize = this.ctx.sampleRate * dur;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const decay = Math.exp(-(i / bufferSize) * 2.5);
          data[i] = (Math.random() * 2 - 1) * decay;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, now);
        filter.frequency.exponentialRampToValueAtTime(50, now + dur);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        source.start(now);
      }

      playClockTick() {
        this.ensureContext();
        if (!this.ctx || !this.sfxGain || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.04);
      }

      playClockChime() {
        this.ensureContext();
        if (!this.ctx || !this.sfxGain || this.isMuted) return;
        const now = this.ctx.currentTime;
        [196, 392, 784, 1174].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          const amp = 0.35 / (idx + 1);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(amp, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 4.2);
        });
      }

      playDoorCreak() {
        this.ensureContext();
        if (!this.ctx || !this.sfxGain || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.4);
        osc.frequency.linearRampToValueAtTime(120, now + 0.8);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(350, now);
        filter.Q.setValueAtTime(5, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.95);
      }

      playLockUnlock() {
        this.ensureContext();
        if (!this.ctx || !this.sfxGain || this.isMuted) return;
        const now = this.ctx.currentTime;
        [520, 840, 1200].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.25, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.08);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.1);
        });
      }

      playItemPickup() {
        this.ensureContext();
        if (!this.ctx || !this.sfxGain || this.isMuted) return;
        const now = this.ctx.currentTime;
        [440, 554, 659].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.18, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.3);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.35);
        });
      }

      playPuzzleSolved() {
        this.ensureContext();
        if (!this.ctx || !this.sfxGain || this.isMuted) return;
        const now = this.ctx.currentTime;
        [261, 329, 392, 523, 659].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.22, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 2.0);
        });
      }

      playHeartbeat() {
        this.ensureContext();
        if (!this.ctx || !this.sfxGain || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(75, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.14);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    }

    const audioEngine = new GothicAudioEngine();

    // GAME ITEMS
    const ITEMS = {
      iron_key: { id: 'iron_key', name: 'Chave de Ferro Fundido', description: 'Uma chave pesada coberta de fuligem de lareira.', inspectText: 'Traz gravada uma lira clássica. Destranca o Armário de Partituras.', icon: '🗝️' },
      sheet_music_half_1: { id: 'sheet_music_half_1', name: 'Pedaço de Partitura (Esquerda)', description: 'Metade de uma valsa romântica rasgada.', inspectText: 'Faltam os compassos da mão direita.', icon: '📜', canCombineWith: 'sheet_music_half_2' },
      sheet_music_half_2: { id: 'sheet_music_half_2', name: 'Pedaço de Partitura (Direita)', description: 'A outra metade da partitura encontrada no armário.', inspectText: 'Dedicatória: "Para meu Julian... Toque: LÁ, FÁ, MI, SOL, DÓ".', icon: '📜', canCombineWith: 'sheet_music_half_1' },
      sheet_music_complete: { id: 'sheet_music_complete', name: 'Partitura Completa dos Amantes', description: 'A valsa restaurada de Eleonora e Julian.', inspectText: 'Notas da melodia secreta: LÁ - FÁ - MI - SOL - DÓ.', icon: '📖' },
      bride_bedroom_key: { id: 'bride_bedroom_key', name: 'Chave de Coração Alado', description: 'Chave de latão com o símbolo de duas asas e coração partido.', inspectText: 'Destranca os Aposentos da Noiva no piso superior.', icon: '🗝️' },
      wedding_ring: { id: 'wedding_ring', name: 'Aliança de Noivado Antiga', description: 'Aliança em ouro envelhecido com um rubi cor de sangue.', inspectText: 'Inscrição: "Julian & Eleonora — Que nem mesmo a morte cale nosso amor (1892)".', icon: '💍' },
      solvent_bottle: { id: 'solvent_bottle', name: 'Frasco de Solvente Alquímico', description: 'Frasco de essência purificadora e terebintina.', inspectText: 'Capaz de dissolver a crosta opaca de espelhos e telas antigas.', icon: '🧪', canCombineWith: 'dusty_cloth' },
      dusty_cloth: { id: 'dusty_cloth', name: 'Lenço de Seda Bordado', description: 'Lenço seco de seda com monograma bordado E.R.', inspectText: 'Precisa de um líquido solvente para limpar superfícies incrustadas.', icon: '🧣', canCombineWith: 'solvent_bottle' },
      moist_cloth: { id: 'moist_cloth', name: 'Lenço com Solvente Alquímico', description: 'Lenço pronto para desvendar espelhos manchados pelo tempo.', inspectText: 'Exala alfazema. Capaz de limpar o espelho da noiva.', icon: '✨' },
      clock_minute_hand: { id: 'clock_minute_hand', name: 'Ponteiro de Bronze dos Minutos', description: 'Ponteiro ornamental esculpido em forma de adaga.', inspectText: 'Encaixa-se no relógio de pêndulo do salão.', icon: '⏱️' },
      spectral_lens: { id: 'spectral_lens', name: 'Lente de Vidência Oculta', description: 'Lente de quartzo ametista com haste dourada.', inspectText: 'Permite enxergar inscrições etéreas deixadas pelas almas.', icon: '🔮' },
    };

    // ROOMS
    const ROOMS = {
      living_room: {
        id: 'living_room',
        name: 'O Salão dos Retratos',
        subtitle: 'O coração frio da mansão, onde o tempo parece ter estagnado.',
        connectedRooms: { right: 'music_room', forward: 'bedroom' },
        hotspots: [
          { id: 'grandfather_clock', title: 'Relógio de Pêndulo', description: 'O relógio parou. O mostrador de latão está sem o ponteiro dos minutos.', x: 23, y: 50, width: 18, height: 55, actionType: 'puzzle', targetPuzzle: 'clock' },
          { id: 'fireplace', title: 'Lareira de Pedra & Cinzas', description: 'Cinzas frias e lascas de carvão apagadas há décadas.', x: 55, y: 68, width: 22, height: 28, actionType: 'examine' },
          { id: 'arched_window', title: 'Janela da Tempestade', description: 'Raios iluminam a escuridão. Gotas de chuva batem no vidro.', x: 38, y: 32, width: 14, height: 35, actionType: 'examine' },
          { id: 'portrait_ancestors', title: 'Retratos da Família', description: 'Três figuras nobres olham em direções fixas: Esquerda, Frente, Direita.', x: 78, y: 28, width: 20, height: 26, actionType: 'examine' },
          { id: 'spectral_living_wall', title: 'Ecos de Sangue na Parede', description: 'Inscrição luminosa: "O tempo congelou no exato instante em que o último suspiro dela cessou... 03:45"', x: 88, y: 55, width: 16, height: 22, actionType: 'examine', spectralOnly: true },
          { id: 'crypt_passage', title: 'Passagem para a Cripta', description: 'O painel de madeira deslizada revelou uma escadaria úmida de pedra descendo às profundezas!', x: 23, y: 75, width: 18, height: 30, actionType: 'navigate', targetRoom: 'crypt' }
        ]
      },
      music_room: {
        id: 'music_room',
        name: 'O Salão de Música',
        subtitle: 'O eco de uma melodia esquecida e o som constante da tempestade.',
        connectedRooms: { left: 'living_room' },
        hotspots: [
          { id: 'grand_piano', title: 'Piano de Cauda Imperial', description: 'As teclas de marfim aguardam a melodia certa para liberar seu segredo.', x: 52, y: 60, width: 34, height: 40, actionType: 'puzzle', targetPuzzle: 'piano' },
          { id: 'piano_sheet_floor', title: 'Partitura Caída no Assoalho', description: 'Um papel pautado rasgado repousa aos pés do banco do piano.', x: 36, y: 80, width: 14, height: 14, actionType: 'pickup', itemId: 'sheet_music_half_1' },
          { id: 'music_drawer', title: 'Armário de Partituras', description: 'Armário de madeira nobre trancado com o relevo de uma lira clássica.', x: 86, y: 60, width: 20, height: 32, actionType: 'examine' },
          { id: 'candelabra', title: 'Candelabro de Bronze', description: 'Velas gotejando cera quente. A chama treme na escuridão.', x: 22, y: 48, width: 16, height: 25, actionType: 'examine' },
          { id: 'spectral_music_window', title: 'Silhueta na Janela', description: 'Um espírito feminino de véu sussurra: "Julian, lembre-se de nossa valsa..."', x: 75, y: 28, width: 16, height: 32, actionType: 'examine', spectralOnly: true }
        ]
      },
      bedroom: {
        id: 'bedroom',
        name: 'Aposentos da Noiva',
        subtitle: 'Pétalas secas, rendas e o perfume persistente de rosas negras.',
        connectedRooms: { back: 'living_room' },
        hotspots: [
          { id: 'vanity_mirror', title: 'Espelho da Penteadeira', description: 'O espelho oval está imundo, refletindo apenas vultos distorcidos.', x: 68, y: 42, width: 22, height: 42, actionType: 'puzzle', targetPuzzle: 'mirror' },
          { id: 'jewelry_box', title: 'Caixa de Joias Mecânica', description: 'Uma caixa de madeira escura com quatro anéis de latão e entalhes de símbolos.', x: 56, y: 66, width: 14, height: 16, actionType: 'puzzle', targetPuzzle: 'jewelry_box' },
          { id: 'canopy_bed', title: 'Cama com Dossel de Veludo', description: 'Sobre os lençóis de veludo negro há um lenço de seda bordado com iniciais.', x: 24, y: 56, width: 32, height: 44, actionType: 'examine' },
          { id: 'bride_portrait_small', title: 'Retrato de Eleonora', description: 'Um retrato da jovem noiva segurando uma rosa escura com olhos marejados.', x: 44, y: 24, width: 14, height: 22, actionType: 'examine' },
          { id: 'spectral_bed_ghost', title: 'Inscrição na Cabeceira', description: 'Letras de luz azul: "Não me busque na vida, meu doce Julian. Pois você me seguiu antes mesmo de mim."', x: 25, y: 38, width: 20, height: 16, actionType: 'examine', spectralOnly: true }
        ]
      },
      crypt: {
        id: 'crypt',
        name: 'A Cripta Subterrânea',
        subtitle: 'Arcos de pedra ancestral onde a verdade definitiva repousa.',
        connectedRooms: { back: 'living_room' },
        hotspots: [
          { id: 'crypt_altar', title: 'O Sarcófago Central', description: 'O túmulo familiar dos Ravenwood esculpido em mármore negro com inscrições em ouro.', x: 50, y: 58, width: 32, height: 36, actionType: 'puzzle', targetPuzzle: 'crypt_tomb' },
          { id: 'grimoire_desk', title: 'Escrivaninha dos Rituais', description: 'O diário de memórias final repousa sob a luz de velas vermelhas.', x: 82, y: 60, width: 22, height: 28, actionType: 'examine' },
          { id: 'iron_escape_gate', title: 'O Portão de Ferro', description: 'O portão gótico que leva para fora dos muros da mansão.', x: 16, y: 45, width: 20, height: 55, actionType: 'examine' }
        ]
      }
    };

    // ATMOSPHERE CANVAS
    function AtmosphereCanvas({ isSpectralActive, onLightningTrigger }) {
      const canvasRef = useRef(null);
      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const particles = Array.from({ length: 30 }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.8,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: -(Math.random() * 0.4 + 0.1),
          alpha: Math.random() * 0.5 + 0.2,
        }));

        let nextLightning = Date.now() + 10000;
        let flashAlpha = 0;

        const render = () => {
          ctx.clearRect(0, 0, width, height);
          const now = Date.now();
          if (now > nextLightning) {
            flashAlpha = 0.3;
            nextLightning = now + Math.random() * 18000 + 9000;
            if (onLightningTrigger) onLightningTrigger();
          }
          if (flashAlpha > 0.005) {
            ctx.fillStyle = \`rgba(235, 245, 255, \${flashAlpha})\`;
            ctx.fillRect(0, 0, width, height);
            flashAlpha *= 0.88;
          }
          particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.y < 0) { p.y = height + 10; p.x = Math.random() * width; }
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = isSpectralActive ? 'hsla(280, 85%, 70%, 0.45)' : 'hsla(40, 60%, 75%, 0.35)';
            ctx.fill();
          });
          animationFrameId = requestAnimationFrame(render);
        };
        render();
        return () => {
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animationFrameId);
        };
      }, [isSpectralActive, onLightningTrigger]);

      return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-20" />;
    }

    // MAIN APP COMPONENT
    function App() {
      const [gameState, setGameState] = useState('TITLE');
      const [graphicStyle, setGraphicStyle] = useState('animation');
      const [currentRoomId, setCurrentRoomId] = useState('living_room');
      const [inventory, setInventory] = useState([]);
      const [selectedItem, setSelectedItem] = useState(null);
      const [inspectingItem, setInspectingItem] = useState(null);
      const [pickedItems, setPickedItems] = useState(new Set());
      const [openedDrawers, setOpenedDrawers] = useState(new Set());
      const [isSpectralActive, setIsSpectralActive] = useState(false);
      const [isMuted, setIsMuted] = useState(false);
      const [isClockUnlocked, setIsClockUnlocked] = useState(false);
      const [isPianoSolved, setIsPianoSolved] = useState(false);
      const [isMirrorCleaned, setIsMirrorCleaned] = useState(false);
      const [isJewelrySolved, setIsJewelrySolved] = useState(false);
      const [activeModal, setActiveModal] = useState(null);
      const [journalNotes, setJournalNotes] = useState([
        { id: '1', title: 'Despertar na Mansão Ravenwood', date: '14 de Novembro de 1892', content: 'Acordei nesta mansão sob chuva torrencial. As portas estão lacradas e um espectro feminino chora na janela.' }
      ]);
      const [dialogueText, setDialogueText] = useState(null);
      const [lightningActive, setLightningActive] = useState(false);
      const [endingType, setEndingType] = useState(null);
      const [isInventoryMinimized, setIsInventoryMinimized] = useState(false);
      const [isCompactSlots, setIsCompactSlots] = useState(false);
      const [showPrecisionHints, setShowPrecisionHints] = useState(true);
      const [ripples, setRipples] = useState([]);
      const [focusedHotspot, setFocusedHotspot] = useState(null);

      const showToast = (msg) => {
        setDialogueText(msg);
        setTimeout(() => setDialogueText(null), 4000);
      };

      const handleStartGame = () => {
        audioEngine.ensureContext();
        audioEngine.startSoundtrack();
        audioEngine.playDoorCreak();
        setGameState('PLAYING');
        showToast('Você acorda com o eco da tempestade nas vidraças da Mansão Ravenwood...');
      };

      const handleRestart = () => {
        setGameState('PLAYING');
        setEndingType(null);
        setCurrentRoomId('living_room');
        setInventory([]);
        setSelectedItem(null);
        setInspectingItem(null);
        setPickedItems(new Set());
        setOpenedDrawers(new Set());
        setIsSpectralActive(false);
        setIsClockUnlocked(false);
        setIsPianoSolved(false);
        setIsMirrorCleaned(false);
        setIsJewelrySolved(false);
        setActiveModal(null);
        audioEngine.setTension(1);
        audioEngine.startSoundtrack();
        showToast('O ciclo reinicia na fria sala de estar...');
      };

      const handleDirectPickup = (itemId) => {
        const item = ITEMS[itemId];
        if (item) {
          audioEngine.playItemPickup();
          setInventory(prev => [...prev, item]);
          setPickedItems(prev => new Set(prev).add(itemId));
          showToast(\`Você recolheu com sucesso: \${item.name}.\`);
        }
      };

      const handleDirectUnlockDrawer = (drawerId) => {
        audioEngine.playLockUnlock();
        setOpenedDrawers(prev => new Set(prev).add(drawerId));
        setSelectedItem(null);
        showToast('Você girou a Chave de Ferro! O armário se abriu revelando a partitura e o frasco de solvente.');
      };

      const handleNavigate = (targetRoomId) => {
        if (targetRoomId === 'bedroom' && currentRoomId === 'living_room') {
          const hasKey = inventory.some(i => i.id === 'bride_bedroom_key');
          if (!hasKey) {
            showToast('A porta dos Aposentos da Noiva está trancada por uma fechadura de coração alado.');
            return;
          }
        }
        audioEngine.playDoorCreak();
        setCurrentRoomId(targetRoomId);
        setFocusedHotspot(null);
      };

      const handleHotspotClick = (hotspot) => {
        audioEngine.ensureContext();
        if (hotspot.actionType === 'navigate' && hotspot.targetRoom) {
          handleNavigate(hotspot.targetRoom);
          return;
        }
        if (hotspot.actionType === 'pickup' && hotspot.itemId) {
          handleDirectPickup(hotspot.itemId);
          return;
        }
        if (hotspot.actionType === 'puzzle' && hotspot.targetPuzzle) {
          setActiveModal(hotspot.targetPuzzle);
          return;
        }
        if (hotspot.description) {
          if (hotspot.id === 'arched_window') audioEngine.playThunder();
          showToast(hotspot.description);
        }
      };

      const handleCombineItems = (itemA, itemB) => {
        if ((itemA.id === 'sheet_music_half_1' && itemB.id === 'sheet_music_half_2') ||
            (itemA.id === 'sheet_music_half_2' && itemB.id === 'sheet_music_half_1')) {
          audioEngine.playPuzzleSolved();
          const combined = ITEMS.sheet_music_complete;
          setInventory(prev => prev.filter(i => i.id !== 'sheet_music_half_1' && i.id !== 'sheet_music_half_2').concat(combined));
          setSelectedItem(combined);
          showToast('Você juntou as duas metades da partitura! A melodia é: LÁ - FÁ - MI - SOL - DÓ.');
          return;
        }
        if ((itemA.id === 'dusty_cloth' && itemB.id === 'solvent_bottle') ||
            (itemA.id === 'solvent_bottle' && itemB.id === 'dusty_cloth')) {
          audioEngine.playLockUnlock();
          const combined = ITEMS.moist_cloth;
          setInventory(prev => prev.filter(i => i.id !== 'dusty_cloth' && i.id !== 'solvent_bottle').concat(combined));
          setSelectedItem(combined);
          showToast('Você embebeu o lenço com o solvente alquímico! Agora é possível limpar o espelho da noiva.');
          return;
        }
        showToast('Esses itens não parecem se combinar.');
      };

      const handleDownloadSelf = () => {
        const html = document.documentElement.outerHTML;
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'o_segredo_da_mansao_ravenwood.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      const currentRoom = ROOMS[currentRoomId];
      const currentImages = graphicStyle === 'animation' ? IMAGES.animation : IMAGES.classic;
      const roomImgKey = currentRoomId === 'living_room' ? 'livingRoom' : currentRoomId === 'music_room' ? 'musicRoom' : currentRoomId === 'bedroom' ? 'bedroom' : 'crypt';
      const roomImage = currentImages[roomImgKey];

      const hasIronKey = inventory.some(i => i.id === 'iron_key');
      const isMusicDrawerUnlocked = openedDrawers.has('music_drawer');
      const hasMinuteHand = inventory.some(i => i.id === 'clock_minute_hand');
      const hasCompleteSheet = inventory.some(i => i.id === 'sheet_music_complete');
      const hasMoistCloth = inventory.some(i => i.id === 'moist_cloth');
      const hasWeddingRing = inventory.some(i => i.id === 'wedding_ring');
      const hasSpectralLens = inventory.some(i => i.id === 'spectral_lens');

      return (
        <div className="relative flex min-h-screen flex-col bg-[#07060b] text-[#e8dfd5] font-ui select-none overflow-hidden">
          <AtmosphereCanvas
            isSpectralActive={isSpectralActive}
            onLightningTrigger={() => {
              audioEngine.playThunder();
              setLightningActive(true);
              setTimeout(() => setLightningActive(false), 900);
            }}
          />

          {/* Top Bar */}
          <header className="relative z-30 flex h-14 items-center justify-between border-b border-amber-950/60 bg-[#0d0914]/90 px-6 backdrop-blur-md">
            <div className="font-gothic text-base font-bold tracking-wider text-amber-200">
              Mansão Ravenwood
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-vintage text-neutral-400">
              <span>{currentRoom?.name}</span>
              <span aria-hidden="true">·</span>
              <span>14 de Novembro de 1892</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-500/80">{isSpectralActive ? 'Visão Espectral (ON)' : 'Tempestade'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setGraphicStyle(prev => prev === 'animation' ? 'classic' : 'animation')}
                className="rounded-lg border border-amber-900/60 bg-[#161020] px-2.5 py-1 text-xs font-gothic text-amber-300 hover:bg-[#201830]"
              >
                {graphicStyle === 'animation' ? '🎨 Modo: Animação 2D' : '🖼️ Modo: Pintura'}
              </button>
              <button
                onClick={handleDownloadSelf}
                className="hidden md:flex items-center gap-1 rounded-lg border border-amber-600/80 bg-amber-950/70 px-2.5 py-1 text-xs font-gothic text-amber-200 hover:bg-amber-900"
                title="Baixar este arquivo index.html completo e autônomo"
              >
                💾 Baixar HTML
              </button>
              <button
                onClick={() => setActiveModal('journal')}
                className="rounded-lg border border-amber-950 bg-[#161020] px-3 py-1 font-gothic text-xs font-semibold text-amber-200 hover:bg-[#201830]"
              >
                Diário ({journalNotes.length})
              </button>
            </div>
          </header>

          {/* Main Stage */}
          <main className="relative flex-1 flex flex-col items-center justify-center">
            {gameState === 'TITLE' && (
              <div className="relative z-30 flex max-w-xl flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-6 h-44 w-44 overflow-hidden rounded-full border-4 border-amber-800/80 shadow-[0_0_40px_rgba(217,119,6,0.3)]">
                  <img src={currentImages.portraitBride} alt="Eleonora" className="h-full w-full object-cover" />
                </div>
                <h1 className="font-gothic text-4xl font-extrabold tracking-wide text-amber-100">
                  O Segredo da Mansão Ravenwood
                </h1>
                <p className="mt-3 font-vintage text-lg leading-relaxed text-amber-200/90">
                  Um mistério gótico de terror psicológico com puzzles profundos, trilha de piano e um plot twist emocionante.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleStartGame}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 px-8 py-3.5 font-gothic text-sm font-bold text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-95 transition-all"
                  >
                    ▶ Adentrar a Mansão
                  </button>
                  <button
                    onClick={handleDownloadSelf}
                    className="flex items-center gap-2 rounded-xl border border-amber-700/80 bg-neutral-900/80 px-5 py-3.5 font-gothic text-xs font-bold text-amber-200 hover:bg-neutral-800"
                  >
                    💾 Baixar index.html Autônomo
                  </button>
                </div>
              </div>
            )}

            {gameState === 'PLAYING' && (
              <>
                <div className={\`relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center p-2 transition-all duration-300 \${isInventoryMinimized ? 'h-[calc(100vh-65px)]' : 'h-[calc(100vh-140px)]'}\`}>
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      audioEngine.playTapSound();
                      const rip = { id: Date.now(), x, y };
                      setRipples(prev => [...prev.slice(-3), rip]);
                      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rip.id)), 600);
                    }}
                    className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border-2 border-amber-950/70 bg-black shadow-[0_0_50px_rgba(0,0,0,0.9)] cursor-crosshair select-none"
                  >
                    <img
                      src={roomImage}
                      alt={currentRoom.name}
                      className={\`h-full w-full object-cover pointer-events-none transition-all duration-700 \${isSpectralActive ? 'brightness-90 contrast-125 saturate-50 hue-rotate-15' : ''}\`}
                    />

                    {/* Room Specific 2D Animations */}
                    {currentRoomId === 'living_room' && (
                      <>
                        <div className="pointer-events-none absolute left-[23.2%] top-[56%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-pendulum opacity-80" style={{ transformOrigin: 'top center' }}>
                          <div className="h-10 w-0.5 bg-amber-400/90" />
                          <div className="h-4 w-4 rounded-full border border-amber-600 bg-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                        </div>
                        <div className="pointer-events-none absolute left-[55%] top-[70%] -translate-x-1/2 -translate-y-1/2 flex gap-1 animate-flame">
                          <div className="h-5 w-4 rounded-t-full bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-300 opacity-75 blur-[1px]" />
                          <div className="h-6 w-3 rounded-t-full bg-gradient-to-t from-red-600 via-orange-500 to-amber-200 opacity-80 blur-[0.5px]" />
                        </div>
                      </>
                    )}

                    {currentRoomId === 'music_room' && (
                      <>
                        <div className="pointer-events-none absolute left-[22%] top-[48%] -translate-x-1/2 -translate-y-1/2 flex gap-2 animate-candle">
                          <div className="h-3 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                          <div className="h-3.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                        </div>
                        {(lightningActive || isSpectralActive) && (
                          <div className="pointer-events-none absolute left-[75%] top-[28%] -translate-x-1/2 -translate-y-1/2 animate-ghostly">
                            <div className="h-14 w-10 rounded-t-full bg-black/75 border border-purple-400/40 blur-[1px] shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
                          </div>
                        )}
                      </>
                    )}

                    {/* Ripples */}
                    {ripples.map(r => (
                      <div key={r.id} style={{ left: r.x, top: r.y }} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-ping">
                        <div className="h-7 w-7 rounded-full border border-amber-400/90 bg-amber-300/25" />
                      </div>
                    ))}

                    {/* Hotspots */}
                    {currentRoom.hotspots.map(h => {
                      if (h.spectralOnly && !isSpectralActive) return null;
                      if (h.id === 'crypt_passage' && !isClockUnlocked) return null;
                      if (h.actionType === 'pickup' && h.itemId && pickedItems.has(h.itemId)) return null;

                      const isFocused = focusedHotspot?.id === h.id;
                      return (
                        <button
                          key={h.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            audioEngine.playTapSound();
                            setFocusedHotspot(h);
                            handleHotspotClick(h);
                          }}
                          style={{ left: \`\${h.x}%\`, top: \`\${h.y}%\`, width: \`\${h.width}%\`, height: \`\${h.height}%\` }}
                          className={\`group absolute -translate-x-1/2 -translate-y-1/2 rounded-lg cursor-pointer transition-all z-20 \${
                            isFocused
                              ? 'ring-2 ring-amber-400 bg-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                              : showPrecisionHints
                              ? h.spectralOnly
                                ? 'border-2 border-purple-400/70 bg-purple-900/25 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                                : 'border border-amber-400/40 bg-amber-950/15 hover:border-amber-300 hover:bg-amber-400/20'
                              : 'hover:border hover:border-amber-400/60 hover:bg-amber-400/10'
                          }\`}
                        >
                          {showPrecisionHints && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className={\`px-2 py-0.5 text-[10px] font-gothic font-bold rounded shadow \${h.spectralOnly ? 'bg-purple-950/90 text-purple-200 border border-purple-400' : 'bg-black/85 text-amber-300 border border-amber-500/80'}\`}>
                                {h.title}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}

                    {/* Navigation Arrows */}
                    {currentRoom.connectedRooms.left && (
                      <button onClick={(e) => { e.stopPropagation(); handleNavigate(currentRoom.connectedRooms.left); }} className="absolute left-3 top-1/2 -translate-y-1/2 z-30 rounded-full border border-amber-900/60 bg-black/75 p-3 text-amber-200 hover:text-white hover:border-amber-400 text-xl">
                        ◀
                      </button>
                    )}
                    {currentRoom.connectedRooms.right && (
                      <button onClick={(e) => { e.stopPropagation(); handleNavigate(currentRoom.connectedRooms.right); }} className="absolute right-3 top-1/2 -translate-y-1/2 z-30 rounded-full border border-amber-900/60 bg-black/75 p-3 text-amber-200 hover:text-white hover:border-amber-400 text-xl">
                        ▶
                      </button>
                    )}
                    {currentRoom.connectedRooms.forward && (
                      <button onClick={(e) => { e.stopPropagation(); handleNavigate(currentRoom.connectedRooms.forward); }} className="absolute top-3 left-1/2 -translate-x-1/2 z-30 rounded-full border border-amber-900/60 bg-black/75 p-2.5 text-amber-200 hover:text-white hover:border-amber-400 text-lg">
                        ▲
                      </button>
                    )}
                    {currentRoom.connectedRooms.back && (
                      <button onClick={(e) => { e.stopPropagation(); handleNavigate(currentRoom.connectedRooms.back); }} className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 rounded-full border border-amber-900/60 bg-black/75 p-2.5 text-amber-200 hover:text-white hover:border-amber-400 text-lg">
                        ▼
                      </button>
                    )}

                    {/* Focused Object Drawer */}
                    {focusedHotspot && (
                      <div className="absolute bottom-12 left-4 right-4 z-40 flex items-center justify-between rounded-xl border-2 border-amber-700/80 bg-[#120d1c]/95 p-3 shadow-2xl backdrop-blur-md">
                        <div className="pr-3">
                          <h4 className="font-gothic text-sm font-bold text-amber-200">{focusedHotspot.title}</h4>
                          <p className="font-vintage text-xs text-neutral-300 mt-0.5 line-clamp-1">{focusedHotspot.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {focusedHotspot.id === 'fireplace' && !pickedItems.has('iron_key') && (
                            <button onClick={(e) => { e.stopPropagation(); handleDirectPickup('iron_key'); setFocusedHotspot(null); }} className="rounded-lg bg-amber-600 px-3 py-1.5 font-gothic text-xs font-bold text-black hover:bg-amber-500">
                              🗝️ Pegar Chave de Ferro
                            </button>
                          )}
                          {focusedHotspot.id === 'music_drawer' && (
                            !isMusicDrawerUnlocked ? (
                              hasIronKey ? (
                                <button onClick={(e) => { e.stopPropagation(); handleDirectUnlockDrawer('music_drawer'); }} className="rounded-lg bg-amber-600 px-3 py-1.5 font-gothic text-xs font-bold text-black hover:bg-amber-500">
                                  🗝️ Destrancar Armário
                                </button>
                              ) : <span className="font-vintage text-xs text-amber-400/80 italic">(Requer chave de lira)</span>
                            ) : (
                              <div className="flex gap-1.5">
                                {!pickedItems.has('sheet_music_half_2') && (
                                  <button onClick={(e) => { e.stopPropagation(); handleDirectPickup('sheet_music_half_2'); }} className="rounded bg-amber-700 px-2.5 py-1 text-xs font-gothic text-amber-100 hover:bg-amber-600">
                                    📜 Pegar Partitura
                                  </button>
                                )}
                                {!pickedItems.has('solvent_bottle') && (
                                  <button onClick={(e) => { e.stopPropagation(); handleDirectPickup('solvent_bottle'); }} className="rounded bg-amber-700 px-2.5 py-1 text-xs font-gothic text-amber-100 hover:bg-amber-600">
                                    🧪 Pegar Solvente
                                  </button>
                                )}
                              </div>
                            )
                          )}
                          {focusedHotspot.id === 'canopy_bed' && !pickedItems.has('dusty_cloth') && (
                            <button onClick={(e) => { e.stopPropagation(); handleDirectPickup('dusty_cloth'); setFocusedHotspot(null); }} className="rounded-lg bg-amber-600 px-3 py-1.5 font-gothic text-xs font-bold text-black hover:bg-amber-500">
                              🧣 Pegar Lenço de Seda
                            </button>
                          )}
                          {focusedHotspot.id === 'grand_piano' && (
                            <button onClick={() => setActiveModal('piano')} className="rounded-lg bg-amber-600 px-3 py-1.5 font-gothic text-xs font-bold text-black hover:bg-amber-500">
                              🎹 Tocar Piano
                            </button>
                          )}
                          {focusedHotspot.id === 'grandfather_clock' && (
                            <button onClick={() => setActiveModal('clock')} className="rounded-lg bg-amber-600 px-3 py-1.5 font-gothic text-xs font-bold text-black hover:bg-amber-500">
                              ⏱️ Ajustar Relógio
                            </button>
                          )}
                          {focusedHotspot.id === 'vanity_mirror' && (
                            <button onClick={() => setActiveModal('mirror')} className="rounded-lg bg-amber-600 px-3 py-1.5 font-gothic text-xs font-bold text-black hover:bg-amber-500">
                              🪞 Olhar no Espelho
                            </button>
                          )}
                          {focusedHotspot.id === 'jewelry_box' && (
                            <button onClick={() => setActiveModal('jewelry')} className="rounded-lg bg-amber-600 px-3 py-1.5 font-gothic text-xs font-bold text-black hover:bg-amber-500">
                              🔐 Abrir Caixa de Joias
                            </button>
                          )}
                          {focusedHotspot.id === 'crypt_altar' && (
                            <button onClick={() => setActiveModal('crypt')} className="rounded-lg bg-amber-600 px-3 py-1.5 font-gothic text-xs font-bold text-black hover:bg-amber-500">
                              ⚰️ Examinar Sarcófago
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); setFocusedHotspot(null); }} className="p-1 text-neutral-400 hover:text-white">
                            ✕
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Precision Toggle Button */}
                    <div className="absolute top-3 right-4 z-30">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowPrecisionHints(!showPrecisionHints); }}
                        className={\`px-2.5 py-1 text-xs font-gothic rounded border shadow \${showPrecisionHints ? 'border-amber-500 bg-amber-950/90 text-amber-200' : 'border-neutral-800 bg-black/70 text-neutral-400'}\`}
                      >
                        {showPrecisionHints ? '🎯 Pistas (ON)' : '👁️ Revelar Objetos'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Minimizable Inventory Bar */}
                <div className={\`fixed bottom-0 left-0 right-0 z-40 border-t border-amber-950/80 bg-[#100d17]/95 shadow-2xl backdrop-blur-md transition-transform duration-300 \${isInventoryMinimized ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'}\`}>
                  {/* Minimize / Maximize Tab Header */}
                  <div className="flex justify-center -translate-y-full">
                    <button
                      onClick={() => setIsInventoryMinimized(!isInventoryMinimized)}
                      className="flex items-center gap-1.5 rounded-t-lg border-t border-x border-amber-900/60 bg-[#100d17] px-4 py-1 text-[11px] font-gothic text-amber-300 shadow-md hover:bg-amber-950"
                    >
                      {isInventoryMinimized ? '▲ Abrir Inventário' : '▼ Ocultar Barra Inferior'}
                    </button>
                  </div>

                  <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2">
                    <div className="flex items-center gap-2">
                      {hasSpectralLens && (
                        <button
                          onClick={() => { audioEngine.playLockUnlock(); setIsSpectralActive(!isSpectralActive); }}
                          className={\`px-3 py-1.5 rounded-lg border text-xs font-gothic \${isSpectralActive ? 'border-purple-500 bg-purple-950 text-purple-200 animate-pulse' : 'border-neutral-800 bg-[#140e1f] text-neutral-300'}\`}
                        >
                          🔮 {isSpectralActive ? 'Visão Espectral (ON)' : 'Lente Oculta'}
                        </button>
                      )}
                    </div>

                    {/* Slots */}
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {inventory.map(item => {
                        const isSelected = selectedItem?.id === item.id;
                        return (
                          <div key={item.id} className="relative">
                            <button
                              onClick={() => {
                                if (!selectedItem) setSelectedItem(item);
                                else if (selectedItem.id === item.id) setSelectedItem(null);
                                else {
                                  if (selectedItem.canCombineWith === item.id || item.canCombineWith === selectedItem.id) {
                                    handleCombineItems(selectedItem, item);
                                  } else {
                                    setSelectedItem(item);
                                  }
                                }
                              }}
                              className={\`relative flex items-center justify-center rounded-lg border transition-all \${isCompactSlots ? 'h-9 w-9 text-lg' : 'h-12 w-12 text-2xl'} \${
                                isSelected ? 'border-amber-400 bg-amber-950/90 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-105' : 'border-amber-950/70 bg-[#191322] hover:bg-[#221a2e]'
                              }\`}
                              title={item.name}
                            >
                              <span>{item.icon}</span>
                            </button>
                            {isSelected && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setInspectingItem(item); }}
                                className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] text-black font-bold"
                                title="Examinar"
                              >
                                🔍
                              </button>
                            )}
                          </div>
                        );
                      })}
                      {inventory.length === 0 && (
                        <span className="font-vintage text-xs italic text-neutral-500">
                          (Inventário vazio — examine a mansão)
                        </span>
                      )}
                    </div>

                    {/* Audio & Compact Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsCompactSlots(!isCompactSlots)}
                        className="p-1.5 rounded border border-neutral-800 bg-[#140e1d] text-neutral-400 hover:text-white text-xs font-gothic"
                        title="Modo Compacto de Ícones"
                      >
                        {isCompactSlots ? '⛶ Padrão' : '⛶ Compacto'}
                      </button>
                      <button
                        onClick={() => setIsMuted(audioEngine.toggleMute())}
                        className="p-1.5 rounded border border-neutral-800 bg-[#140e1d] text-neutral-400 hover:text-white"
                        title={isMuted ? 'Desmutar' : 'Mutar'}
                      >
                        {isMuted ? '🔇' : '🔊'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Dialogue Toast */}
            {dialogueText && (
              <div className="fixed top-18 z-50 max-w-lg rounded-lg border border-amber-900/80 bg-[#120d1c]/95 px-4 py-2.5 text-center font-vintage text-sm leading-relaxed text-amber-200 shadow-2xl backdrop-blur-md">
                {dialogueText}
              </div>
            )}
          </main>

          {/* MODALS */}
          {/* Clock Modal */}
          {activeModal === 'clock' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
              <ClockPuzzleInner
                hasMinuteHand={hasMinuteHand}
                isUnlocked={isClockUnlocked}
                onSolve={() => {
                  setIsClockUnlocked(true);
                  setActiveModal(null);
                  audioEngine.playClockChime();
                  showToast('O relógio bateu 03:45! A passagem secreta para a Cripta se abriu no salão.');
                }}
                onClose={() => setActiveModal(null)}
              />
            </div>
          )}

          {/* Piano Modal */}
          {activeModal === 'piano' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
              <PianoPuzzleInner
                hasCompleteSheet={hasCompleteSheet}
                isSolved={isPianoSolved}
                onSolve={() => {
                  setIsPianoSolved(true);
                  setInventory(prev => [...prev, ITEMS.wedding_ring, ITEMS.bride_bedroom_key]);
                  showToast('O compartimento do piano se abriu! Você recolheu a Aliança de Noivado e a Chave da Noiva.');
                }}
                onClose={() => setActiveModal(null)}
              />
            </div>
          )}

          {/* Jewelry Box Modal */}
          {activeModal === 'jewelry' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
              <JewelryPuzzleInner
                isSolved={isJewelrySolved}
                onSolve={() => {
                  setIsJewelrySolved(true);
                  setInventory(prev => [...prev, ITEMS.clock_minute_hand, ITEMS.spectral_lens]);
                  showToast('A caixa de joias abriu! Você recolheu o Ponteiro dos Minutos e a Lente de Vidência.');
                }}
                onClose={() => setActiveModal(null)}
              />
            </div>
          )}

          {/* Mirror Modal */}
          {activeModal === 'mirror' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
              <MirrorPuzzleInner
                hasMoistCloth={hasMoistCloth}
                isCleaned={isMirrorCleaned}
                onCleaned={() => {
                  setIsMirrorCleaned(true);
                  showToast('O reflexo no espelho não possuía rosto... Ele revelou a hora fatal: 03:45!');
                }}
                onClose={() => setActiveModal(null)}
              />
            </div>
          )}

          {/* Crypt Modal */}
          {activeModal === 'crypt' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-lg">
              <CryptTombInner
                hasWeddingRing={hasWeddingRing}
                onEndingChosen={(type) => {
                  setActiveModal(null);
                  setEndingType(type);
                  setGameState('ENDING');
                }}
                onClose={() => setActiveModal(null)}
              />
            </div>
          )}

          {/* Journal Modal */}
          {activeModal === 'journal' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
              <div className="relative w-full max-w-lg rounded-xl border border-amber-950 bg-[#140f1a] p-6 shadow-2xl text-[#f3ede4]">
                <div className="flex justify-between border-b border-amber-950 pb-2">
                  <h3 className="font-gothic text-base font-bold text-amber-200">📖 Diário de Memórias e Pistas</h3>
                  <button onClick={() => setActiveModal(null)} className="text-neutral-400 hover:text-white">✕</button>
                </div>
                <div className="my-4 space-y-3 max-h-72 overflow-y-auto pr-1">
                  {journalNotes.map(n => (
                    <div key={n.id} className="rounded border border-amber-900/40 bg-[#1b1424] p-3 text-xs">
                      <div className="font-gothic font-bold text-amber-300">{n.title}</div>
                      <p className="font-vintage text-sm text-neutral-200 mt-1">{n.content}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full rounded bg-amber-900/60 py-2 text-xs font-gothic text-amber-100 hover:bg-amber-800">
                  Fechar Diário
                </button>
              </div>
            </div>
          )}

          {/* Inspect Modal */}
          {inspectingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
              <div className="relative w-full max-w-md rounded-xl border border-amber-950 bg-[#120f18] p-6 shadow-2xl text-center">
                <button onClick={() => setInspectingItem(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">✕</button>
                <div className="text-4xl my-3">{inspectingItem.icon}</div>
                <h4 className="font-gothic text-lg font-bold text-amber-100">{inspectingItem.name}</h4>
                <p className="font-vintage text-xs text-neutral-400 mt-1">{inspectingItem.description}</p>
                <div className="my-4 rounded bg-[#191322] p-3 font-vintage text-sm text-amber-200/90 border border-amber-950">
                  {inspectingItem.inspectText}
                </div>
                <button onClick={() => setInspectingItem(null)} className="w-full rounded bg-amber-800/80 py-2 text-xs font-gothic text-amber-100">
                  Guardar
                </button>
              </div>
            </div>
          )}

          {/* Ending Screen */}
          {gameState === 'ENDING' && endingType && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl">
              <div className="max-w-2xl text-center rounded-2xl border-2 border-amber-900/60 bg-gradient-to-b from-[#181124] to-[#0a070f] p-8 shadow-2xl">
                {endingType === 'REDEMPTION' ? (
                  <>
                    <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-amber-400/80 shadow-[0_0_35px_rgba(251,191,36,0.4)] mb-4">
                      <img src={currentImages.portraitBride} alt="Eleonora" className="h-full w-full object-cover" />
                    </div>
                    <span className="font-gothic text-xs font-bold uppercase text-amber-400">Final Verdadeiro — A Ascensão dos Amantes</span>
                    <h2 className="font-gothic text-3xl font-bold text-amber-100 mt-1">O Abraço na Eternidade</h2>
                    <p className="font-vintage text-base text-amber-200/90 max-w-lg mx-auto my-4 leading-relaxed">
                      Ao segurar a mão de Eleonora, o luto de um século se dissolve. As paredes da mansão desfazem-se em notas límpidas de piano e vocês caminham juntos para a luz infinita.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl my-4">💀</div>
                    <span className="font-gothic text-xs font-bold uppercase text-red-400">Final Trágico — O Ciclo da Negação</span>
                    <h2 className="font-gothic text-3xl font-bold text-neutral-100 mt-1">Prisioneiro do Próprio Luto</h2>
                    <p className="font-vintage text-base text-neutral-300 max-w-lg mx-auto my-4 leading-relaxed">
                      Você tenta correr para as grades do portão, mas a escuridão o puxa de volta. O relógio distante bate 03:45... e você desperta mais uma vez no chão da sala de estar, preso no pesadelo.
                    </p>
                  </>
                )}
                <div className="flex justify-center gap-3 mt-6">
                  <button onClick={handleRestart} className="rounded-xl bg-amber-600 px-6 py-2.5 font-gothic text-sm font-bold text-black hover:bg-amber-500">
                    Jogar Novamente
                  </button>
                  <button onClick={handleDownloadSelf} className="rounded-xl border border-amber-600 bg-neutral-900 px-6 py-2.5 font-gothic text-sm font-bold text-amber-200">
                    💾 Baixar Jogo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // CLOCK PUZZLE INNER
    function ClockPuzzleInner({ hasMinuteHand, isUnlocked, onSolve, onClose }) {
      const [placedHand, setPlacedHand] = useState(isUnlocked || false);
      const [hour, setHour] = useState(12);
      const [minute, setMinute] = useState(0);
      const [msg, setMsg] = useState(null);

      const hourDeg = (hour % 12) * 30 + (minute / 60) * 30;
      const minuteDeg = minute * 6;

      const handleVerify = () => {
        if (!placedHand) { setMsg('O relógio está sem o ponteiro dos minutos!'); return; }
        if (hour === 3 && minute === 45) {
          audioEngine.playClockChime();
          audioEngine.playPuzzleSolved();
          setMsg('O pêndulo vibra! Três badaladas ecoam.');
          setTimeout(onSolve, 1400);
        } else {
          audioEngine.playHeartbeat();
          setMsg(\`Nada aconteceu. (\${hour.toString().padStart(2, '0')}:\${minute.toString().padStart(2, '0')} não é a hora certa).\`);
        }
      };

      return (
        <div className="relative w-full max-w-md rounded-xl border border-amber-900/60 bg-[#120f18] p-6 shadow-2xl text-center">
          <div className="flex justify-between border-b border-amber-950 pb-2">
            <h3 className="font-gothic text-base font-bold text-amber-200">O Relógio do Tempo Estagnado</h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">✕</button>
          </div>
          <div className="relative my-6 mx-auto flex h-52 w-52 items-center justify-center rounded-full border-4 border-amber-800/60 bg-[#1f1726]">
            {/* Hour hand */}
            <div className="absolute bottom-1/2 left-1/2 h-16 w-1.5 origin-bottom -translate-x-1/2 rounded bg-amber-400" style={{ transform: \`translateX(-50%) rotate(\${hourDeg}deg)\` }} />
            {/* Minute hand */}
            {placedHand ? (
              <div className="absolute bottom-1/2 left-1/2 h-22 w-1 origin-bottom -translate-x-1/2 rounded bg-amber-200" style={{ transform: \`translateX(-50%) rotate(\${minuteDeg}deg)\` }} />
            ) : <span className="font-vintage text-xs text-amber-500/70">(Falta ponteiro)</span>}
            <div className="absolute h-4 w-4 rounded-full bg-amber-300 border border-amber-600" />
          </div>
          <div className="font-gothic text-base text-amber-300 tracking-widest my-2">
            {hour.toString().padStart(2, '0')}:{placedHand ? minute.toString().padStart(2, '0') : '--'}
          </div>
          <div className="flex justify-center gap-3 my-3">
            <div className="flex items-center gap-1 border border-amber-950 p-1.5 rounded bg-black/40 text-xs">
              <span>Horas:</span>
              <button onClick={() => { audioEngine.playClockTick(); setHour(h => h === 1 ? 12 : h - 1); }} className="px-2 py-0.5 bg-neutral-800 rounded">-</button>
              <button onClick={() => { audioEngine.playClockTick(); setHour(h => h === 12 ? 1 : h + 1); }} className="px-2 py-0.5 bg-neutral-800 rounded">+</button>
            </div>
            <div className="flex items-center gap-1 border border-amber-950 p-1.5 rounded bg-black/40 text-xs">
              <span>Minutos:</span>
              <button disabled={!placedHand} onClick={() => { audioEngine.playClockTick(); setMinute(m => m === 0 ? 55 : m - 5); }} className="px-2 py-0.5 bg-neutral-800 rounded disabled:opacity-40">-</button>
              <button disabled={!placedHand} onClick={() => { audioEngine.playClockTick(); setMinute(m => (m + 5) % 60); }} className="px-2 py-0.5 bg-neutral-800 rounded disabled:opacity-40">+</button>
            </div>
          </div>
          {!placedHand && hasMinuteHand && (
            <button onClick={() => { audioEngine.playLockUnlock(); setPlacedHand(true); }} className="w-full my-2 rounded border border-amber-600 bg-amber-950/40 py-2 text-xs font-vintage text-amber-200">
              Encaixar Ponteiro de Bronze dos Minutos
            </button>
          )}
          <button onClick={handleVerify} className="w-full rounded bg-amber-700 py-2.5 text-xs font-gothic font-bold text-amber-100 hover:bg-amber-600">
            Destravar Mecanismo
          </button>
          {msg && <div className="mt-2 text-xs font-vintage text-amber-300">{msg}</div>}
        </div>
      );
    }

    // PIANO PUZZLE INNER
    function PianoPuzzleInner({ hasCompleteSheet, isSolved, onSolve, onClose }) {
      const [notes, setNotes] = useState([]);
      const [msg, setMsg] = useState(null);
      const TARGET = ['A4', 'F4', 'E4', 'G4', 'C4'];
      const keys = [
        { note: 'C4', label: 'DÓ' }, { note: 'D4', label: 'RÉ' }, { note: 'E4', label: 'MI' },
        { note: 'F4', label: 'FÁ' }, { note: 'G4', label: 'SOL' }, { note: 'A4', label: 'LÁ' },
        { note: 'B4', label: 'SI' }, { note: 'C5', label: 'DÓ+' },
      ];

      const playKey = (note) => {
        audioEngine.playPianoNote(note, 2.0, 0.85);
        if (isSolved) return;
        const next = [...notes, note];
        setNotes(next);
        const tail = next.slice(-TARGET.length);
        if (tail.length === TARGET.length && tail.every((n, i) => n === TARGET[i])) {
          audioEngine.playPuzzleSolved();
          setMsg('O compartimento secreto sob a caixa de ressonância se abriu!');
          setTimeout(onSolve, 1400);
        }
      };

      return (
        <div className="relative w-full max-w-xl rounded-xl border border-amber-950 bg-[#110e17] p-6 shadow-2xl text-center">
          <div className="flex justify-between border-b border-amber-950 pb-2">
            <h3 className="font-gothic text-base font-bold text-amber-200">Piano de Cauda Imperial</h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">✕</button>
          </div>
          <div className="my-4 rounded bg-[#1c1613] p-3 border border-amber-900/40 text-xs font-vintage">
            <span className="font-gothic text-amber-400">{hasCompleteSheet ? 'Partitura: Valsa dos Amantes' : 'Partitura Rasgada'}</span>
            <div className="mt-1 font-gothic text-base text-amber-300">
              {hasCompleteSheet ? 'LÁ — FÁ — MI — SOL — DÓ' : 'Faltam notas... Junte as duas metades da partitura'}
            </div>
          </div>
          <div className="flex justify-center gap-1.5 h-36 bg-black p-2 rounded border-b-4 border-amber-950">
            {keys.map(k => (
              <button
                key={k.note}
                onClick={() => playKey(k.note)}
                className="flex-1 bg-gradient-to-b from-[#faf7f2] to-[#ded6c7] rounded-b pb-2 flex flex-col justify-end text-neutral-900 font-gothic text-xs font-bold hover:bg-[#fff9e6] active:scale-95 transition-all"
              >
                <span>{k.label}</span>
              </button>
            ))}
          </div>
          {msg && <div className="mt-3 text-xs font-vintage text-emerald-300">{msg}</div>}
        </div>
      );
    }

    // JEWELRY PUZZLE INNER
    function JewelryPuzzleInner({ isSolved, onSolve, onClose }) {
      const SYMBOLS = [
        { id: 'rose', name: 'Rosa', icon: '🌹' },
        { id: 'goblet', name: 'Cálice', icon: '🍷' },
        { id: 'raven', name: 'Corvo', icon: '🦅' },
        { id: 'skull', name: 'Crânio', icon: '💀' },
        { id: 'key', name: 'Chave', icon: '🗝️' },
      ];
      const [dials, setDials] = useState([2, 4, 1, 0]);
      const [msg, setMsg] = useState(null);

      const rotate = (idx) => {
        audioEngine.playClockTick();
        setDials(prev => {
          const next = [...prev];
          next[idx] = (next[idx] + 1) % SYMBOLS.length;
          return next;
        });
      };

      const handleVerify = () => {
        if (dials[0] === 0 && dials[1] === 1 && dials[2] === 2 && dials[3] === 3) {
          audioEngine.playLockUnlock();
          audioEngine.playPuzzleSolved();
          setMsg('As travas se soltaram com um clique suave!');
          setTimeout(onSolve, 1400);
        } else {
          audioEngine.playHeartbeat();
          setMsg('O mecanismo continuou travado.');
        }
      };

      return (
        <div className="relative w-full max-w-md rounded-xl border border-amber-950 bg-[#141018] p-6 shadow-2xl text-center">
          <div className="flex justify-between border-b border-amber-950 pb-2">
            <h3 className="font-gothic text-base font-bold text-amber-200">Caixa de Joias Mecânica</h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">✕</button>
          </div>
          <p className="font-vintage text-xs italic text-amber-200/90 my-3 leading-relaxed">
            "Primeiro a Rosa do voto, depois o Cálice de vinho, então o Corvo do presságio, e por fim o Crânio do descanso."
          </p>
          <div className="grid grid-cols-4 gap-2 my-4">
            {dials.map((sIdx, i) => (
              <button key={i} onClick={() => rotate(i)} className="flex flex-col items-center rounded border border-amber-900/50 bg-[#201824] p-2 hover:bg-[#2c2033]">
                <div className="text-2xl my-1">{SYMBOLS[sIdx].icon}</div>
                <span className="font-gothic text-[10px] text-amber-300">{SYMBOLS[sIdx].name}</span>
              </button>
            ))}
          </div>
          <button onClick={handleVerify} className="w-full rounded bg-amber-700 py-2.5 text-xs font-gothic font-bold text-amber-100 hover:bg-amber-600">
            Alinhar Segredo
          </button>
          {msg && <div className="mt-2 text-xs font-vintage text-amber-300">{msg}</div>}
        </div>
      );
    }

    // MIRROR PUZZLE INNER
    function MirrorPuzzleInner({ hasMoistCloth, isCleaned, onCleaned, onClose }) {
      const [cleaned, setCleaned] = useState(isCleaned);
      const [msg, setMsg] = useState(null);

      const handleClean = () => {
        if (!hasMoistCloth) {
          setMsg('A poeira está incrustada há décadas. Requer um lenço umedecido com solvente.');
          return;
        }
        setCleaned(true);
        audioEngine.playLockUnlock();
        setTimeout(() => {
          audioEngine.playHeartbeat();
          audioEngine.setTension(2);
          onCleaned();
        }, 800);
      };

      return (
        <div className="relative w-full max-w-sm rounded-xl border border-amber-950 bg-[#120e17] p-6 shadow-2xl text-center">
          <div className="flex justify-between border-b border-amber-950 pb-2">
            <h3 className="font-gothic text-base font-bold text-amber-200">Espelho da Penteadeira</h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">✕</button>
          </div>
          <div className="my-5 mx-auto h-60 w-48 rounded-[50%/40%] border-4 border-amber-900 bg-gradient-to-b from-[#1b1522] to-[#0c0911] flex flex-col items-center justify-center p-3 overflow-hidden shadow-inner">
            {!cleaned ? (
              <span className="font-vintage text-xs italic text-neutral-400">O espelho está opaco e coberto de poeira antiga.</span>
            ) : (
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-20 w-16 bg-neutral-900 rounded-t-full border border-neutral-700 flex items-center justify-center text-[10px] text-neutral-500">[SEM ROSTO]</div>
                <div className="mt-2 text-lg">🥀</div>
                <div className="text-red-400 font-gothic text-[11px] font-bold mt-2">"O relógio parou às 03:45"</div>
              </div>
            )}
          </div>
          {!cleaned ? (
            <button onClick={handleClean} className="w-full rounded bg-amber-700 py-2.5 text-xs font-gothic font-bold text-amber-100 hover:bg-amber-600">
              Limpar Espelho com Lenço Alquímico
            </button>
          ) : (
            <span className="font-vintage text-xs text-red-300">A visão da alma revelou o momento fatal: 03:45.</span>
          )}
          {msg && <div className="mt-2 text-xs font-vintage text-amber-300">{msg}</div>}
        </div>
      );
    }

    // CRYPT TOMB INNER (THE GRAND PLOT TWIST)
    function CryptTombInner({ hasWeddingRing, onEndingChosen, onClose }) {
      const [step, setStep] = useState('inspect');

      return (
        <div className="relative w-full max-w-lg rounded-xl border border-amber-900/60 bg-[#120d18] p-6 shadow-2xl text-center">
          <div className="flex justify-between border-b border-amber-950 pb-2">
            <h3 className="font-gothic text-base font-bold text-amber-200">Sarcófago dos Ravenwood</h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">✕</button>
          </div>
          {step === 'inspect' && (
            <div className="my-5">
              <p className="font-vintage text-sm leading-relaxed text-neutral-300">
                Uma cavidade no mármore central aguarda a aliança de promessa eterna.
              </p>
              {hasWeddingRing ? (
                <button
                  onClick={() => {
                    audioEngine.playLockUnlock();
                    audioEngine.playHeartbeat();
                    setTimeout(() => {
                      audioEngine.playPuzzleSolved();
                      setStep('reveal');
                    }, 800);
                  }}
                  className="mt-5 w-full rounded-xl bg-amber-700 py-3 text-xs font-gothic font-bold text-amber-100 hover:bg-amber-600"
                >
                  Depositar Aliança de Noivado
                </button>
              ) : (
                <div className="mt-4 font-vintage text-xs text-amber-500/80 italic">
                  Você precisa da aliança de ouro encontrada no piano.
                </div>
              )}
            </div>
          )}
          {step === 'reveal' && (
            <div className="my-5 space-y-4">
              <div className="border border-amber-500/80 bg-[#251833] p-4 rounded-xl">
                <div className="font-gothic text-xs uppercase tracking-widest text-amber-400">Inscrição de Bronze</div>
                <div className="font-gothic text-xl font-bold text-amber-100 mt-1">AQUI DESCANSA EM PAZ</div>
                <div className="font-gothic text-lg font-bold text-red-400">JULIAN RAVENWOOD</div>
                <div className="font-vintage text-xs text-neutral-400">1862 — 1892</div>
              </div>
              <p className="font-vintage text-xs leading-relaxed text-purple-200">
                O choque corta sua alma: <strong>você não é um invasor tentando salvar alguém... Você é Julian.</strong> Você faleceu há cem anos, e Eleonora sobreviveu chorando sua perda. Esta mansão é a prisão do seu próprio luto.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => onEndingChosen('REDEMPTION')} className="rounded-xl border border-amber-500/50 bg-[#241a33] p-3 text-center hover:bg-[#2e2142]">
                  <div className="font-gothic text-xs font-bold text-amber-200">Aceitar a Paz</div>
                  <span className="font-vintage text-[11px] text-neutral-400">Segurar a mão de Eleonora</span>
                </button>
                <button onClick={() => onEndingChosen('DENIAL')} className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-center hover:bg-neutral-800">
                  <div className="font-gothic text-xs font-bold text-neutral-300">Negar a Morte</div>
                  <span className="font-vintage text-[11px] text-neutral-400">Tentar forçar o portão</span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Render the React application
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlContent);
console.log('Successfully generated standalone index.html! File size:', Math.round(htmlContent.length / 1024), 'KB');
