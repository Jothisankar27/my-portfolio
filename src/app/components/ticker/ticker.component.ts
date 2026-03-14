import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-ticker",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./ticker.component.html",
  styleUrl: "./ticker.component.scss",
})
export class TickerComponent {
  items = [
    "Angular v20",
    "Micro-frontends",
    "RxJS",
    "RESTful APIs",
    "Node.js",
    "SQL",
    "Angular Material",
    "SCSS",
    "GitHub Copilot",
    "Agile Delivery",
  ];
}
