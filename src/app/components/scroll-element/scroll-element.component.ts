import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-element',
  imports: [],
  templateUrl: './scroll-element.component.html',
  styleUrl: './scroll-element.component.scss',
})
export class ScrollElement {

 progress = 0;

@HostListener('window:scroll')
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollTotal = docHeight - winHeight;

    this.progress = scrollTotal > 0 ? (scrollTop / scrollTotal) * 100 : 0;
  }
  
}
  