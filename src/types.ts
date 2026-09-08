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
  photoSource?: { imageUrl: string; pageUrl: string; note: LocalizedText }
  parents: string[]
  spouses: string[]
  children: string[]
  shortBio: LocalizedText
  fullBio: LocalizedText
  keyDates: LifeEvent[]
  sources: { title: LocalizedText; url?: string }[]
  generation: number
  status: 'verified-minimal' | 'demo'
}
