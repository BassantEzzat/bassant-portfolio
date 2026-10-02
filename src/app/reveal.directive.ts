import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

@Directive({ selector: '[reveal]' })
export class Reveal implements OnInit, OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly revealDelay = input(0);
  private io?: IntersectionObserver;

  ngOnInit() {
    const node = this.el.nativeElement;
    node.classList.add('reveal');
    node.style.animationDelay = `${this.revealDelay()}ms`;

    if (!('IntersectionObserver' in window)) {
      node.classList.add('in');
      return;
    }

    this.io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('in');
          this.io?.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    this.io.observe(node);
  }

  ngOnDestroy() {
    this.io?.disconnect();
  }
}