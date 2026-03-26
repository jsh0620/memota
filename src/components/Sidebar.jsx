import React from 'react'
import { usePlanner } from '../context/PlannerContext'
import { prevWeekKey, nextWeekKey, formatWeekRange } from '../utils/dateUtils'

const NAV = [
  { id: 'planner',  icon: '📅', label: '주간 플래너' },
  { id: 'ai-goal',  icon: '🎯', label: 'AI 목표 플래너' },
  { id: 'ai-auto',  icon: '✨', label: 'AI 자동 플래너' },
]

export default function Sidebar() {
  const { state, dispatch } = usePlanner()
  const { ui, plans } = state
  const { view, weekKey } = ui

  // stats for current week
  const wp = plans[weekKey] ?? {}
  const allTasks = Object.values(wp).flat()
  const total = allTasks.length
  const done  = allTasks.filter(t => t.done).length
  const pct   = total ? Math.round((done / total) * 100) : 0

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-name">PLANAI</div>
        <div className="brand-sub">AI-POWERED PLANNER</div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">메뉴</div>
        {NAV.map(n => (
          <button
            key={n.id}
            className={`nav-btn ${view === n.id ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'UI_VIEW', view: n.id })}
          >
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </div>

      {view === 'planner' && (
        <>
          <div className="week-stepper">
            <button
              className="week-arrow"
              onClick={() => dispatch({ type: 'UI_WEEK', weekKey: prevWeekKey(weekKey) })}
            >◀</button>
            <div className="week-label">{formatWeekRange(weekKey)}</div>
            <button
              className="week-arrow"
              onClick={() => dispatch({ type: 'UI_WEEK', weekKey: nextWeekKey(weekKey) })}
            >▶</button>
          </div>

          {total > 0 && (
            <div className="sidebar-stats">
              <div className="stats-row">
                <span className="stats-title">이번 주 달성률</span>
                <span className="stats-pct">{pct}%</span>
              </div>
              <div className="stats-bar">
                <div className="stats-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="stats-detail">{done} / {total} 완료</div>
            </div>
          )}
        </>
      )}

      <div className="sidebar-footer">Claude API · claude-sonnet-4</div>
    </aside>
  )
}
