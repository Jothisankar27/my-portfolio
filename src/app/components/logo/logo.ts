import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { PROFILE } from '../../data/profile.data';

/** How far (px) the layers travel when the pointer reaches the edge of the logo. */
const MAX_SHIFT_X = 8;
const MAX_SHIFT_Y = 6;

@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  /** Emitted on click so the parent can react (the nav closes its mobile menu). */
  readonly activated = output<void>();

  protected readonly initials = PROFILE.names.en.line1
    .split(' ')
    .map((word) => word[0])
    .join('');
  protected readonly label = `${PROFILE.names.en.line1}, back to top`;

  /** Pointer position relative to the logo centre, in px. Drives two CSS custom properties. */
  protected readonly offset = signal({ x: 0, y: 0 });
  protected readonly pulsing = signal(false);

  protected onPointerMove(event: PointerEvent): void {
    // Touch has no hover, so a finger would only leave the logo stuck off-centre.
    if (event.pointerType === 'touch') return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    this.offset.set({
      x: Math.round(x * MAX_SHIFT_X * 10) / 10,
      y: Math.round(y * MAX_SHIFT_Y * 10) / 10,
    });
  }

  protected onPointerLeave(): void {
    this.offset.set({ x: 0, y: 0 });
  }

  protected onClick(): void {
    this.pulsing.set(true);
    this.activated.emit();
  }

  protected onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName.includes('logo-pop')) {
      this.pulsing.set(false);
    }
  }
}