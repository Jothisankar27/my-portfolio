import { Component, OnInit, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnalyticsService } from "../../services/analytics.service";
import { QuickFact, Evidence } from "src/app/models/model";
import { LightboxComponent } from "../lightbox/lightbox.component";

@Component({
  selector: "app-details",
  standalone: true,
  imports: [CommonModule, LightboxComponent],
  templateUrl: "./details.component.html",
  styleUrl: "./details.component.scss",
})
export class DetailsComponent implements OnInit {
  private analytics = inject(AnalyticsService);

  visible = false;

  quickFacts: QuickFact[] = [
    { label: "Role", value: "Senior Systems Engineer, Infosys" },
    { label: "Focus", value: "Angular · Micro-frontends" },
    { label: "Location", value: "Bengaluru, KA · India" },
    { label: "Experience", value: "4.3 Years" },
  ];

  readonly certEvidence: Evidence = {
    file: "assets/GH300-Certificate.pdf",
    type: "pdf",
    label: "GH-300 — GitHub Copilot Certification",
    previewImage: "assets/gh-300-preview.jpg",
  };

  activeEvidence = signal<Evidence | null>(null);

  openEvidence(evidence: Evidence): void {
    this.activeEvidence.set(evidence);
  }

  closeEvidence(): void {
    this.activeEvidence.set(null);
  }

  ngOnInit(): void {
    setTimeout(() => (this.visible = true), 100);
  }

  onResumeDownload(): void {
    this.analytics.trackResumeDownload();
  }
}