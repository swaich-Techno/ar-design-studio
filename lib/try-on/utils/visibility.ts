/** Hold last pose, then fade, then hide. Reacquire lerps opacity back in. */
export class TrackVisibility {
  lastSeen = 0;
  opacity = 0;
  holding = false;

  update(detected: boolean, now: number) {
    if (detected) {
      this.lastSeen = now;
      this.holding = false;
      this.opacity = this.opacity <= 0.01 ? 0.35 : Math.min(1, this.opacity + 0.18);
      return this.opacity;
    }
    const dt = now - this.lastSeen;
    if (this.lastSeen === 0) {
      this.opacity = 0;
      this.holding = false;
      return 0;
    }
    if (dt <= 150) {
      this.holding = true;
      return this.opacity;
    }
    if (dt <= 500) {
      this.holding = false;
      this.opacity = Math.max(0, 1 - (dt - 150) / 350);
      return this.opacity;
    }
    this.holding = false;
    this.opacity = 0;
    return 0;
  }

  reset() {
    this.lastSeen = 0;
    this.opacity = 0;
    this.holding = false;
  }
}
