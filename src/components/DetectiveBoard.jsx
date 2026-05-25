import { useEffect, useRef, useState } from 'react'
import { HUB_NODES, isNodeUnlocked, isNodeDone } from '../utils/progress.js'
import { useGame } from '../context/GameContext.jsx'

/**
 * Detektivboardet på hub-skærmen. Vises som en pinboard med papirnoder.
 * Røde tråde tegnes som SVG mellem færdige noder.
 */
export default function DetectiveBoard({ go }) {
  const { state } = useGame()
  const boardRef = useRef(null)
  const nodeRefs = useRef({})
  const [paths, setPaths] = useState([])
  const currentNode = HUB_NODES.find((node) => isNodeUnlocked(node.id, state) && !isNodeDone(node.id, state))

  useEffect(() => {
    function recompute() {
      const board = boardRef.current
      if (!board) return
      const bRect = board.getBoundingClientRect()
      const next = []
      for (let i = 0; i < HUB_NODES.length - 1; i++) {
        const a = HUB_NODES[i]
        const b = HUB_NODES[i + 1]
        if (!isNodeDone(a.id, state) || !isNodeDone(b.id, state)) continue
        const elA = nodeRefs.current[a.id]
        const elB = nodeRefs.current[b.id]
        if (!elA || !elB) continue
        const rA = elA.getBoundingClientRect()
        const rB = elB.getBoundingClientRect()
        const x1 = rA.left - bRect.left + rA.width / 2
        const y1 = rA.top - bRect.top + rA.height / 2
        const x2 = rB.left - bRect.left + rB.width / 2
        const y2 = rB.top - bRect.top + rB.height / 2
        const cx = (x1 + x2) / 2 + ((i % 2 === 0) ? -16 : 16)
        const cy = (y1 + y2) / 2 + ((i % 2 === 0) ? 8 : -8)
        next.push(`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`)
      }
      setPaths(next)
    }
    recompute()
    const ro = new ResizeObserver(recompute)
    if (boardRef.current) ro.observe(boardRef.current)
    window.addEventListener('resize', recompute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recompute)
    }
  }, [state])

  return (
    <div className="board" ref={boardRef}>
      <svg className="board-threads" aria-hidden="true">
        {paths.map((d, i) => <path key={i} d={d} />)}
      </svg>
      <div className="board-grid">
        {HUB_NODES.map((n) => {
          const unlocked = isNodeUnlocked(n.id, state)
          const done = isNodeDone(n.id, state)
          const current = currentNode?.id === n.id
          const meta = done ? 'Klaret' : current ? 'Næste' : unlocked ? 'Åben' : 'Låst'
          return (
            <button
              key={n.id}
              ref={(el) => { nodeRefs.current[n.id] = el }}
              className={`board-node${unlocked ? '' : ' is-locked'}${done ? ' is-done' : ''}${current ? ' is-current' : ''}`}
              onClick={() => unlocked && go(n.screen)}
              aria-disabled={!unlocked}
              aria-label={`${n.label}. ${meta}${!unlocked ? `. ${unlockHint(n.id)}` : ''}`}
              aria-current={current ? 'step' : undefined}
              disabled={!unlocked}
            >
              <span className="pin" aria-hidden="true" />
              <span className="board-node-meta">
                {meta}
              </span>
              <span className="board-node-label">{n.label}</span>
              {!unlocked && <span className="board-node-hint">{unlockHint(n.id)}</span>}
              {!unlocked && <span className="lock-tape" aria-hidden="true" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function unlockHint(nodeId) {
  if (nodeId.startsWith('spor')) return 'Læs briefingen først.'
  if (nodeId === 'sort') return 'Find alle spor.'
  if (nodeId === 'question') return 'Sorter alle kort.'
  if (nodeId === 'explanation') return 'Find det gode spørgsmål.'
  if (nodeId === 'reveal') return 'Byg forklaringen.'
  if (nodeId === 'report') return 'Afslør skyggen.'
  return 'Fortsæt sagen.'
}
