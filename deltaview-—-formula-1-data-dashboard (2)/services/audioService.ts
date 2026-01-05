class AudioService {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isUnlocked = false;

  private readonly SOUNDS = {
    HOVER: 'minimalist-button-hover-sound-effect-399749 (1).mp3',
    CLICK: 'ui-mouse-click-366460.mp3',
    STARTUP: 'startup-sound-variation-fast-315898.mp3',
    SCREECH: 'rubber-tire-screech-1-202530.mp3',
  };

  constructor() {
    console.debug('Initializing AudioService...');
    this.preload();
  }

  private preload() {
    Object.entries(this.SOUNDS).forEach(([key, fileName]) => {
      try {
        // Use encodeURI to safely handle spaces and parentheses in filenames
        const audio = new Audio(encodeURI(fileName));
        audio.load();
        this.sounds.set(fileName, audio);
        console.debug(`Preloaded ${key}: ${fileName}`);
      } catch (err) {
        console.error(`Failed to preload ${fileName}:`, err);
      }
    });
  }

  public play(fileName: string, volume = 0.5) {
    // If the browser hasn't allowed audio yet, we can't play
    if (!this.isUnlocked && fileName !== this.SOUNDS.STARTUP) {
      console.debug('Audio play blocked: Context not unlocked yet.');
      return;
    }

    const audio = this.sounds.get(fileName);
    if (audio) {
      try {
        const soundToPlay = audio.cloneNode() as HTMLAudioElement;
        soundToPlay.volume = volume;
        soundToPlay.play().catch(e => {
          console.debug(`Audio play interrupted or blocked for ${fileName}:`, e.message);
        });
      } catch (err) {
        console.error(`Playback error for ${fileName}:`, err);
      }
    } else {
      // Fallback for non-preloaded or dynamically requested files
      const fallback = new Audio(encodeURI(fileName));
      fallback.volume = volume;
      fallback.play().catch(() => {});
    }
  }

  public playHover() { this.play(this.SOUNDS.HOVER, 0.3); }
  public playClick() { this.play(this.SOUNDS.CLICK, 0.6); }
  public playStartup() { this.play(this.SOUNDS.STARTUP, 0.5); }
  public playScreech() { this.play(this.SOUNDS.SCREECH, 0.4); }

  public unlock() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;
    console.debug('Audio context unlocked via user interaction.');
    
    // Play a tiny silent buffer to enable audio on some browsers
    const silent = new Audio();
    silent.volume = 0;
    silent.play().catch(() => {});
  }
}

export const audioService = new AudioService();