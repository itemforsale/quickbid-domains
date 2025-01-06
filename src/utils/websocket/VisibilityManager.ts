export class VisibilityManager {
  private callbacks: (() => void)[] = [];

  constructor() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      this.callbacks.forEach(callback => callback());
    }
  }

  onVisible(callback: () => void): void {
    this.callbacks.push(callback);
  }

  cleanup(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    this.callbacks = [];
  }
}