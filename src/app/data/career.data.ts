import { TimelineEvent } from '../models/model';

type CareerEntry = Omit<TimelineEvent, 'place'>;

/** Newest first. The entry with `current: true` drives the role and employer shown elsewhere. */
const ENTRIES: readonly CareerEntry[] = [
    {
        year: '2026',
        role: 'Web Application Engineer',
        company: 'Tata Consultancy Services',
        location: 'Bengaluru, Karnataka, India',
        desc: 'Angular Development, Micro-Frontend [Module Federation], UI/UX, Agentic AI, LLM integration',
        type: 'work',
        current: true,
    },
    {
        year: '2022',
        role: 'UI Developer',
        company: 'Infosys Limited',
        location: 'Bengaluru, Karnataka, India',
        desc: 'Angular v20 migration, Micro-Frontend architecture, Cross-MFE communication, stakeholder delivery. Rise Insta Award recipient.',
        type: 'work',
    },
    {
        year: '2020',
        role: 'Quality Inspector',
        company: 'Layam Flexi Solutions',
        location: 'Hosur, Tamil Nadu, India',
        desc: 'Root-cause analysis, process documentation, tolerance inspection. Built the instincts for precision that now go into every component.',
        type: 'work',
    },
];

export const CAREER: readonly TimelineEvent[] = ENTRIES.map((e) => ({
    ...e,
    place: `${e.company} · ${e.location}`,
}));

export const CURRENT_CAREER: TimelineEvent = CAREER.find((e) => e.current) ?? CAREER[0];
export const CURRENT_ROLE = CURRENT_CAREER.role;
export const CURRENT_EMPLOYER = CURRENT_CAREER.company;