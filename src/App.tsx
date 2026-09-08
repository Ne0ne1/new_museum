import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Info, Languages, Maximize, X } from 'lucide-react'
import { people } from './data/people'
import type { Person } from './types'

type Lang = 'ru' | 'ce'
const copy = {
  ru: { title: 'Семейное древо', subtitle: 'Ахмата-Хаджи Кадырова', verified: 'Минимальные проверенные сведения', demo: 'Демонстрационные данные — требуется подтверждение музеем', info: 'Нажмите на карточку, чтобы открыть биографию', bio: 'Биография', dates: 'Ключевые даты', sources: 'Источники', close: 'Закрыть', center: 'К центру', fullscreen: 'На весь экран', generation: 'Поколение' },
  ce: { title: 'Доьзалан дитт', subtitle: 'Къадири Ахьмад-Хьаьжин', verified: 'Лакхара хаамаш', demo: 'Музейн тӀечӀагӀдаре эш', info: 'Биографи схьайолла карточка тӀе таӀайе', bio: 'Биографи', dates: 'Коьрта ханаш', sources: 'Хьостанаш', close: 'ДӀакъовла', center: 'Юккъе', fullscreen: 'Экран дуьззина', generation: 'ТӀаьхье' },
}

const positions: Record<string, [number, number]> = {
  'ancestor-1': [360, 8], 'ancestor-2': [800, 8], 'parent-1': [580, 198],
  akhmat: [410, 388], 'spouse-demo': [750, 388], 'child-1': [100, 594],
  'child-2': [520, 594], 'child-3': [940, 594], 'grandchild-1': [100, 800], 'grandchild-2': [940, 800],
}

const TREE_WIDTH = 1380
const TREE_HEIGHT = 972
const MIN_SCALE = 0.48
const MAX_SCALE = 1.35

