import { CURRENT_CAREER, CURRENT_EMPLOYER, CURRENT_ROLE } from './career.data';
import { LINKS, PROFILE } from './profile.data';
import { SKILLS } from './skills.data';

/** schema.org Person, built from the same data the page renders. */
export function buildPersonJsonLd(): string {
    const { line1, line2 } = PROFILE.names.en;
    const locality = PROFILE.location.split(',')[0];

    const json = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: `${line1} ${line2}`,
        jobTitle: CURRENT_ROLE,
        worksFor: { '@type': 'Organization', name: CURRENT_EMPLOYER },
        url: PROFILE.siteUrl,
        sameAs: [LINKS.linkedin, LINKS.github],
        address: { '@type': 'PostalAddress', addressLocality: locality, addressCountry: 'IN' },
        knowsAbout: SKILLS.flatMap((c) => c.items.map((i) => i.name)),
        description: CURRENT_CAREER.desc,
    };

    // Escape "<" so the payload can never close the surrounding <script> tag.
    return JSON.stringify(json).replace(/</g, '\\u003c');
}