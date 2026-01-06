// Audio has been removed — this file now provides no-op methods so components can still call
// `audioService.*` without changes. This avoids touching many files across the app.

class NoopAudioService {
  public playHover() { /* no-op */ }
  public playClick() { /* no-op */ }
  public playStartup() { /* no-op */ }
  public playScreech() { /* no-op */ }
  public unlock() { /* no-op */ }
}

export const audioService = new NoopAudioService();