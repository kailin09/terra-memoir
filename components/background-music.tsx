'use client';

import { useEffect, useRef, useState } from 'react';
import { Music2, Pause, Play, Volume2, VolumeX } from 'lucide-react';

type AudioEngine = {
  context: AudioContext;
  master: GainNode;
  timer: number;
  chordTimer: number;
};

const chordProgression = [
  [261.63, 329.63, 392, 523.25],
  [220, 261.63, 329.63, 440],
  [174.61, 220, 261.63, 349.23],
  [196, 246.94, 293.66, 392],
];

const melody = [523.25, 587.33, 659.25, 587.33, 493.88, 523.25, 392, 440];

function startAmbientMusic(): AudioEngine {
  const context = new AudioContext();
  const master = context.createGain();
  const lowPass = context.createBiquadFilter();
  const compressor = context.createDynamicsCompressor();

  master.gain.value = 0.48;
  lowPass.type = 'lowpass';
  lowPass.frequency.value = 1500;
  compressor.threshold.value = -24;
  compressor.ratio.value = 3;
  master.connect(lowPass);
  lowPass.connect(compressor);
  compressor.connect(context.destination);

  let chordIndex = 0;
  let melodyIndex = 0;

  const playChord = () => {
    const now = context.currentTime;
    const notes = chordProgression[chordIndex % chordProgression.length];
    chordIndex += 1;

    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(index === 0 ? 0.012 : 0.008, now + 1.8);
      gain.gain.setValueAtTime(index === 0 ? 0.012 : 0.008, now + 5.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 7.8);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(now);
      oscillator.stop(now + 8);
    });
  };

  const playNote = () => {
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = melody[melodyIndex % melody.length];
    melodyIndex += 1;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.026, now + 0.11);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(now);
    oscillator.stop(now + 2.25);
  };

  playChord();
  const chordTimer = window.setInterval(playChord, 8000);
  const timer = window.setInterval(playNote, 2400);
  return { context, master, timer, chordTimer };
}

export default function BackgroundMusic() {
  const engine = useRef<AudioEngine | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(35);

  useEffect(() => () => {
    if (engine.current) {
      window.clearInterval(engine.current.timer);
      window.clearInterval(engine.current.chordTimer);
      void engine.current.context.close();
      engine.current = null;
    }
  }, []);

  const toggleMusic = async () => {
    if (engine.current) {
      window.clearInterval(engine.current.timer);
      window.clearInterval(engine.current.chordTimer);
      await engine.current.context.close();
      engine.current = null;
      setPlaying(false);
      return;
    }

    try {
      const nextEngine = startAmbientMusic();
      nextEngine.master.gain.value = volume / 100;
      await nextEngine.context.resume();
      engine.current = nextEngine;
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const updateVolume = (value: number) => {
    setVolume(value);
    if (engine.current) engine.current.master.gain.value = value / 100;
  };

  return (
    <aside className="bgm-control" aria-label="背景音乐控制">
      <button
        className={`bgm-toggle${playing ? ' is-playing' : ''}`}
        type="button"
        onClick={() => void toggleMusic()}
        aria-label={playing ? '暂停背景音乐' : '播放背景音乐'}
        aria-pressed={playing}
      >
        {playing ? <Pause size={15} /> : <Play size={15} />}
        <Music2 size={15} />
        <span>{playing ? '正在播放' : '聆听氛围音乐'}</span>
      </button>
      <label className="bgm-volume" title="音乐音量">
        {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
        <span className="a11y-only">背景音乐音量</span>
        <input
          type="range"
          min="0"
          max="70"
          value={volume}
          onChange={(event) => updateVolume(Number(event.target.value))}
          aria-label="背景音乐音量"
        />
      </label>
    </aside>
  );
}
