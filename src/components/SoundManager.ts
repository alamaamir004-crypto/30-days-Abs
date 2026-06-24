export class SoundManager {
  private static audioCtx: AudioContext | null = null;
  private static humOsc: OscillatorNode | null = null;
  private static humLfo: OscillatorNode | null = null;
  private static humGain: GainNode | null = null;
  private static humFilter: BiquadFilterNode | null = null;
  private static humVocalFilter: BiquadFilterNode | null = null;
  private static humInterval: any = null;

  private static initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public static playTone(freq: number, type: OscillatorType, durationSeconds: number) {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + durationSeconds);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + durationSeconds);
    } catch (e) {
      console.warn('Audio Tone playback blocked or not supported', e);
    }
  }

  public static playBeep() {
    this.playTone(880, 'sine', 0.1);
  }

  public static playCountdownBeep() {
    this.playTone(440, 'sine', 0.15);
  }

  public static playGong() {
    this.playTone(523.25, 'triangle', 0.8); // C5
    setTimeout(() => {
      this.playTone(659.25, 'triangle', 0.8); // E5
    }, 150);
  }

  public static playSuccess() {
    const tones = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    tones.forEach((t, i) => {
      setTimeout(() => {
        this.playTone(t, 'sine', 0.4);
      }, i * 150);
    });
  }

  public static speak(text: string, voiceEnabled: boolean = true) {
    if (!voiceEnabled) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop active speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis blocked or not supported', e);
    }
  }

  public static startHum(style: 'zen' | 'rhythmic' | 'vibe', volume: number = 0.5) {
    try {
      this.stopHum();
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const lfo = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      const gainNode = this.audioCtx.createGain();
      const lpFilter = this.audioCtx.createBiquadFilter();
      const formantFilter = this.audioCtx.createBiquadFilter();

      // Set base pitch to simulate human chest-voice humming (deep resonance)
      let baseFreq = 110; // A2 (deep human hum)
      if (style === 'vibe') baseFreq = 120.00;
      if (style === 'rhythmic') baseFreq = 95.00;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);

      // Vibrato simulation (5.8Hz frequency shift) for natural-sounding human vocalization
      lfo.frequency.value = 5.8;
      lfoGain.gain.value = 1.3;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // Filter settings to simulate vocal throat-tract humming (nasal formant "mmmmm")
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(260, this.audioCtx.currentTime);
      lpFilter.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

      formantFilter.type = 'bandpass';
      formantFilter.frequency.setValueAtTime(180, this.audioCtx.currentTime);
      formantFilter.Q.setValueAtTime(3.0, this.audioCtx.currentTime);

      osc.connect(lpFilter);
      lpFilter.connect(formantFilter);
      formantFilter.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.18, this.audioCtx.currentTime + 0.6);

      if (style === 'rhythmic') {
        let isExhale = false;
        const breathingInterval = setInterval(() => {
          if (!this.audioCtx || !this.humOsc) return;
          const now = this.audioCtx.currentTime;
          if (isExhale) {
            osc.frequency.exponentialRampToValueAtTime(95.00, now + 1.8);
            gainNode.gain.linearRampToValueAtTime(volume * 0.22, now + 1.0);
            gainNode.gain.linearRampToValueAtTime(volume * 0.04, now + 1.8);
          } else {
            osc.frequency.exponentialRampToValueAtTime(115.00, now + 1.8);
            gainNode.gain.linearRampToValueAtTime(volume * 0.10, now + 1.0);
            gainNode.gain.linearRampToValueAtTime(volume * 0.03, now + 1.8);
          }
          isExhale = !isExhale;
        }, 2000);
        this.humInterval = breathingInterval;
      } else if (style === 'zen') {
        let active = true;
        const swellInterval = setInterval(() => {
          if (!this.audioCtx || !this.humOsc) return;
          const now = this.audioCtx.currentTime;
          if (active) {
            gainNode.gain.linearRampToValueAtTime(volume * 0.20, now + 2.3);
          } else {
            gainNode.gain.linearRampToValueAtTime(volume * 0.06, now + 2.3);
          }
          active = !active;
        }, 2500);
        this.humInterval = swellInterval;
      } else if (style === 'vibe') {
        const pulseInterval = setInterval(() => {
          if (!this.audioCtx || !this.humOsc) return;
          const now = this.audioCtx.currentTime;
          gainNode.gain.setValueAtTime(volume * 0.06, now);
          gainNode.gain.exponentialRampToValueAtTime(volume * 0.24, now + 0.25);
          gainNode.gain.exponentialRampToValueAtTime(volume * 0.06, now + 0.85);
        }, 1000);
        this.humInterval = pulseInterval;
      }

      osc.start();
      lfo.start();

      this.humOsc = osc;
      this.humLfo = lfo;
      this.humGain = gainNode;
      this.humFilter = lpFilter;
      this.humVocalFilter = formantFilter;
    } catch (e) {
      console.warn('Failed to start hum synthesizer', e);
    }
  }

  public static stopHum() {
    try {
      if (this.humInterval) {
        clearInterval(this.humInterval);
        this.humInterval = null;
      }
      if (this.humOsc) {
        try { this.humOsc.stop(); } catch (e) {}
        this.humOsc.disconnect();
        this.humOsc = null;
      }
      if (this.humLfo) {
        try { this.humLfo.stop(); } catch (e) {}
        this.humLfo.disconnect();
        this.humLfo = null;
      }
      if (this.humGain) {
        this.humGain.disconnect();
        this.humGain = null;
      }
      if (this.humFilter) {
        this.humFilter.disconnect();
        this.humFilter = null;
      }
      if (this.humVocalFilter) {
        this.humVocalFilter.disconnect();
        this.humVocalFilter = null;
      }
    } catch (e) {
      console.warn('Failed to stop hum synthesizer', e);
    }
  }
}
