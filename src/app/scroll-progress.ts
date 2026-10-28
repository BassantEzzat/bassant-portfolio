import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-scroll-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="sp-btn"
      aria-label="Back to top"
      (click)="toTop()"
    >
      <svg class="sp-ring" viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="sp-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="var(--acc)" />
            <stop offset="100%" stop-color="var(--acc2)" />
          </linearGradient>
        </defs>
        <circle class="sp-track" cx="24" cy="24" r="20" />
        <circle class="sp-prog" cx="24" cy="24" r="20" />
      </svg>
      <svg class="sp-arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  `,
  styles: `
    :host {
      position: fixed;
      right: 22px;
      bottom: 22px;
      z-index: 50;
      pointer-events: none;
      --p: 0;
    }

    .sp-btn {
      position: relative;
      width: 52px;
      height: 52px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      cursor: pointer;
      color: var(--ink);
      background: color-mix(in srgb, var(--bg) 70%, transparent);
      -webkit-backdrop-filter: blur(12px) saturate(150%);
      backdrop-filter: blur(12px) saturate(150%);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      opacity: 0;
      transform: translateY(14px) scale(0.85);
      pointer-events: none;
      transition:
        opacity 0.3s ease,
        transform 0.3s ease,
        box-shadow 0.3s ease;
    }

    :host([data-show='true']) .sp-btn {
      opacity: 1;
      transform: none;
      pointer-events: auto;
    }

    .sp-btn:hover {
      transform: translateY(-3px);
      box-shadow:
        0 12px 28px rgba(0, 0, 0, 0.3),
        0 0 18px color-mix(in srgb, var(--acc) 45%, transparent);
    }

    .sp-btn:focus-visible {
      outline: 2px solid var(--acc);
      outline-offset: 3px;
    }

    .sp-ring {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .sp-track,
    .sp-prog {
      fill: none;
      stroke-width: 3;
    }

    .sp-track {
      stroke: color-mix(in srgb, var(--ink) 14%, transparent);
    }

    .sp-prog {
      stroke: url(#sp-grad);
      stroke-linecap: round;
      stroke-dasharray: 125.66;
      stroke-dashoffset: calc(125.66 * (1 - var(--p)));
    }

    .sp-arrow {
      position: absolute;
      inset: 0;
      margin: auto;
      width: 20px;
      height: 20px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform 0.25s ease;
    }

    .sp-btn:hover .sp-arrow {
      transform: translateY(-2px);
    }

    @media (max-width: 820px) {
      :host {
        right: 14px;
        bottom: 14px;
      }
      .sp-btn {
        width: 46px;
        height: 46px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .sp-btn,
      .sp-arrow {
        transition: none;
      }
    }
  `,
})
export class ScrollProgress implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly zone = inject(NgZone);
  private raf = 0;

  constructor() {
    afterNextRender(() =>
      this.zone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onScroll, { passive: true });
        this.update();
      }),
    );
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  }

  toTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  private onScroll = () => {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.update();
    });
  };

  private update() {
    const el = document.documentElement;
    const max = el.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    this.host.style.setProperty('--p', p.toFixed(4));
    this.host.setAttribute('data-show', String(window.scrollY > 320));
  }
}