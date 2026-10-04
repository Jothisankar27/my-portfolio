import { Links, Profile } from './model';

export const PROFILE: Profile = {
  names: {
    en: { line1: 'Jothi Sankar', line2: 'GnanaSambandam' },
    ta: { line1: 'ஜோதி ஷங்கர்', line2: 'ஞானசம்பந்தம்' },
    hi: { line1: 'जोति संकर', line2: 'न्यानासम्बंदम' },
  },
  location: 'Bengaluru, KA · India',
  focus: 'Angular · Micro-frontends',
  siteUrl: 'https://jothisankar27.github.io/my-portfolio/',
  github: { user: 'Jothisankar27', repo: 'my-portfolio' },
};

const EMAIL = 'jothisankarg99@gmail.com';

export const LINKS: Links = {
  email: EMAIL,
  mailto: `mailto:${EMAIL}`,
  linkedin: 'https://linkedin.com/in/jothi-sankar-g',
  github: `https://github.com/${PROFILE.github.user}`,
  resume: 'assets/documents/Jothi_Sankar_Resume_2026.pdf',
};