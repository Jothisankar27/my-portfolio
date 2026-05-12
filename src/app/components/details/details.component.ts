import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkPanelService } from '../../services/workpanel.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy {
  workPanel = inject(WorkPanelService);
  visible = false;
  scriptIndex = 0;   // 0 = English , 1 = Tamil , 2 = Hindi
  readonly SCRIPTS = ['en', 'ta', 'hi'] as const;
  slideDir: 'left' | 'right' | null = null;

  private swipeStartX: number | null = null;
  private swipeFired  = false;     
  private readonly SWIPE_THRESHOLD = 48;
  private animating   = false;
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;

  get currentScript() { return this.SCRIPTS[this.scriptIndex]; }

  ngOnInit(): void {
    setTimeout(() => (this.visible = true), 100);
  }

  ngOnDestroy(): void {
    if (this.pendingTimer) clearTimeout(this.pendingTimer);
  }

  // Mouse
  onMouseDown(e: MouseEvent): void {
    this.swipeStartX = e.clientX;
    this.swipeFired  = false;
  }

  // Track movement in real-time — fire the moment threshold is crossed
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

  // Clean up if user releases without hitting threshold
  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.swipeStartX = null;
    this.swipeFired  = false;
  }

  // ── Touch
  onTouchStart(e: TouchEvent): void {
    this.swipeStartX = e.touches[0].clientX;
    this.swipeFired  = false;
  }

  // Fire the moment finger crosses the threshold — no need to lift the finger
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
  }

  // ── Core
  private triggerSwipe(delta: number): void {
    if (this.animating) return;

    this.animating = true;
    this.slideDir  = delta < 0 ? 'left' : 'right';
    const step     = delta < 0 ? 1 : -1;

    this.pendingTimer = setTimeout(() => {
      this.scriptIndex = (this.scriptIndex + step + this.SCRIPTS.length) % this.SCRIPTS.length;
      this.slideDir    = null;
      requestAnimationFrame(() => {
        this.animating    = false;
        this.pendingTimer = null;
      });
    }, 300);
  }
}