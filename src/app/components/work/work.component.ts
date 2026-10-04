import {
  Component,
  signal,
  inject,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  viewChild,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Project, Evidence } from "../../models/model";
import { LightboxComponent } from "../lightbox/lightbox.component";
import { PROJECTS } from "../../models/project.data";

@Component({
  selector: "app-work",
  standalone: true,
  imports: [LightboxComponent],
  templateUrl: "./work.component.html",
  styleUrl: "./work.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkComponent implements AfterViewInit, OnDestroy {

  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  private readonly deck = viewChild.required<ElementRef<HTMLElement>>('deck');

  // Which card is currently snapped into view — driven by IntersectionObserver,
  // the same pattern NavComponent already uses for active-section tracking.
  // No click-to-switch state at all: scrolling IS the navigation.
  activeIndex = signal(0);

  activeEvidence = signal<Evidence | null>(null);

  openEvidence(evidence?: Evidence): void {
    if (evidence) this.activeEvidence.set(evidence);
  }

  closeEvidence(): void {
    this.activeEvidence.set(null);
  }

  readonly projects: readonly Project[] = PROJECTS;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const cards = Array.from(
      this.deck().nativeElement.querySelectorAll<HTMLElement>('.project-card')
    );

    this.observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible) {
          const index = cards.indexOf(mostVisible.target as HTMLElement);
          if (index !== -1) this.activeIndex.set(index);
        }
      },
      { root: this.deck().nativeElement, threshold: 0.4 }
    );

    cards.forEach((card) => this.observer!.observe(card));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  scrollTo(index: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const cards = this.deck().nativeElement.querySelectorAll<HTMLElement>('.project-card');
    cards[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}