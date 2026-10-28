import {
  ApplicationRef,
  Component,
  DestroyRef,
  EnvironmentInjector,
  Type,
  createComponent,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  CERTS, DEGREE, FEATURED, PROFILE, PROJECTS, SKILLS, STATS,
} from './portfolio.data';
import { Reveal } from './reveal.directive';
import { Backdrop } from './backdrop';
import { ScrollProgress } from './scroll-progress';
import { PhotoFrame } from './photo-frame';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  imports: [Reveal, PhotoFrame],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private doc = inject(DOCUMENT);
  private appRef = inject(ApplicationRef);
  private envInjector = inject(EnvironmentInjector);
  private destroyRef = inject(DestroyRef);

  readonly profile = PROFILE;
  readonly stats = STATS;
  readonly featured = FEATURED;
  readonly projects = PROJECTS;
  readonly skills = SKILLS;
  readonly degree = DEGREE;
  readonly certs = CERTS;
  readonly year = new Date().getFullYear();

  readonly theme = signal<Theme>(this.initialTheme());

  constructor() {
    effect(() => {
      const t = this.theme();
      this.doc.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem('theme', t); } catch { /* ignore */ }
    });

    // creative animated background + scroll progress button
    this.mount(Backdrop);
    this.mount(ScrollProgress);
  }

  toggleTheme() {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  /** Mounts a standalone component directly on <body>. */
  private mount<T>(component: Type<T>) {
    const ref = createComponent(component, { environmentInjector: this.envInjector });
    this.appRef.attachView(ref.hostView);
    this.doc.body.prepend(ref.location.nativeElement);
    this.destroyRef.onDestroy(() => ref.destroy());
  }

  private initialTheme(): Theme {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* ignore */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}