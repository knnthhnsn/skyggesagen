import Header from '../components/Header.jsx'
import Milo from '../components/Milo.jsx'
import DetectiveBoard from '../components/DetectiveBoard.jsx'
import Badge from '../components/Badge.jsx'
import Button from '../components/Button.jsx'
import { useGame } from '../context/GameContext.jsx'
import { SYMBOLS, BADGES, MILO_LINES, CASE_TITLE } from '../data/caseData.js'
import { HUB_NODES, TOTAL_CLUES, caseStatusFromState, caseStatusLabel, isNodeDone, isNodeUnlocked } from '../utils/progress.js'

export default function HubScreen({ go }) {
  const { state } = useGame()
  const symbol = SYMBOLS.find((s) => s.id === state.symbol) || SYMBOLS[0]
  const status = caseStatusFromState(state)
  const detective = state.detectiveName || 'Skyggespejder'

  const goodQuestions = isNodeDone('question', state) ? 1 : 0
  const cluesFound = state.foundClues?.length || 0
  const nextNode = HUB_NODES.find((node) => isNodeUnlocked(node.id, state) && !isNodeDone(node.id, state))
  const doneCount = HUB_NODES.filter((node) => isNodeDone(node.id, state)).length
  const badgeIds = Object.keys(BADGES)
  const earnedBadges = state.badges || []
  const nextBadgeId = badgeIds.find((id) => !earnedBadges.includes(id))

  return (
    <div className="screen screen-pad">
      <Header eyebrow={`Stil: ${symbol.label}`} name={detective} onBack={() => go('start')} />

      <div className="paper-warm fade-up" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Milo pose="neutral" size="md" bob />
        <div style={{ flex: 1 }}>
          <span className="eyebrow">Sagsmappe</span>
          <h2 className="title-screen" style={{ marginTop: 4 }}>{CASE_TITLE}</h2>
          <p className="lede" style={{ marginTop: 6, fontSize: 14 }}>{MILO_LINES.hub}</p>
        </div>
      </div>

      <div className="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <Stat label="Status" value={caseStatusLabel(status)} accent={status === 'opklaret' ? 'green' : 'blue'} />
        <Stat label="Spor fundet" value={`${cluesFound}/${TOTAL_CLUES}`} accent="blue" />
        <Stat label="Gode spørgsmål" value={`${goodQuestions}`} accent="purple" />
      </div>

      <NextStepCard node={nextNode} doneCount={doneCount} totalCount={HUB_NODES.length} go={go} />

      <DetectiveBoard go={go} />

      <div className="badge-case paper">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="eyebrow">Mærkesamling</span>
          <span className="tag tag-yellow">{earnedBadges.length}/{badgeIds.length}</span>
        </div>
        <p className="badge-case-hint">
          {earnedBadges.length > 0 ? 'Dine mærker viser, hvad du allerede har opklaret.' : 'Mærker låses op, når du undersøger sagen med skarpt blik.'}
        </p>
        {nextBadgeId && (
          <div className="badge-next" aria-label="Næste mærke">
            <span>Næste mærke</span>
            <strong>{BADGES[nextBadgeId].label}</strong>
            <p>{badgeUnlockHint(nextBadgeId)}</p>
          </div>
        )}
        <div className="badge-grid">
          {badgeIds.map((id) => {
            const badge = BADGES[id]
            const earned = earnedBadges.includes(id)
            return (
              <Badge
                key={id}
                title={earned ? badge.label : 'Låst mærke'}
                desc={earned ? badge.desc : badgeUnlockHint(id)}
                locked={!earned}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function badgeUnlockHint(id) {
  if (id === 'forste-spor') return 'Find dit første spor.'
  if (id === 'skarpt-blik') return 'Find alle spor i scenen.'
  if (id === 'godt-sporgsmal') return 'Find spørgsmålet, der åbner sagen.'
  if (id === 'skyggeopklarer') return 'Afslør skyggen.'
  if (id === 'sporgsmalsmester') return 'Forstå, hvorfor spørgsmål åbner sagen.'
  return 'Fortsæt efterforskningen.'
}

function NextStepCard({ node, doneCount, totalCount, go }) {
  if (!node) {
    return (
      <div className="next-step-card is-complete">
        <div className="next-step-copy">
          <span className="eyebrow">Næste skridt</span>
          <h2 className="title-screen">Sagen er samlet</h2>
          <p>Du har hele tråden. Kig i rapporten, eller gå tilbage til sagsmappen.</p>
        </div>
        <Milo pose="flying" size="sm" pulse />
      </div>
    )
  }

  return (
    <div className="next-step-card">
      <div className="next-step-copy">
        <span className="eyebrow">Næste skridt</span>
        <h2 className="title-screen">{node.label}</h2>
        <p>{nextStepHint(node.id)}</p>
        <div className="next-step-meter" aria-label={`${doneCount} af ${totalCount} trin er klaret`}>
          <span style={{ width: `${Math.round((doneCount / totalCount) * 100)}%` }} />
        </div>
      </div>
      <div className="next-step-action">
        <Milo pose="run" size="sm" bob />
        <Button variant="yellow" onClick={() => go(node.screen)}>
          Gå videre
        </Button>
      </div>
    </div>
  )
}

function nextStepHint(nodeId) {
  if (nodeId === 'briefing') return 'Start med Milos briefing, så du ved, hvad mysteriet handler om.'
  if (nodeId.startsWith('spor')) return 'Der er stadig skjulte spor i billedet. Brug lup-blikket.'
  if (nodeId === 'sort') return 'Sorter det, du ved, så gæt og beviser ikke bliver blandet sammen.'
  if (nodeId === 'question') return 'Find spørgsmålet, der åbner sagen i stedet for bare at gætte.'
  if (nodeId === 'explanation') return 'Saml forklaringen, så sagen får en rød tråd.'
  if (nodeId === 'reveal') return 'Nu kan du løfte skyggen og se, hvad sagen egentlig viser.'
  if (nodeId === 'report') return 'Skriv din egen detektivrapport og tag læringen med ud i hverdagen.'
  return 'Fortsæt efterforskningen sammen med Milo.'
}

function Stat({ label, value, accent = 'blue' }) {
  const colors = {
    blue: 'var(--milo-blue)',
    green: 'var(--evidence-green)',
    purple: 'var(--question-purple)',
    yellow: '#a8810f',
  }
  return (
    <div className="paper" style={{ padding: '10px 12px' }}>
      <span className="eyebrow" style={{ fontSize: 10 }}>{label}</span>
      <div style={{ marginTop: 4, fontWeight: 800, fontSize: 14, color: colors[accent] }}>{value}</div>
    </div>
  )
}
