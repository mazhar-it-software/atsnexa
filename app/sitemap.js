const base = 'https://atsnexa.com';
const entries = [
  ['/',1,'weekly'],
  ['/ats-resume-checker',0.9,'monthly'],
  ['/resume-builder',0.9,'monthly'],
  ['/resume-templates',0.8,'monthly'],
  ['/ai-tools',0.9,'monthly'],
  ['/pricing',0.7,'monthly'],
  ['/products',0.7,'weekly'],
  ['/guides',0.7,'weekly'],
  ['/about',0.5,'monthly'],
  ['/contact',0.4,'monthly'],
  ['/privacy',0.3,'yearly'],
  ['/terms',0.3,'yearly']
];
export default function sitemap() {
  return entries.map(([path,priority,changeFrequency]) => ({
    url: base + path,
    changeFrequency,
    priority
  }));
}
