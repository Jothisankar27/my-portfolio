import { Component, OnInit, OnDestroy, signal, computed, inject, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { QuickFact } from "src/app/models/model";

@Component({
  selector: "app-details",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./details.component.html",
  styleUrl: "./details.component.scss",
})
export class DetailsComponent implements OnInit, OnDestroy {
  
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly visible = signal(false);

  private readonly IT_EXPERIENCE_START_DATE = new Date(2022, 3, 14);   // April 14, 2022
  private readonly TOTAL_EXPERIENCE_START_DATE = new Date(2020, 10, 3); // November 3, 2020

  private readonly now = signal(Date.now());
  private clockTimer?: ReturnType<typeof setInterval>;

  private yearsSince(start: Date): number {
    const msPerYear = 1000 * 60 * 60 * 24 * 365.25; // 365.25 accounts for leap years
    const elapsedMs = this.now() - start.getTime();
    return elapsedMs / msPerYear;
  }

  private formatYears(years: number): string {
    const rounded = Math.round(years * 100) / 100; // two decimal places, e.g. 4.34
    return `${rounded.toFixed(2)}${rounded === 1 ? ' Year' : ' Years'}`;
  }

  private readonly itExperienceLabel = computed(() =>
    this.formatYears(this.yearsSince(this.IT_EXPERIENCE_START_DATE))
  );

  private readonly totalExperienceLabel = computed(() =>
    this.formatYears(this.yearsSince(this.TOTAL_EXPERIENCE_START_DATE))
  );

  readonly quickFacts = computed<QuickFact[]>(() => [
    { label: "Role", value: "IT Analyst, TCS Limited" },
    { label: "Focus", value: "Angular · Micro-frontends" },
    { label: "Location", value: "Bengaluru, KA · India" },
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