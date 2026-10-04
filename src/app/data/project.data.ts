import { Project } from '../models/model';

export const PROJECTS: readonly Project[] = [
    {
        tag: 'TCS BAnCS · AI-driven Banking Platform',
        stack: 'Angular · Micro-frontend [Module Federation] · LLM Integration · MCP',
        title: 'AI Compass',
        titleLine2: 'July 2026 - Present',
        desc: 'Collaborating on a micro-frontend banking platform with integrated LLM capabilities, covering real-time transaction monitoring and AI-driven customer support.',
        bullets: [
            'Migrated the Angular micro-frontend application to the latest version, modernizing code patterns to current Angular standards',
            'Prototyped a Figma-to-code workflow using GitHub Copilot via MCP, building custom Figma plugins backed by Python scripts and a Node.js server',
        ],
    },
    {
        tag: 'Infosys · Enterprise Scale Application',
        stack: 'Angular [Micro-frontends] · Java [Spring Boot] · MS-SQL',
        title: 'Order Management System',
        titleLine2: 'Oct 2024 - July 2026',
        desc: 'Led delivery across 3 major Angular version migrations (v13 → v18 → v20) on a production-scale enterprise application. Architected cross-micro-frontend communication services, integrated RESTful APIs, and earned 2× Rise Insta Awards for shipping critical features under tight deadlines.',
        bullets: [
            'Migrated a production codebase across 3 Angular major versions — zero downtime, full feature parity maintained throughout',
            'Built cross-MFE communication services that decoupled 4+ independently deployed micro-frontends, reducing inter-team dependency delays',
            'Resolved critical production bugs within same-day turnaround on 2 separate occasions — each recognised with a Rise Insta Award',
            'Conducted UI vulnerability analysis using ArmorCode, remediating critical-severity findings to keep the application clean and compliant',
            'Mentored 2 onboarding engineers, cutting their ramp-up time by ~30% through structured code walkthroughs',
            'Delivered stakeholder-requested UI workflow changes end-to-end — from requirement to production — within sprint cycles',
        ],
        award: [
            {
                text: 'Rise Insta Award · Infosys · For exceptional delivery of Requirements under minimal timeframe',
                year: 2025,
                evidence: {
                    file: 'assets/documents/Insta_Award_Maximus.png',
                    type: 'image',
                    label: 'Rise Insta Award 2025 — Infosys',
                },
            },
            {
                text: 'Rise Insta Award · Infosys · For Delivering Critical Modules in Production under Tight turnaround time',
                year: 2026,
                evidence: {
                    file: 'assets/documents/Insta_Award_Ecosystems.png',
                    type: 'image',
                    label: 'Rise Insta Award 2026 — Infosys',
                },
            },
        ],
    },
    {
        tag: 'Infosys · Virtual Events Hosting Platform',
        stack: 'Angular · NodeJS · PostgreSQL',
        title: 'Meridian Events',
        titleLine2: 'April 2022 - September 2024',
        desc: 'Built features for a virtual events hosting platform serving large-scale online audiences. Collaborated with peer developers, optimised database queries, and delivered a real-time attendee chat proof-of-concept using PubNub.',
        bullets: [
            'Developed Angular + Node.js features across the full events lifecycle — registration, session management, and attendee engagement modules',
            'PostgreSQL query optimisation that identified and cleansed 10,000+ redundant records, improving query response time noticeably',
            'Built a real-time one-to-one attendee chat POC with PubNub APIs — demonstrated to stakeholders as a potential live feature',
        ],
    },
];