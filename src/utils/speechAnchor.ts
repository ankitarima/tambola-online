import { TAMBOLA_DATA } from '../data/tambolaPhrases';

export type SpeechStyle = 'hinglish' | 'indian_english' | 'hindi_primary' | 'quick_number';

class IndianSpeechAnchor {
  public voiceEnabled: boolean = true;
  public speechRate: number = 0.95; // lively tambola pace
  public speechPitch: number = 1.05;
  public speechStyle: SpeechStyle = 'hinglish';
  public selectedVoiceURI: string = '';
  private voices: SpeechSynthesisVoice[] = [];
  private onVoicesLoadedCallbacks: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  public registerOnVoicesLoaded(cb: () => void) {
    this.onVoicesLoadedCallbacks.push(cb);
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    if (this.voices.length > 0) {
      this.onVoicesLoadedCallbacks.forEach((cb) => cb());
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public getIndianVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(
      (v) =>
        v.lang.includes('IN') ||
        v.lang.startsWith('hi') ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('rishi') ||
        v.name.toLowerCase().includes('veena') ||
        v.name.toLowerCase().includes('neerja') ||
        v.name.toLowerCase().includes('heera') ||
        v.name.toLowerCase().includes('lekha')
    );
  }

  private pickBestVoice(isHindiPreferred: boolean): SpeechSynthesisVoice | null {
    if (this.selectedVoiceURI) {
      const found = this.voices.find((v) => v.voiceURI === this.selectedVoiceURI);
      if (found) return found;
    }

    if (isHindiPreferred) {
      const hindiVoice = this.voices.find(
        (v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
      );
      if (hindiVoice) return hindiVoice;
    }

    // Try finding Indian English voice
    const indianEnglish = this.voices.find(
      (v) =>
        v.lang === 'en-IN' ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('rishi') ||
        v.name.toLowerCase().includes('neerja') ||
        v.name.toLowerCase().includes('heera')
    );
    if (indianEnglish) return indianEnglish;

    // Fallback to any Indian voice
    const anyIndian = this.voices.find((v) => v.lang.includes('IN'));
    if (anyIndian) return anyIndian;

    // Fallback to en-US or en-GB or default voice
    const generalEn = this.voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.default)
    );
    return generalEn || this.voices[0] || null;
  }

