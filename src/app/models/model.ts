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
  animated: number;
}
