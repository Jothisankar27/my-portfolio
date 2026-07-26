import {
  Component,
  signal,
  computed,
  inject,
  PLATFORM_ID,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../services/themes.service';
import { Theme } from '../../models/model';
import { PaletteCommand, CommandGroup } from '../../models/model';

@Component({
  selector: "app-command-palette",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./command-palette.component.html",
  styleUrl: "./command-palette.component.scss",
})
export class CommandPaletteComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeService = inject(ThemeService);

  @ViewChild("searchInput") searchInput?: ElementRef<HTMLInputElement>;

  readonly isOpen = signal(false);
  readonly query = signal("");
  readonly activeIndex = signal(0);

  private readonly commands: PaletteCommand[] = [
    {
      id: "nav-home",
      group: "Navigate",
      label: "Go to Home",
      keywords: "hero top start",
      run: () => this.scrollTo("home"),
    },
    {
      id: "nav-timeline",
      group: "Navigate",
      label: "Go to Career",
      keywords: "timeline experience history",
      run: () => this.scrollTo("timeline"),
    },
    {
      id: "nav-work",
      group: "Navigate",
      label: "Go to Work",
      keywords: "projects oms meridian",
      run: () => this.scrollTo("work"),
    },
    {
      id: "nav-skills",
      group: "Navigate",
      label: "Go to Skills",
      keywords: "tech stack proficiency",
      run: () => this.scrollTo("skills"),
    },
    {
      id: "nav-about",
      group: "Navigate",
      label: "Go to About",
      keywords: "bio certifications gh-300",
      run: () => this.scrollTo("about"),
    },
    {
      id: "nav-contact",
      group: "Navigate",
      label: "Go to Contact",
      keywords: "message form email",
      run: () => this.scrollTo("contact"),
    },

    {
      id: "connect-email",
      group: "Connect",
      label: "Email me",
      keywords: "mail gmail contact",
      hint: "jothisankarg99@gmail.com",
      run: () => this.openUrl("mailto:jothisankarg99@gmail.com"),
    },
    {
      id: "connect-linkedin",
      group: "Connect",
      label: "Open LinkedIn",
      keywords: "linkedin profile",
      run: () => this.openUrl("https://linkedin.com/in/jothi-sankar-g"),
    },
    {
      id: "connect-github",
      group: "Connect",
      label: "Open GitHub",
      keywords: "github repos code",
      run: () => this.openUrl("https://github.com/Jothisankar27"),
    },
    {
      id: "connect-resume",
      group: "Connect",
      label: "Download Resume",
      keywords: "cv pdf download",
      run: () => this.openUrl("assets/Jothi Sankar Resume 2026.pdf"),
    },

    {
      id: "theme-purple",
      group: "Theme",
      label: "Switch to Purple theme",
      keywords: "purple color scheme",
      run: () => this.applyTheme("purple"),
    },
    {
      id: "theme-synthwave",
      group: "Theme",
      label: "Switch to Synthwave theme",
      keywords: "synthwave pink color scheme",
      run: () => this.applyTheme("synthwave"),
    },
    {
      id: "theme-newspaper",
      group: "Theme",
      label: "Switch to Newspaper theme",
      keywords: "newspaper beige color scheme",
      run: () => this.applyTheme("newspaper"),
    },
    {
      id: "theme-graphite",
      group: "Theme",
      label: "Switch to Graphite theme",
      keywords: "graphite gray color scheme",
      run: () => this.applyTheme("graphite"),
    },
  ];

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.commands;
    return this.commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.keywords.toLowerCase().includes(q),
    );
  });

  readonly groupedFiltered = computed(() => {
    const groups: { group: CommandGroup; items: PaletteCommand[] }[] = [];
    for (const cmd of this.filtered()) {
      let bucket = groups.find((g) => g.group === cmd.group);
      if (!bucket) {
        bucket = { group: cmd.group, items: [] };
        groups.push(bucket);
      }
      bucket.items.push(cmd);
    }
    return groups;
  });

  @HostListener("document:keydown", ["$event"])
  onGlobalKeydown(event: KeyboardEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const isOpenShortcut =
      (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
    if (isOpenShortcut) {
      event.preventDefault();
      if (this.isOpen()) {
        this.close();
      } else {
        this.open();
      }
      return;
    }

    if (!this.isOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      this.close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      this.move(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.move(-1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      this.runActive();
    }
  }

  open(): void {
    this.query.set("");
    this.activeIndex.set(0);
    this.isOpen.set(true);
    // Wait a tick for the input to render, then focus it
    setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  select(cmd: PaletteCommand): void {
    cmd.run();
    this.close();
  }

  isActive(cmd: PaletteCommand): boolean {
    return this.filtered()[this.activeIndex()]?.id === cmd.id;
  }

  hoverItem(cmd: PaletteCommand): void {
    const idx = this.filtered().findIndex((c) => c.id === cmd.id);
    if (idx !== -1) this.activeIndex.set(idx);
  }

  private move(delta: number): void {
    const total = this.filtered().length;
    if (total === 0) return;
    this.activeIndex.update((i) => (i + delta + total) % total);
  }

  private runActive(): void {
    const cmd = this.filtered()[this.activeIndex()];
    if (cmd) this.select(cmd);
  }

  private scrollTo(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  }

  private openUrl(url: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.open(url, "_blank");
  }

  private applyTheme(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.themeService.switchTheme(
      theme,
      window.innerWidth / 2,
      window.innerHeight / 2,
    );
  }
}
