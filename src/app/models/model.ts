export interface Project {
  tag: string;
  stack: string;
  title: string;
  titleLine2: string;
  desc: string;
  bullets: string[];
  award?: string;
}

export interface SkillBar {
  name: string;
  level: number;
 // animated: number;
}

export interface FormModel {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface TimelineEvent {
  year:     string;
  role:     string;
  place:    string;
  desc:     string;
  type:     'work' | 'milestone';  // drives the dot colour
  current?: boolean;               // adds the live pulse to the active item
}