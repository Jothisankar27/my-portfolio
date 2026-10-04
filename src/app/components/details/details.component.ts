import { Component, OnInit, OnDestroy, signal, computed, inject, PLATFORM_ID, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { QuickFact } from "src/app/models/model";
import { totalExperience, relevantExperience, yearsSince } from "src/app/models/experience";
import { CURRENT_ROLE } from "../../models/career.data";
import { PROFILE } from "../../models/profile.data";

@Component({
  selector: "app-details",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./details.component.html",
  styleUrl: "./details.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnInit, OnDestroy {
  
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly visible = signal(false);

  private readonly now = signal(Date.now());
  private clockTimer?: ReturnType<typeof setInterval>;

  private formatYears(years: number): string {
    const rounded = Math.round(years * 100) / 100; // two decimal places, e.g. 4.34
    return `${rounded.toFixed(2)}${rounded === 1 ? ' Year' : ' Years'}`;
  }

  private readonly itExperienceLabel = computed(() =>
    this.formatYears(yearsSince(relevantExperience, this.now()))
  );

  private readonly totalExperienceLabel = computed(() =>
    this.formatYears(yearsSince(totalExperience, this.now()))
  );

  readonly quickFacts = computed<QuickFact[]>(() => [
    { label: "Role", value: CURRENT_ROLE },
    { label: "Focus", value: PROFILE.focus },
    { label: "Location", value: PROFILE.location },
    { label: "Relevant Experience", value: this.itExperienceLabel() },
    { label: "Total Experience", value: this.totalExperienceLabel() },
  ]);

  ngOnInit(): void {
    setTimeout(() => this.visible.set(true), 100);

    if (this.isBrowser) {
      this.clockTimer = setInterval(() => this.now.set(Date.now()), 60 * 60 * 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }
}