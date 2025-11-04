export type CategoryKey = 'entertainment'|'streaming'|'educational'|'editing'|'ai'

export const CATEGORIES: {key:CategoryKey,label:string}[] = [
  { key:'entertainment', label:'Entertainment' },
  { key:'streaming',     label:'Streaming' },
  { key:'educational',   label:'Educational' },
  { key:'editing',       label:'Editing' },
  { key:'ai',            label:'AI' },
]

export const PRODUCTS: Record<CategoryKey,string[]> = {
  entertainment: ['netflix','viu','vivamax','vivaone','vivabundle','disney+','bilibili','iqiyi','weTV','loklok','iwantTFC','amazon prime','crunchyroll','hbo max','youku','nba league pass'],
  streaming:     ['spotify','youtube','apple music'],
  educational:   ['studocu','scribd','grammarly','quillbot','ms365','quizlet+','camscanner','smallpdf','turnitin student','turnitin instructor','duolingo super'],
  editing:       ['canva','picsart','capcut','remini web','alight motion'],
  ai:            ['chatgpt','gemini ai','blackbox ai','perplexity']
}

export const ACCOUNT_TYPES = [
  'shared profile','solo profile','shared acc','solo acc'
] as const

export function shortId(id:string){ return id ? id.slice(0,6) : '-' }
