import { Component, signal, inject, afterNextRender } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ghCommit } from 'src/app/models/model';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  private http = inject(HttpClient);

  timeAgo  = signal('');
  //commitMsg = signal('');
  loading  = signal(true);

  constructor() {
    
    afterNextRender(() => {
      this.http
        .get<ghCommit[]>(
          'https://api.github.com/repos/Jothisankar27/my-portfolio/commits?per_page=1'
        )
        .subscribe({
          next: (commits) => {
            if (!commits?.length) { this.loading.set(false); return; }
            const date = new Date(commits[0].commit.author.date);
            //const raw  = commits[0].commit.message.split('\n')[0].trim();
            this.timeAgo.set(this.getTimeAgo(date));
            // this.commitMsg.set(this.sanitise(raw));
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
    });
  }

  // private sanitise(msg: string): string {
  //   const clean = msg
  //     .replace(/^(chore|fix|feat|build|ci|docs|style|refactor|perf|test)(\(.+?\))?:\s*/i, '')
  //     .replace(/^deploy:/i, '')
  //     .trim();
  //   return clean.charAt(0).toUpperCase() + clean.slice(1);
  // }

  private getTimeAgo(date: Date): string {
    const s = Math.floor((Date.now() - date.getTime()) / 1000);
    if (s < 60)
      return 'just now';
    if (s < 3600)
      return `${Math.floor(s / 60)}m ago`;
    if (s < 86400)
      return `${Math.floor(s / 3600)}h ago`;
    if (s < 86400 * 2)
      return 'yesterday';
    if (s < 86400 * 7)
      return `${Math.floor(s / 86400)}d ago`;
    if (s < 86400 * 30)
      return `${Math.floor(s / 604800)}w ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }
}