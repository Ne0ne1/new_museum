export type LocalizedText = { ru: string; ce: string }

export interface LifeEvent {
  date: string
  title: LocalizedText
  description: LocalizedText
}

export interface Person {
  id: string
  name: LocalizedText
  relation: LocalizedText
  years: string
  photo: string
  photoPosition?: string
  photoKind?: 'portrait' | 'book-page'
  photoSource?: { imageUrl: string; pageUrl: string; note: LocalizedText }
  parents: string[]
  spouses: string[]
  children: string[]
  shortBio: LocalizedText
  fullBio: LocalizedText
  keyDates: LifeEvent[]
  sources: { title: LocalizedText; url?: string; locator?: string }[]
  evidenceNote?: LocalizedText
  generation: number
  translationPending?: boolean
  status: 'verified-minimal' | 'demo' | 'source-review'
}
