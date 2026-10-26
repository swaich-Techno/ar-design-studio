/** One Euro filter — low jitter at rest, responsive when moving. */
export class OneEuroFilter {
  private x: number | null = null;
  private dx = 0;
  private lastTime: number | null = null;

  constructor(
    private minCutoff = 1,
    private beta = 0.007,
    private dCutoff = 1,
  ) {}

  filter(value: number, timestamp: number) {
    if (this.x === null || this.lastTime === null) {
      this.x = value;
      this.lastTime = timestamp;
      return value;
    }
    const dt = Math.max((timestamp - this.lastTime) / 1000, 1e-4);
    const edx = (value - this.x) / dt;
    this.dx = this.lowpass(edx, this.dx, this.alpha(dt, this.dCutoff));
    const cutoff = this.minCutoff + this.beta * Math.abs(this.dx);
    this.x = this.lowpass(value, this.x, this.alpha(dt, cutoff));
    this.lastTime = timestamp;
    return this.x;
  }

  reset() {
    this.x = null;
    this.dx = 0;
    this.lastTime = null;
  }

  private alpha(dt: number, cutoff: number) {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / dt);
  }

  private lowpass(value: number, last: number, a: number) {
    return a * value + (1 - a) * last;
  }
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function expSmooth(current: number, target: number, dt: number, halflife = 0.08) {
  const t = 1 - Math.pow(2, -dt / Math.max(halflife, 1e-4));
  return lerp(current, target, t);
}

export class PoseSmoother {
  x = new OneEuroFilter(1.15, 0.018);
  y = new OneEuroFilter(1.15, 0.018);
  z = new OneEuroFilter(1.0, 0.012);
  yaw = new OneEuroFilter(1.4, 0.03);
  pitch = new OneEuroFilter(1.4, 0.03);
  roll = new OneEuroFilter(1.4, 0.03);
  scale = new OneEuroFilter(0.9, 0.01);

  reset() {
    this.x.reset();
    this.y.reset();
    this.z.reset();
    this.yaw.reset();
    this.pitch.reset();
    this.roll.reset();
    this.scale.reset();
  }
}

export class EarPairSmoother {
  left = new PoseSmoother();
  right = new PoseSmoother();
  pose = new PoseSmoother();
  pixels = new OneEuroFilter(0.85, 0.008);

  reset() {
    this.left.reset();
    this.right.reset();
    this.pose.reset();
    this.pixels.reset();
  }
}

export class SingleAnchorSmoother {
  point = new PoseSmoother();
  pose = new PoseSmoother();
  pixels = new OneEuroFilter(0.9, 0.01);
  bx = new PoseSmoother();
  by = new PoseSmoother();
  bz = new PoseSmoother();

  reset() {
    this.point.reset();
    this.pose.reset();
    this.pixels.reset();
    this.bx.reset();
    this.by.reset();
    this.bz.reset();
  }
}