  /**
   * Builds the anchor announcement text.
   * Requirement: First speak the lines/rhymes, and in the last speak the number!
   */
  public buildCallText(num: number): { textToSpeak: string; isHindi: boolean } {
    const data = TAMBOLA_DATA[num] || {
      hindi: '',
      hindiName: '',
      nickname: '',
      tagline: '',
    };

    const digits = num < 10 ? `Single ${num}` : `${Math.floor(num / 10)} and ${num % 10}`;
    const primaryLine = data.tagline || data.nickname || `Next call`;

    switch (this.speechStyle) {
      case 'hindi_primary': {
        const text = `${data.nickname ? `${data.nickname}! ` : ''}${primaryLine}... और नंबर है: ${data.hindiName}! ${num}!`;
        return { textToSpeak: text, isHindi: true };
      }

      case 'quick_number': {
        const nick = data.nickname ? `${data.nickname}... ` : '';
        const text = `${nick}${digits}... Number ${num}!`;
        return { textToSpeak: text, isHindi: false };
      }

      case 'indian_english': {
        const text = `${primaryLine}! ... And the number is: ${digits}, Number ${num}!`;
        return { textToSpeak: text, isHindi: false };
      }

      case 'hinglish':
      default: {
        // High-energy Indian Tambola Party Anchor style: Lines first, number in the last!
        if (num === 7) {
          return {
            textToSpeak: `Satte pe satta! Saat sur, saat samundar, lucky seven! ... Aur number hai: Saat! Single number 7!`,
            isHindi: false,
          };
        }
        if (num === 22) {
          return {
            textToSpeak: `Two little ducks! Jodi number do, baais! ... Aur number hai: Two two, number 22!`,
            isHindi: false,
          };
        }
        if (num === 88) {
          return {
            textToSpeak: `Two fat ladies! Moti auntee, do moti auratein! ... Aur number hai: Atthaasi! Eight eight, number 88!`,
            isHindi: false,
          };
        }
        if (num === 90) {
          return {
            textToSpeak: `Top of the house! Baras gaya badal, last number of the board! ... Aur number hai: Nabbe! Number 90!`,
            isHindi: false,
          };
        }
        if (num === 1) {
          return {
            textToSpeak: `Son of a gun! Top of the world, son of a gun! ... Aur number hai: Ek! Single number 1!`,
            isHindi: false,
          };
        }
        if (num === 11) {
          return {
            textToSpeak: `Two beautiful legs! Dono khambe, gyaarah! ... Aur number hai: One one, number 11!`,
            isHindi: false,
          };
        }
        if (num === 16) {
          return {
            textToSpeak: `Solah baras ki bali umar, sweet sixteen! ... Aur number hai: Solah! One six, number 16!`,
            isHindi: false,
          };
        }
        if (num === 25) {
          return {
            textToSpeak: `Silver jubilee, quarter century! ... Aur number hai: Pachchees! Two five, number 25!`,
            isHindi: false,
          };
        }
        if (num === 40) {
          return {
            textToSpeak: `Ali Baba chaalees chor, life begins! ... Aur number hai: Chaalees! Four zero, number 40!`,
            isHindi: false,
          };
        }
        if (num === 50) {
          return {
            textToSpeak: `Golden jubilee, half century! ... Aur number hai: Pachaas! Five zero, number 50!`,
            isHindi: false,
          };
        }
        if (num === 69) {
          return {
            textToSpeak: `Ulta pulta! Any way up, ek seedha ek ulta! ... Aur number hai: Unhattar! Six nine, number 69!`,
            isHindi: false,
          };
        }
        if (num === 77) {
          return {
            textToSpeak: `Double hockey sticks! Do hockey! ... Aur number hai: Sat-hattar! Seven seven, number 77!`,
            isHindi: false,
          };
        }

        const hindiPart = data.hindi ? `${data.hindi}! ` : '';
        const text = `${primaryLine}! ... Aur number hai: ${hindiPart}${digits}, Number ${num}!`;
        return { textToSpeak: text, isHindi: false };
      }
    }
  }

  /**
   * Speaks the call text and triggers onEnd callback when speech finishes,
   * enabling the number to reveal precisely after the speech ends!
   */
  public speak(num: number, onEnd?: () => void) {
    // If voice disabled or unsupported, provide a quick 1.8s suspense delay so suspense UI still shines
    if (!this.voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) {
        setTimeout(onEnd, 1800);
      }
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const { textToSpeak, isHindi } = this.buildCallText(num);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    const voice = this.pickBestVoice(isHindi);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    }

    utterance.rate = this.speechRate;
    utterance.pitch = this.speechPitch;

    let hasEnded = false;
    let safetyTimer: ReturnType<typeof setTimeout> | null = null;

    const triggerEnd = () => {
      if (!hasEnded) {
        hasEnded = true;
        if (safetyTimer) clearTimeout(safetyTimer);
        if (onEnd) onEnd();
      }
    };

    utterance.onend = triggerEnd;
    utterance.onerror = triggerEnd;

    // Safety fallback: in case browser drops onend event, trigger reveal
    const wordCount = textToSpeak.split(/\s+/).length;
    const estimatedSeconds = Math.max(3.2, wordCount / (2.2 * this.speechRate) + 1.2);
    safetyTimer = setTimeout(() => {
      triggerEnd();
    }, estimatedSeconds * 1000);

    window.speechSynthesis.speak(utterance);
  }

  public speakCustom(text: string, lang: string = 'en-IN') {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.pickBestVoice(lang.startsWith('hi'));
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = this.speechRate;
    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechAnchor = new IndianSpeechAnchor();
