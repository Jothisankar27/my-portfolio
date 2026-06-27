import { bootstrapApplication, provideClientHydration ,withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), 
    provideClientHydration(withEventReplay()),
    provideZonelessChangeDetection()
  ]
}).catch((err) => console.error(err));