function App() {
  const [lang, setLang] = useState<Lang>('ru')
  const [selected, setSelected] = useState<Person | null>(null)
  const [scale, setScale] = useState(0.8)
  const [offset, setOffset] = useState({ x: 0, y: 18 })
  const viewportRef = useRef<HTMLElement | null>(null)
  const dragging = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ distance: number; scale: number; centerX: number; centerY: number; offsetX: number; offsetY: number } | null>(null)
  const t = copy[lang]

  const connections = useMemo(() => people.flatMap(person => person.children.map(child => [person.id, child] as const)), [])
  const fitTree = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const fittedScale = Math.max(MIN_SCALE, Math.min(1, (viewport.clientWidth - 56) / TREE_WIDTH, (viewport.clientHeight - 72) / TREE_HEIGHT))
    setScale(fittedScale)
    setOffset({
      x: Math.max(28, (viewport.clientWidth - TREE_WIDTH * fittedScale) / 2),
      y: Math.max(24, (viewport.clientHeight - TREE_HEIGHT * fittedScale) / 2),
    })
  }, [])
  const keepTreeInReach = useCallback((next: { x: number; y: number }, nextScale: number) => {
    const viewport = viewportRef.current
    if (!viewport) return next
    const visibleEdge = 120
    const minX = Math.min(visibleEdge - TREE_WIDTH * nextScale, viewport.clientWidth - visibleEdge)
    const maxX = Math.max(visibleEdge - TREE_WIDTH * nextScale, viewport.clientWidth - visibleEdge)
    const minY = Math.min(visibleEdge - TREE_HEIGHT * nextScale, viewport.clientHeight - visibleEdge)
    const maxY = Math.max(visibleEdge - TREE_HEIGHT * nextScale, viewport.clientHeight - visibleEdge)
    return { x: Math.min(maxX, Math.max(minX, next.x)), y: Math.min(maxY, Math.max(minY, next.y)) }
  }, [])

  const pointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 1) dragging.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      const rect = viewportRef.current?.getBoundingClientRect()
      pinch.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y), scale,
        centerX: (a.x + b.x) / 2 - (rect?.left ?? 0), centerY: (a.y + b.y) / 2 - (rect?.top ?? 0),
        offsetX: offset.x, offsetY: offset.y,
      }
    }
  }
  const pointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()]
      const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinch.current.scale * Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.distance))
      const ratio = nextScale / pinch.current.scale
      setScale(nextScale)
      setOffset(keepTreeInReach({ x: pinch.current.centerX - (pinch.current.centerX - pinch.current.offsetX) * ratio, y: pinch.current.centerY - (pinch.current.centerY - pinch.current.offsetY) * ratio }, nextScale))
    } else if (dragging.current) setOffset(keepTreeInReach({ x: dragging.current.ox + e.clientX - dragging.current.x, y: dragging.current.oy + e.clientY - dragging.current.y }, scale))
  }
  const pointerUp = (e: React.PointerEvent) => { pointers.current.delete(e.pointerId); dragging.current = null; pinch.current = null }
  const wheelZoom = (e: React.WheelEvent) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const cursorX = e.clientX - rect.left
    const cursorY = e.clientY - rect.top
    const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * Math.exp(-e.deltaY * 0.0012)))
    const ratio = nextScale / scale
    setScale(nextScale)
    setOffset(keepTreeInReach({ x: cursorX - (cursorX - offset.x) * ratio, y: cursorY - (cursorY - offset.y) * ratio }, nextScale))
  }
  useEffect(() => {
    const close = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close)
  }, [])
  useEffect(() => {
    fitTree()
    window.addEventListener('resize', fitTree)
    return () => window.removeEventListener('resize', fitTree)
  }, [fitTree])

  return <main className="museum-shell">
    <header className="topbar">
      <div className="brand-mark" aria-hidden="true">ЧГУ</div>
      <div className="heading"><p>{t.title}</p><h1>{t.subtitle}</h1></div>
      <div className="header-actions">
        <button className="language" onClick={() => setLang(lang === 'ru' ? 'ce' : 'ru')} aria-label="Переключить язык"><Languages size={22}/><span>{lang === 'ru' ? 'РУС' : 'НОХ'}</span></button>
        <button className="icon-button" onClick={() => document.documentElement.requestFullscreen?.()} aria-label={t.fullscreen}><Maximize/></button>
      </div>
    </header>

    <section ref={viewportRef} className="tree-viewport" onWheel={wheelZoom} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
      <div className="tree-canvas" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}>
        <svg className="connections" viewBox={`0 0 ${TREE_WIDTH} ${TREE_HEIGHT}`} aria-hidden="true">
          {connections.map(([from, to]) => { const a = positions[from], b = positions[to]; const aWidth = from === 'akhmat' ? 240 : 220; const bWidth = to === 'akhmat' ? 240 : 220; return <path key={`${from}-${to}`} d={`M ${a[0]+aWidth/2} ${a[1]+148} C ${a[0]+aWidth/2} ${a[1]+170}, ${b[0]+bWidth/2} ${b[1]-24}, ${b[0]+bWidth/2} ${b[1]}`} /> })}
          <path className="spouse-line" d="M 650 462 L 750 462" />
        </svg>
        {people.map(person => {
          const [x, y] = positions[person.id]
          return <button
            key={person.id}
            className={`person-card ${person.id === 'akhmat' ? 'central' : ''}`}
            style={{ left: x, top: y }}
            onPointerDown={event => event.stopPropagation()}
            onPointerUp={event => { event.stopPropagation(); setSelected(person) }}
            onClick={event => { if (event.detail === 0) setSelected(person) }}
          >
            <img src={person.photo} alt="" draggable={false} style={{ objectPosition: person.photoPosition ?? '50% 50%' }}/>
            <span className="person-copy"><strong>{person.name[lang]}</strong><small>{person.years}</small><em>{person.relation[lang]}</em></span>
            <span className={`status ${person.status}`}>{person.status === 'demo' ? t.demo : t.verified}</span>
            <ChevronRight className="card-arrow" size={20}/>
          </button>
        })}
      </div>

      <div className="hint"><Info size={20}/><span>{t.info}</span></div>
    </section>

    {selected && <div className="modal-backdrop" role="presentation" onPointerDown={e => e.target === e.currentTarget && setSelected(null)}>
      <article className="bio-modal" role="dialog" aria-modal="true" aria-labelledby="bio-name">
        <button className="modal-close" onClick={() => setSelected(null)} aria-label={t.close}><X/></button>
        <aside className="portrait-panel">
          <button className="modal-back" onClick={() => setSelected(null)}><ChevronLeft/>{t.close}</button>
          <img src={selected.photo} alt={selected.name[lang]} style={{ objectPosition: selected.photoPosition ?? '50% 50%' }}/>
          <span className={`status ${selected.status}`}>{selected.status === 'demo' ? t.demo : t.verified}</span>
        </aside>
        <div className="bio-content">
          <p className="eyebrow">{selected.relation[lang]}</p>
          <h2 id="bio-name">{selected.name[lang]}</h2><p className="years">{selected.years}</p>
          <p className="full-bio">{selected.fullBio[lang]}</p>
          <section><h3>{t.dates}</h3><div className="timeline">{selected.keyDates.map((event, i) => <div className="event" key={i}><time>{event.date}</time><div><strong>{event.title[lang]}</strong><p>{event.description[lang]}</p></div></div>)}</div></section>
        </div>
      </article>
    </div>}
  </main>
}

export default App
