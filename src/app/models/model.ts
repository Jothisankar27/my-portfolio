export interface Evidence {
  readonly file: string;
  readonly type: 'image' | 'pdf';
  readonly label: string;
  readonly previewImage?: string;
}

export interface Project {
  readonly tag: string;
  readonly stack: string;
  readonly title: string;
  readonly titleLine2: string;
  readonly desc: string;
  readonly bullets: readonly string[];
  readonly award?: readonly { text: string; year: number; evidence?: Evidence }[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  evidence: Evidence;
}

export interface SkillItem {
  readonly name: string;
  readonly iconSrc: string;
  readonly evidence?: Evidence;
  readonly badge?: string;
}

export interface SkillCategory {
  readonly heading: string;
  readonly items: readonly SkillItem[];
}


export interface TimelineEvent {
  readonly year: string;
  readonly role: string;
  readonly company: string;
  readonly location: string;
  readonly place: string;               // derived: `${company} · ${location}`
  readonly desc: string;
  readonly type: 'work' | 'milestone';  // drives the dot colour
  readonly current?: boolean;               // adds the live pulse to the active item
}

export type Theme =
  'synthwave' |
  'newspaper' |
  'graphite';
export interface ThemeMeta {
  id: Theme;
  label: string;
  swatch: string;
  bg: string;
}
export interface Tier {
  key: 'expert' | 'proficient' | 'familiar';
  label: string;
  desc: string;
  skills: string[];
}

export interface ghCommit {
  commit: {
    message: string;
    author: {
      date: string
    };
  };
}
export interface QuickFact {
  label: string;
  value: string;
}

export type CommandGroup = 'Navigate' | 'Connect' | 'Theme';
export interface PaletteCommand {
  id: string;
  label: string;
  group: CommandGroup;
  keywords: string;
  hint?: string;
  run: () => void;
}

export type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export interface ThenNow {
  readonly then: string;
  readonly now: string;
}

export type ArchView = 'narrative' | 'features';

export type NameScript = 'en' | 'ta' | 'hi';

export interface NameLines {
  readonly line1: string;
  readonly line2: string;
}

export interface Profile {
  readonly names: Readonly<Record<NameScript, NameLines>>;
  readonly location: string;
  readonly focus: string;
  readonly siteUrl: string;
  readonly github: { readonly user: string; readonly repo: string };
}

export interface Links {
  readonly email: string;
  readonly mailto: string;
  readonly linkedin: string;
  readonly github: string;
  readonly resume: string;
}

export interface EducationEntry {
  readonly institution: string;
  readonly credential: string;
  readonly year: string;
}