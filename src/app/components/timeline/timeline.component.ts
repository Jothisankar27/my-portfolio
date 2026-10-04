import { Component, ChangeDetectionStrategy } from '@angular/core';

import { TimelineEvent } from '../../models/model';
import { CAREER } from '../../data/career.data';

@Component({
  selector: "app-timeline",
  standalone: true,
  imports: [],
  templateUrl: "./timeline.component.html",
  styleUrl: "./timeline.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  readonly events: readonly TimelineEvent[] = CAREER;
}