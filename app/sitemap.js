const base='https://atsnexa.com';
const pages=[['/',1,'weekly'],['/ats-resume-checker',.9,'monthly'],['/resume-builder',.9,'monthly'],['/resume-templates',.8,'monthly'],['/ai-tools',.9,'monthly'],['/pricing',.7,'monthly'],['/products',.8,'weekly'],['/guides',.7,'weekly'],['/about',.5,'monthly'],['/contact',.4,'monthly'],['/privacy',.3,'yearly'],['/terms',.3,'yearly']];
export default function sitemap(){return pages.map(([path,priority,changeFrequency])=>({url:base+path,priority,changeFrequency}));}
