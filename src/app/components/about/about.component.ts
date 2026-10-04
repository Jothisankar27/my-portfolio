import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThenNow } from 'src/app/models/model';
import { THEN_NOW } from '../../data/about.data';

@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./about.component.html",
  styleUrl: "./about.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {

  readonly thenNow: readonly ThenNow[] = THEN_NOW;
}