import { Component, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  CERTS, DEGREE, FEATURED, PROFILE, PROJECTS, SKILLS, STATS,
} from './portfolio.data';
import { Reveal } from './reveal.directive';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  imports: [Reveal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private doc = inject(DOCUMENT);

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
  }

  toggleTheme() {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  private initialTheme(): Theme {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* ignore */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}