import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';

type RGB = [number, number, number];

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bvx: number;
  bvy: number;
  r: number;
}

@Component({
  selector: 'app-backdrop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="aurora" aria-hidden="true">
      <i class="b b1"></i><i class="b b2"></i><i class="b b3"></i>
    </div>
    <div class="dots" aria-hidden="true"></div>
    <div class="glow" aria-hidden="true"></div>
    <canvas #cv aria-hidden="true"></canvas>
    <div class="grain" aria-hidden="true"></div>
    <div class="vignette" aria-hidden="true"></div>
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
      --mx: -999px;
      --my: -999px;
      --o: 0.11;
    }
    :host([data-mode='light']) {
      --o: 0.34;
    }

    .aurora,
    .dots,
    .glow,
    .grain,
    .vignette,
    canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    /* ---------- aurora blobs ---------- */
    .b {
      position: absolute;
      border-radius: 50%;
      opacity: var(--o);
      will-change: transform;
    }
    .b1 {
      width: 60vmax;
      height: 60vmax;
      left: -20vmax;
      top: -25vmax;
      background: radial-gradient(circle, var(--acc) 0%, transparent 62%);
      animation: d1 40s ease-in-out infinite alternate;
    }
    .b2 {
      width: 55vmax;
      height: 55vmax;
      right: -22vmax;
      top: 15vh;
      background: radial-gradient(circle, var(--acc2) 0%, transparent 62%);
      animation: d2 46s ease-in-out infinite alternate;
    }
    .b3 {
      width: 50vmax;
      height: 50vmax;
      left: 20vw;
      bottom: -30vmax;
      background: radial-gradient(circle, var(--acc) 0%, transparent 62%);
      animation: d3 52s ease-in-out infinite alternate;
    }
    @keyframes d1 {
      to {
        transform: translate(10vmax, 7vmax) scale(1.1);
      }
    }
    @keyframes d2 {
      to {
        transform: translate(-9vmax, 10vmax) scale(0.93);
      }
    }
    @keyframes d3 {
      to {
        transform: translate(7vmax, -9vmax) scale(1.12);
      }
    }

    /* ---------- soft dot grid (light mode only) ---------- */
    .dots {
      opacity: 0;
      background-image: radial-gradient(
        color-mix(in srgb, var(--ink) 26%, transparent) 1px,
        transparent 1.5px
      );
      background-size: 28px 28px;
      -webkit-mask-image: radial-gradient(ellipse 90% 75% at 50% 35%, #000, transparent);
      mask-image: radial-gradient(ellipse 90% 75% at 50% 35%, #000, transparent);
      transition: opacity 0.4s ease;
    }
    :host([data-mode='light']) .dots {
      opacity: 1;
    }

    /* ---------- cursor glow ---------- */
    .glow {
      background: radial-gradient(
        420px circle at var(--mx) var(--my),
        color-mix(in srgb, var(--acc) 7%, transparent),
        transparent 70%
      );
    }
    :host([data-mode='light']) .glow {
      background: radial-gradient(
        420px circle at var(--mx) var(--my),
        color-mix(in srgb, var(--acc) 20%, transparent),
        transparent 70%
      );
    }

    /* ---------- grain + vignette ---------- */
    .grain {
      opacity: 0.03;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    }
    :host([data-mode='light']) .grain {
      opacity: 0.07;
      mix-blend-mode: multiply;
    }
    .vignette {
      background: radial-gradient(
        ellipse at center,
        transparent 60%,
        color-mix(in srgb, var(--bg) 70%, transparent) 100%
      );
    }

    @media (prefers-reduced-motion: reduce) {
      .b {
        animation: none;
      }
    }
  `,
})
export class Backdrop implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly zone = inject(NgZone);
  private readonly cv = viewChild.required<ElementRef<HTMLCanvasElement>>('cv');

  private ctx!: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private pts: Dot[] = [];
  private raf = 0;
  private rgb: RGB = [202, 170, 152];
  private dark = true;
  private mx = -9999;
  private my = -9999;
  private tx = -9999;
  private ty = -9999;
  private mo?: MutationObserver;
  private readonly reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => this.start()));
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
    this.mo?.disconnect();
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  /* ---------- setup ---------- */
  private start() {
    const ctx = this.cv().nativeElement.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;

    this.readTheme();
    this.mo = new MutationObserver(() => {
      this.readTheme();
      if (this.reduce) this.frame();
    });
    this.mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    this.resize();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onMove, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);

    if (this.reduce) this.frame();
    else this.loop();
  }

  private readTheme() {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const attr = root.getAttribute('data-theme');
    this.dark = attr ? attr === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;

    // dark: soft accent particles. light: dark ink particles so they stay visible on cream.
    const token = this.dark ? '--acc' : '--ink';
    this.rgb = this.parse(cs.getPropertyValue(token).trim()) ?? this.rgb;
    this.host.setAttribute('data-mode', this.dark ? 'dark' : 'light');
  }

  private parse(hex: string): RGB | null {
    const m = hex.replace('#', '');
    if (m.length === 3) {
      return [0, 1, 2].map((i) => parseInt(m[i] + m[i], 16)) as RGB;
    }
    if (m.length === 6) {
      return [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16)) as RGB;
    }
    return null;
  }

  /* ---------- events ---------- */
  private onResize = () => {
    this.resize();
    if (this.reduce) this.frame();
  };

  private onMove = (e: PointerEvent) => {
    if (this.tx < -1000) {
      this.mx = e.clientX;
      this.my = e.clientY;
    }
    this.tx = e.clientX;
    this.ty = e.clientY;
    if (this.reduce) this.frame();
  };

  private onVisibility = () => {
    if (document.hidden) cancelAnimationFrame(this.raf);
    else if (!this.reduce) this.loop();
  };

  /* ---------- canvas ---------- */
  private resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const c = this.cv().nativeElement;
    c.width = Math.round(this.w * this.dpr);
    c.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const density = this.w < 700 ? 42000 : 30000;
    const n = Math.max(14, Math.min(45, Math.round((this.w * this.h) / density)));
    while (this.pts.length < n) this.pts.push(this.make());
    this.pts.length = n;
  }

  private make(): Dot {
    const bvx = (Math.random() - 0.5) * 0.22;
    const bvy = (Math.random() - 0.5) * 0.22;
    return {
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: bvx,
      vy: bvy,
      bvx,
      bvy,
      r: 0.9 + Math.random() * 1.1,
    };
  }

  private loop() {
    cancelAnimationFrame(this.raf);
    const tick = () => {
      this.frame();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private frame() {
    const { ctx, w, h, pts } = this;
    const [r, g, b] = this.rgb;

    // smooth cursor follow (drives the soft glow through CSS vars)
    if (this.reduce) {
      this.mx = this.tx;
      this.my = this.ty;
    } else {
      this.mx += (this.tx - this.mx) * 0.1;
      this.my += (this.ty - this.my) * 0.1;
    }
    this.host.style.setProperty('--mx', `${this.mx}px`);
    this.host.style.setProperty('--my', `${this.my}px`);

    ctx.clearRect(0, 0, w, h);

    const LINK = 120;
    const MOUSE = 140;
    const lineAlpha = this.dark ? 0.1 : 0.2;
    const dotAlpha = this.dark ? 0.4 : 0.5;
    const mouseOn = this.mx > -1000;

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];

      if (!this.reduce) {
        // gentle repel from cursor
        const dx = p.x - this.mx;
        const dy = p.y - this.my;
        const d2 = dx * dx + dy * dy;
        if (mouseOn && d2 < 110 * 110 && d2 > 1) {
          const d = Math.sqrt(d2);
          p.vx += (dx / d) * 0.03;
          p.vy += (dy / d) * 0.03;
        }
        // ease back to natural drift
        p.vx += (p.bvx - p.vx) * 0.02;
        p.vy += (p.bvy - p.vy) * 0.02;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;
      }

      // links between particles
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          const a = (1 - Math.sqrt(d2) / LINK) * lineAlpha;
          ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      // links to cursor
      if (mouseOn) {
        const dx = p.x - this.mx;
        const dy = p.y - this.my;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE * MOUSE) {
          const a = (1 - Math.sqrt(d2) / MOUSE) * (lineAlpha + 0.08);
          ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(this.mx, this.my);
          ctx.stroke();
        }
      }

      // dot
      ctx.fillStyle = `rgba(${r},${g},${b},${dotAlpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}