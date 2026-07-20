import { signal } from '@angular/core';

export interface Evidence {
  file: string;
  type: 'image' | 'pdf';
  label: string;
  previewImage?: string;
}

export interface Project {
  tag: string;
  stack: string;
  title: string;
  titleLine2: string;
  desc: string;
  bullets: string[];
  award?: { text: string; year: number; evidence?: Evidence }[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  evidence: Evidence;
}

export interface SkillBar {
  name: string;
  level: number;
 // animated: number;
}


export interface TimelineEvent {
  year:     string;
  role:     string;
  place:    string;
  desc:     string;
  type:     'work' | 'milestone';  // drives the dot colour
  current?: boolean;               // adds the live pulse to the active item
}

export type Theme = 
  'purple'    |
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
  key:    'expert' | 'proficient' | 'familiar';
  label:  string;
  desc:   string;
  skills: string[];
}

export interface Stat {
  num:     number;
  label:   string;
  display: ReturnType<typeof signal<number>>;
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