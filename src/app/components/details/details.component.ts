import { Component, OnInit, OnDestroy, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkPanelService } from '../../services/workpanel.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy {
  public workPanel = inject(WorkPanelService);
  private analytics = inject(AnalyticsService);

  visible = false;
  scriptIndex = 0;   // 0 = English , 1 = Tamil , 2 = Hindi
  readonly SCRIPTS = ['en', 'ta', 'hi'] as const;
  slideDir: 'left' | 'right' | null = null;

  // Hint state: 'hidden' until hero entrance done, 'click' at rest, 'drag' while held
  readonly hintState = signal<'hidden' | 'click' | 'drag'>('hidden');

  private swipeStartX: number | null = null;
  private swipeFired  = false;
  private readonly SWIPE_THRESHOLD = 48;
  private animating   = false;
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;

  get currentScript() { return this.SCRIPTS[this.scriptIndex]; }

  ngOnInit(): void {
    setTimeout(() => (this.visible = true), 100);
    // Reveal hint after hero-name entrance animation finishes:
    // 100ms (visible delay) + 150ms (transition-delay on name) + 700ms (transition) + 100ms buffer
    setTimeout(() => this.hintState.set('click'), 1050);
  }

  ngOnDestroy(): void {
    if (this.pendingTimer) clearTimeout(this.pendingTimer);
  }

  onResumeDownload(): void {
    this.analytics.trackResumeDownload();
  }

  onMouseDown(e: MouseEvent): void {
    this.swipeStartX = e.clientX;
    this.swipeFired  = false;
    if (this.hintState() === 'click') this.hintState.set('drag');
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (this.swipeStartX === null || this.swipeFired) return;
    const delta = e.clientX - this.swipeStartX;
    if (Math.abs(delta) >= this.SWIPE_THRESHOLD) {
      this.swipeFired  = true;
      this.swipeStartX = null;
      this.triggerSwipe(delta);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.swipeStartX = null;
    this.swipeFired  = false;
    // If they clicked but didn't drag, go back to 'click' hint
    if (this.hintState() === 'drag') this.hintState.set('click');
  }

  onTouchStart(e: TouchEvent): void {
    this.swipeStartX = e.touches[0].clientX;
    this.swipeFired  = false;
    if (this.hintState() === 'click') this.hintState.set('drag');
  }

  onTouchMove(e: TouchEvent): void {
    if (this.swipeStartX === null || this.swipeFired) return;
    const delta = e.touches[0].clientX - this.swipeStartX;
    if (Math.abs(delta) >= this.SWIPE_THRESHOLD) {
      this.swipeFired  = true;
      this.swipeStartX = null;
      this.triggerSwipe(delta);
    }
  }

  onTouchEnd(): void {
    this.swipeStartX = null;
    this.swipeFired  = false;
    if (this.hintState() === 'drag') this.hintState.set('click');
  }

  private triggerSwipe(delta: number): void {
    if (this.animating) return;

    // Hide hint during the slide animation, restore it after
    this.hintState.set('hidden');

    this.animating = true;
    this.slideDir  = delta < 0 ? 'left' : 'right';
    const step     = delta < 0 ? 1 : -1;

    this.pendingTimer = setTimeout(() => {
      this.scriptIndex = (this.scriptIndex + step + this.SCRIPTS.length) % this.SCRIPTS.length;
      this.slideDir    = null;
      requestAnimationFrame(() => {
        this.animating    = false;
        this.pendingTimer = null;
        // Restore click hint so user knows they can swipe again
        this.hintState.set('click');
      });
    }, 300);
  }
}