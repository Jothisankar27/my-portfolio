import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { HeroComponent } from './components/hero/hero.component';
import { TickerComponent } from './components/ticker/ticker.component';
import { WorkComponent } from './components/work/work.component';
import { SkillsComponent } from './components/skills/skills.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    HeroComponent,
    TickerComponent,
    WorkComponent,
    SkillsComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent
  ],
  template: `
    <div class="noise"></div>
    <app-nav></app-nav>
    <app-hero></app-hero>
    <app-ticker></app-ticker>
    <app-work></app-work>
    <app-skills></app-skills>
    <app-about></app-about>
    <app-contact></app-contact>
    <app-footer></app-footer>
  `
})
export class AppComponent {}
