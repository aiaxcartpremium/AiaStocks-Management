export type ProductKey = string;

export const PRODUCT_KEYS: ProductKey[] = [
  // entertainment
  'netflix','viu','vivamax','vivaone','vivabundle','disney+','bilibili','iqiyi','weTV','loklok','iwantTFC','amazon prime','crunchyroll','hbo max','youku','nba league pass',
  // streaming
  'spotify','youtube','apple music',
  // educational
  'studocu','scribd','grammarly','quillbot','ms365','quizlet+','camscanner','smallpdf','turnitin student','turnitin instructor','duolingo super',
  // editing
  'canva','picsart','capcut','remini web','alight motion',
  // ai
  'chatgpt','gemini ai','blackbox ai','perplexity'
];

export const ACCOUNT_TYPES = [
  'shared profile','solo profile','shared acc','solo acc'
] as const;

export const TERM_OPTIONS = [
  { label:'7 days', days:7 },
  { label:'14 days', days:14 },
  { label:'1 month', days:30 },
  { label:'2 months', days:60 },
  { label:'3 months', days:90 },
  { label:'4 months', days:120 },
  { label:'5 months', days:150 },
  { label:'6 months', days:180 },
  { label:'7 months', days:210 },
  { label:'8 months', days:240 },
  { label:'9 months', days:270 },
  { label:'10 months', days:300 },
  { label:'11 months', days:330 },
  { label:'12 months', days:360 },
];
