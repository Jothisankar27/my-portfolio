import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { DetailsComponent } from "./components/details/details.component";
import { WorkComponent } from './components/work/work.component';
import { SkillsComponent } from './components/skills/skills.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { HeroComponent } from './components/hero/hero.component';
import { CommandPaletteComponent } from './components/command-palette/command-palette.component';
import { ArchitectureModel } from './components/architecture-model/architecture-model';
import { FloatingComponent } from './components/floating-component/floating-component';
import { LogoComponent } from './components/logo/logo';
import { StructuredDataService } from './services/strucuture.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    DetailsComponent,
    ArchitectureModel,
    WorkComponent,
    SkillsComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent,
    TimelineComponent,
    HeroComponent,
    CommandPaletteComponent,
    FloatingComponent,
    LogoComponent
],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly structuredData = inject(StructuredDataService);

  ngOnInit(): void {
    this.structuredData.applyPersonSchema();
  }
}