import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { buildPersonJsonLd } from '../data/strucuture.data';

@Injectable({ providedIn: 'root' })
export class StructuredDataService {
    private static readonly PERSON_SCRIPT_ID = 'person-jsonld';

    private readonly doc = inject(DOCUMENT);
    private readonly isServer = isPlatformServer(inject(PLATFORM_ID));

    /**
     * Adds the Person JSON-LD to <head> during prerender only. The browser keeps
     * the <head> that was served, so running this there would duplicate the tag.
     */
    applyPersonSchema(): void {
        if (!this.isServer) return;

        const id = StructuredDataService.PERSON_SCRIPT_ID;
        this.doc.getElementById(id)?.remove();

        const script = this.doc.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        script.text = buildPersonJsonLd();
        this.doc.head.appendChild(script);
    }
}