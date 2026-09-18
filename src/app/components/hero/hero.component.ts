import {
  Component,
  OnDestroy,
  HostListener,
  signal,
  inject,
  PLATFORM_ID,
  afterNextRender,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-hero",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./hero.component.html",
  styleUrl: "./hero.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

   constructor() {
    afterNextRender(() => {
      setTimeout(() => this.visible.set(true), 100);
      setTimeout(() => this.hintState.set("click"), 1050);

      if (this.isBrowser) {
        this.mediaQuery = window.matchMedia("(max-width: 768px)");
        this.isMobile.set(this.mediaQuery.matches);
        this.mediaQuery.addEventListener("change", this.onMediaChange);
        if (this.isMobile()) this.startCrossfade();
      }
    });
  }

  readonly visible = signal(false);
  readonly scriptIndex = signal(0); // 0 = English , 1 = Tamil , 2 = Hindi
  readonly SCRIPTS = ["en", "ta", "hi"] as const;
  readonly slideDir = signal<"left" | "right" | null>(null);

  // Language swap is a web-only flourish. Mobile instead auto-cycles through
  // the same three scripts with a whole-string crossfade+rise, rather than
  // a shrunk-down version of the drag interaction.
  readonly isMobile = signal(false);
  private mediaQuery: MediaQueryList | null = null;
  private readonly onMediaChange = (e: MediaQueryListEvent) => {
    this.isMobile.set(e.matches);
    if (e.matches) this.startCrossfade();
    else this.stopCrossfade();
  };

  // --- Mobile crossfade state ---
  private static readonly NAME_SCRIPTS: Record<
    "en" | "ta" | "hi",
    { line1: string; line2: string }
  > = {
    en: { line1: "Jothi Sankar", line2: "GnanaSambandam" },
    ta: { line1: "ஜோதி ஷங்கர்", line2: "ஞானசம்பந்தம்" },
    hi: { line1: "जोति संकर", line2: "न्यानासम्बंदम" },
  };
  readonly NAME_SCRIPTS = HeroComponent.NAME_SCRIPTS;

  readonly mobileScript = signal<"en" | "ta" | "hi">("en");
  readonly crossfadeShow = signal(true);

  private cycleGen = 0;
  private cycleTimer: ReturnType<typeof setTimeout> | null = null;

  // Hint state: 'hidden' until hero entrance done, 'click' at rest, 'drag' while held
  readonly hintState = signal<"hidden" | "click" | "drag">("hidden");

  private swipeStartX: number | null = null;
  private swipeFired = false;
  private readonly SWIPE_THRESHOLD = 48;
  private animating = false;
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;

  get currentScript() {
    return this.SCRIPTS[this.scriptIndex()];
  }

  ngOnDestroy(): void {
    if (this.pendingTimer) clearTimeout(this.pendingTimer);
    this.mediaQuery?.removeEventListener("change", this.onMediaChange);
    this.stopCrossfade();
  }

  onMouseDown(e: MouseEvent): void {
    this.swipeStartX = e.clientX;
    this.swipeFired = false;
    if (this.hintState() === "click") this.hintState.set("drag");
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e: MouseEvent): void {
    if (this.swipeStartX === null || this.swipeFired) return;
    const delta = e.clientX - this.swipeStartX;
    if (Math.abs(delta) >= this.SWIPE_THRESHOLD) {
      this.swipeFired = true;
      this.swipeStartX = null;
      this.triggerSwipe(delta);
    }
  }

  @HostListener("document:mouseup")
  onMouseUp(): void {
    this.swipeStartX = null;
    this.swipeFired = false;
    // If they clicked but didn't drag, go back to 'click' hint
    if (this.hintState() === "drag") this.hintState.set("click");
  }

  onTouchStart(e: TouchEvent): void {
    this.swipeStartX = e.touches[0].clientX;
    this.swipeFired = false;
    if (this.hintState() === "click") this.hintState.set("drag");
  }

  onTouchMove(e: TouchEvent): void {
    if (this.swipeStartX === null || this.swipeFired) return;
    const delta = e.touches[0].clientX - this.swipeStartX;
    if (Math.abs(delta) >= this.SWIPE_THRESHOLD) {
      this.swipeFired = true;
      this.swipeStartX = null;
      this.triggerSwipe(delta);
    }
  }

  onTouchEnd(): void {
    this.swipeStartX = null;
    this.swipeFired = false;
    if (this.hintState() === "drag") this.hintState.set("click");
  }

  private triggerSwipe(delta: number): void {
    if (this.animating) return;

    // Hide hint during the slide animation, restore it after
    this.hintState.set("hidden");

    this.animating = true;
    this.slideDir.set(delta < 0 ? "left" : "right");
    const step = delta < 0 ? 1 : -1;

    this.pendingTimer = setTimeout(() => {
      this.scriptIndex.set(
        (this.scriptIndex() + step + this.SCRIPTS.length) % this.SCRIPTS.length
      );
      this.slideDir.set(null);
      requestAnimationFrame(() => {
        this.animating = false;
        this.pendingTimer = null;
        // Restore click hint so user knows they can swipe again
        this.hintState.set("click");
      });
    }, 300);
  }

  // --- Mobile: auto-cycling crossfade+rise across EN -> TA -> HI -> repeat ---

  private startCrossfade(): void {
    if (!this.isBrowser) return;
    this.runCrossfade();
  }

  private stopCrossfade(): void {
    this.cycleGen++; // invalidates any in-flight loop iteration
    if (this.cycleTimer) {
      clearTimeout(this.cycleTimer);
      this.cycleTimer = null;
    }
  }

  private cfWait(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      this.cycleTimer = setTimeout(resolve, ms);
    });
  }

  private async runCrossfade(): Promise<void> {
    const myGen = ++this.cycleGen;
    let idx = 0;

    this.mobileScript.set(this.SCRIPTS[0]);
    this.crossfadeShow.set(true);

    while (this.cycleGen === myGen) {
      await this.cfWait(2400); // hold, fully visible
      if (this.cycleGen !== myGen) return;

      this.crossfadeShow.set(false); // fades + drops out
      await this.cfWait(450);
      if (this.cycleGen !== myGen) return;

      idx++;
      this.mobileScript.set(this.SCRIPTS[idx % this.SCRIPTS.length]);
      await this.cfWait(30); // let the new (still-hidden) text paint before animating in
      if (this.cycleGen !== myGen) return;

      this.crossfadeShow.set(true); // rises + fades in
    }
  }
}