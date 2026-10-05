import type { LocalizedText, Person } from '../types'

// Russian text is used as a visible fallback until a museum-approved Chechen translation is supplied.
const text = (ru: string): LocalizedText => ({ ru, ce: ru })

const familyFoundation = {
  title: text('РОФ имени Героя России А. Кадырова. Биографическая справка об Аймани Кадыровой'),
  url: 'https://www.fondkadyrova.ru/o-aimani-kadyrovoi.html',
  locator: 'Строки «Дети»: Зарган (1971), Зулай (1972), Зелимхан (1974), Рамзан (1976); выше указаны дата рождения Аймани и брак с Ахматом Кадыровым в 1970 году.',
}

const genealogyReport = (locator: string) => ({
  title: text('«Родословная Ахмата-Хаджи Кадырова». Отчёт по восьми книгам, 01.10.2026'),
  locator,
})

const zelimkhanMemory = {
  title: text('«Грозный-информ», 26.10.2018. Воспоминания Рамзана Кадырова о старшем брате Зелимхане'),
  url: 'https://www.grozny-inform.ru/news/society/101705/',
  locator: 'Зелимхан прямо назван старшим братом Рамзана и соратником их отца Ахмата-Хаджи; из даты публикации и указанного возраста следуют годы 1974–2004.',
}

const person = (
  id: string,
  name: string,
  relation: string,
  years: string,
  bio: string,
  sources: Person['sources'],
): Person => ({
  id,
  generation: id === 'aimani' ? 4 : 5,
  name: text(name),
  relation: text(relation),
  years,
  photo: '/portraits/placeholder.png',
  parents: [],
  spouses: [],
  children: [],
  shortBio: text(bio),
  fullBio: text(bio),
  keyDates: [],
  sources,
  status: 'verified-minimal',
  translationPending: true,
})

export const immediateFamily: Person[] = [
  {
    ...person(
      'aimani',
      'Аймани Несиевна Кадырова',
      'Супруга Ахмата-Хаджи',
      '1953',
      'Супруга Ахмата-Хаджи Кадырова с 1970 года. Родилась 4 августа 1953 года в станице Кургамыс Павлодарской области. После гибели мужа возглавила Региональный общественный фонд его имени.',
      [familyFoundation, genealogyReport('С. 3, 4 и 9: урождённая Байсултанова; брак в 1970 году; четверо детей.')],
    ),
    spouses: ['akhmat'],
    children: ['zargan', 'zulay', 'zelimkhan', 'child-1'],
    keyDates: [
      { date: '04.08.1953', title: text('Рождение'), description: text('Станица Кургамыс, Павлодарская область.') },
      { date: '1970', title: text('Семья'), description: text('Стала супругой Ахмата Абдулхамидовича Кадырова.') },
      { date: '05.2004', title: text('Общественная деятельность'), description: text('Возглавила Региональный общественный фонд имени Ахмата Кадырова.') },
    ],
  },
  {
    ...person(
      'zargan',
      'Зарган Ахматовна Кадырова',
      'Дочь Ахмата-Хаджи',
      '1971',
      'Дочь Ахмата-Хаджи и Аймани Кадыровых. В официальной биографической справке Фонда имени Ахмата Кадырова указана первой в списке их детей, 1971 года рождения.',
      [familyFoundation, genealogyReport('С. 3, 4 и 9: дочь; 1971 год следует из последовательности событий после свадьбы в 1970 году.')],
    ),
    parents: ['akhmat', 'aimani'],
  },
  {
    ...person(
      'zulay',
      'Зулай Ахматовна Кадырова',
      'Дочь Ахмата-Хаджи',
      '1972',
      'Дочь Ахмата-Хаджи и Аймани Кадыровых. Официальная биографическая справка Фонда имени Ахмата Кадырова указывает 1972 год рождения.',
      [familyFoundation, genealogyReport('С. 3, 4 и 9: дочь, 1972 год рождения.')],
    ),
    parents: ['akhmat', 'aimani'],
  },
  {
    ...person(
      'zelimkhan',
      'Зелимхан Ахматович Кадыров',
      'Сын Ахмата-Хаджи',
      '1974–2004',
      'Старший сын Ахмата-Хаджи и Аймани Кадыровых, старший брат Рамзана Кадырова. В опубликованных воспоминаниях Рамзана Кадырова назван соратником и опорой отца.',
      [familyFoundation, zelimkhanMemory, genealogyReport('С. 3, 4 и 9: сын, 1974–2004.')],
    ),
    parents: ['akhmat', 'aimani'],
    keyDates: [
      { date: '1974', title: text('Рождение'), description: text('Год указан в официальной справке Фонда имени Ахмата Кадырова.') },
      { date: '2004', title: text('Смерть'), description: text('Год следует из опубликованных в 2018 году воспоминаний о четырнадцатой годовщине смерти.') },
    ],
  },
]
