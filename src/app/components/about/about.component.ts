import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThenNow } from 'src/app/models/model';
import { THEN_NOW } from '../../data/about.data';

@Component({
  selector: "app-about",
  standalone: true,
  imports: [],
  templateUrl: "./about.component.html",
  styleUrl: "./about.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {

  readonly thenNow: readonly ThenNow[] = THEN_NOW;
}