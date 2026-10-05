import type { LocalizedText, Person } from '../types'

const text = (ru: string): LocalizedText => ({ ru, ce: ru })
const report = (locator: string) => ({
  title: text('«Родословная Ахмата-Хаджи Кадырова». Отчёт по восьми книгам, 01.10.2026'),
  locator,
})

const makePerson = (id: string, name: string, relation: string, generation: number, bio: string, sources: Person['sources']): Person => ({
  id, generation, name: text(name), relation: text(relation), years: 'Даты жизни не установлены',
  photo: '/portraits/placeholder.png', parents: [], spouses: [], children: [],
  shortBio: text(bio), fullBio: text(bio), keyDates: [], sources,
  status: 'verified-minimal', translationPending: true,
})

export const collateralFamily: Person[] = [
  {
    ...makePerson(
      'hamid', 'Хамид Абдулхамидович Кадыров', 'Младший брат Ахмата-Хаджи', 4,
      'Младший брат Ахмата-Хаджи Кадырова. Родство прямо указано в подписи к портрету в книге «Светлый. Чистый. Вечный». Другие биографические сведения и даты жизни пока не установлены.',
      [report('С. 3 и 12; книга [08], печатная с. 204, PDF 202.')],
    ),
    parents: ['abdulkhamid', 'dika'],
  },
  makePerson(
    'zhabrail', 'Джабраил Кадыров', 'Двоюродный дядя Ахмата-Хаджи', 3,
    'Двоюродный дядя Ахмата-Хаджи Кадырова. В книге «Родина — песнь моя» охарактеризован как знаток чеченского языка и арабской грамоты. Его родители и точное место в разветвлённом древе пока не установлены.',
    [report('С. 3 и 7; книга [02], печатная с. 14, PDF 16.')],
  ),
  {
    ...makePerson(
      'hozh-akhmed', 'Хож-Ахмед Кадыров', 'Двоюродный брат Ахмата-Хаджи', 4,
      'Двоюродный брат Ахмата-Хаджи Кадырова. Подпись к портрету называет его учёным-теологом и имамом центральной мечети села Ахмат-Юрт. Его родители и точная промежуточная связь в родословной требуют подтверждения.',
      [report('С. 3 и 11; книга [08], печатная с. 200, PDF 198.')],
    ),
    photo: '/portraits/hozh-akhmed-book-page.jpg',
    photoKind: 'book-page',
    photoSource: {
      imageUrl: 'Встроенное изображение страницы 200 книги «Светлый. Чистый. Вечный»',
      pageUrl: 'Родословная_Ахмата_Хаджи_Кадырова.pdf#page=11',
      note: text('Локальная копия подписанного портрета из предоставленного PDF. Право использования требуется проверить перед публикацией.'),
    },
    evidenceNote: text('Карточка показана как боковая ветвь без вымышленных родителей.'),
  },
]
