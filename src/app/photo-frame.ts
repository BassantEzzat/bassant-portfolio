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
  selector: 'app-photo-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pf2-stage">
      <div class="pf2-dots" aria-hidden="true"></div>

      <div class="pf2-wrap">
        <figure class="pf2-photo">
          <img
            src="bassant.jpg"
            alt="Bassant Ezzat Farhat"
            width="400"
            height="500"
            fetchpriority="high"
            decoding="async"
          />
        </figure>
      </div>

      <div class="pf2-status"><i class="pf2-live"></i>Open to work</div>
      <div class="pf2-tag"><i class="pf2-tdot"></i>Angular 21</div>

      <div class="pf2-code" aria-hidden="true">
        <div class="pf2-bar">
          <i></i><i></i><i></i>
          <span>bassant.ts</span>
        </div>
                <div class="pf2-lines">
          <div class="ln" style="--i: 0">
            <span class="k">const</span>&nbsp;<span class="p">bassant</span>&nbsp;<span class="m">=</span>&nbsp;<span class="m">&#123;</span>
          </div>
          <div class="ln in" style="--i: 1">
            <span class="p">role</span><span class="m">:</span>&nbsp;<span class="s">'Frontend Dev'</span><span class="m">,</span>
          </div>
          <div class="ln in" style="--i: 2">
            <span class="p">stack</span><span class="m">:</span>&nbsp;<span class="m">[</span><span class="s">'Angular'</span><span class="m">,</span>&nbsp;<span class="s">'TS'</span><span class="m">],</span>
          </div>
          <div class="ln in" style="--i: 3">
            <span class="p">openToWork</span><span class="m">:</span>&nbsp;<span class="k">true</span><span class="m">,</span>
          </div>
          <div class="ln" style="--i: 4">
            <span class="m">&#125;;</span><span class="pf2-cur"></span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      max-width: 420px;
      justify-self: end;
      --tx: 0;
      --ty: 0;
    }

    .pf2-stage {
      position: relative;
      padding: 24px 22px 48px 44px;
      animation: pf2-in 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s backwards;
    }

    /* ---------- dotted pattern behind the photo ---------- */
    .pf2-dots {
      position: absolute;
      right: 0;
      bottom: 22px;
      width: 58%;
      height: 46%;
      background-image: radial-gradient(var(--acc) 1.6px, transparent 1.9px);
      background-size: 15px 15px;
      opacity: 0.55;
      border-radius: 12px;
    }

    /* ---------- photo with gradient border ---------- */
    .pf2-wrap {
      position: relative;
      padding: 3px;
      border-radius: 32px;
      background: linear-gradient(145deg, var(--acc), var(--acc2) 55%, var(--acc));
      box-shadow: 0 34px 60px -26px rgba(0, 0, 0, 0.6);
      translate: calc(var(--tx) * -8px) calc(var(--ty) * -6px);
      transition: translate 0.35s ease-out;
    }

    .pf2-photo {
      margin: 0;
      aspect-ratio: 4 / 5;
      overflow: hidden;
      border-radius: 29px;
      background: var(--card);
    }

    .pf2-photo img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
      transition: transform 0.6s ease;
    }

    .pf2-wrap:hover .pf2-photo img {
      transform: scale(1.04);
    }

    /* ---------- glass pills ---------- */
    .pf2-status,
    .pf2-tag {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      font: 400 12px/1 var(--m);
      color: var(--ink);
      white-space: nowrap;
      background: color-mix(in srgb, var(--bg) 62%, transparent);
      -webkit-backdrop-filter: blur(12px) saturate(160%);
      backdrop-filter: blur(12px) saturate(160%);
      border: 1px solid color-mix(in srgb, var(--ink) 16%, transparent);
      box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25);
    }

    .pf2-status {
      top: 6px;
      right: 0;
      translate: calc(var(--tx) * 14px) calc(var(--ty) * 10px);
      transition: translate 0.3s ease-out;
    }

    .pf2-tag {
      right: -2px;
      top: 46%;
      translate: calc(var(--tx) * 30px) calc(var(--ty) * 20px);
      transition: translate 0.3s ease-out;
      animation: pf2-float 6s ease-in-out infinite;
    }

    .pf2-tdot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--acc);
    }

    .pf2-live {
      position: relative;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #3ddc84;
    }
    .pf2-live::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #3ddc84;
      animation: pf2-pulse 2s ease-out infinite;
    }

    /* ---------- floating code card ---------- */
    .pf2-code {
      position: absolute;
      left: 0;
      bottom: 14px;
      width: 262px;
      border-radius: 16px;
      overflow: hidden;
      background: rgba(20, 18, 15, 0.9);
      -webkit-backdrop-filter: blur(14px);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.6);
      translate: calc(var(--tx) * -22px) calc(var(--ty) * -14px);
      transition: translate 0.3s ease-out;
      animation: pf2-float 7s ease-in-out -2s infinite;
    }

    .pf2-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 9px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .pf2-bar i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #5a554d;
    }
    .pf2-bar i:nth-child(1) {
      background: #ff5f57;
    }
    .pf2-bar i:nth-child(2) {
      background: #febc2e;
    }
    .pf2-bar i:nth-child(3) {
      background: #28c840;
    }
    .pf2-bar span {
      margin-left: 8px;
      font: 400 11px/1 var(--m);
      color: #a1998b;
    }

    .pf2-lines {
      padding: 12px 14px 14px;
      font: 400 12px/1.75 var(--m);
      color: #efe9de;
      white-space: nowrap;
    }

    .ln {
      opacity: 0;
      animation: pf2-line 0.5s ease both;
      animation-delay: calc(0.9s + var(--i) * 0.28s);
    }
    .ln.in {
      padding-left: 16px;
    }

    .k {
      color: var(--acc);
    }
    .p {
      color: #efe9de;
    }
    .s {
      color: var(--acc2);
    }
    .m {
      color: #a1998b;
    }

    .pf2-cur {
      display: inline-block;
      width: 7px;
      height: 14px;
      margin-left: 4px;
      vertical-align: text-bottom;
      background: var(--acc);
      animation: pf2-blink 1s steps(1) infinite;
    }

    /* ---------- keyframes ---------- */
    @keyframes pf2-in {
      from {
        opacity: 0;
        transform: translateY(26px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    @keyframes pf2-line {
      from {
        opacity: 0;
        transform: translateX(-8px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    @keyframes pf2-float {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }
    @keyframes pf2-blink {
      50% {
        opacity: 0;
      }
    }
    @keyframes pf2-pulse {
      0% {
        transform: scale(1);
        opacity: 0.6;
      }
      100% {
        transform: scale(2.8);
        opacity: 0;
      }
    }

    /* ---------- responsive ---------- */
    @media (max-width: 820px) {
      :host {
        justify-self: center;
        max-width: 360px;
      }
      .pf2-stage {
        padding: 22px 16px 46px 30px;
      }
      .pf2-code {
        width: 226px;
      }
      .pf2-lines {
        font-size: 11px;
      }
      .pf2-status,
      .pf2-tag {
        font-size: 11px;
        padding: 7px 12px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .pf2-stage,
      .pf2-tag,
      .pf2-code,
      .pf2-live::after,
      .pf2-cur {
        animation: none;
      }
      .ln {
        animation: none;
        opacity: 1;
      }
      .pf2-wrap,
      .pf2-status,
      .pf2-tag,
      .pf2-code {
        transition: none;
      }
    }
  `,
})
export class PhotoFrame implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly zone = inject(NgZone);
  private raf = 0;
  private x = 0;
  private y = 0;
  private visible = true;
  private io?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!fine || reduce) return;

      this.zone.runOutsideAngular(() => {
        this.io = new IntersectionObserver(([e]) => {
          this.visible = e.isIntersecting;
        });
        this.io.observe(this.host);
        window.addEventListener('pointermove', this.onMove, { passive: true });
      });
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
    this.io?.disconnect();
    window.removeEventListener('pointermove', this.onMove);
  }

  private onMove = (e: PointerEvent) => {
    if (!this.visible) return;
    this.x = e.clientX / window.innerWidth - 0.5;
    this.y = e.clientY / window.innerHeight - 0.5;
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.host.style.setProperty('--tx', this.x.toFixed(3));
      this.host.style.setProperty('--ty', this.y.toFixed(3));
    });
  };
}