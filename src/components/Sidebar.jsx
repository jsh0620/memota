import React, { useState, useEffect } from 'react'
import { usePlanner } from '../context/PlannerContext'
import { prevWeekKey, nextWeekKey, formatWeekRange, todayDayKey } from '../utils/dateUtils'
import { getStoredApiKey } from '../utils/claudeApi'
import ApiKeyModal from './ApiKeyModal'

const NAV = [
  { id: 'planner',  label: '플래너',      tooltip: '오늘 할 일을 요일별로 직접 관리하세요' },
  { id: 'ai-goal',  label: 'AI 계획 생성', tooltip: '목표와 기간을 입력하면 AI가 맞춤 계획을 설계해드립니다' },
  { id: 'ai-auto',  label: 'AI 주간 분석', tooltip: '지난 플래너를 분석해 다음 주 계획을 자동으로 제안해드립니다' },
  { id: 'vault',    label: '보관함',       tooltip: '저장된 AI 계획을 보관하고 언제든 적용하세요' },
]

// SVG 아이콘 컴포넌트
function IconPlanner({ active }) {
  const c = active ? 'var(--gold)' : 'var(--tx-3)'
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="8" y1="4" x2="8" y2="2"/>
      <line x1="16" y1="4" x2="16" y2="2"/>
      <line x1="7" y1="14" x2="11" y2="14"/>
      <line x1="7" y1="17" x2="13" y2="17"/>
    </svg>
  )
}
function IconAIGoal({ active }) {
  const c = active ? 'var(--gold)' : 'var(--tx-3)'
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="12" cy="12" r="1.5" fill={c} stroke="none"/>
      <line x1="12" y1="2" x2="12" y2="4"/>
      <line x1="12" y1="20" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="4" y2="12"/>
      <line x1="20" y1="12" x2="22" y2="12"/>
    </svg>
  )
}
function IconAIAuto({ active }) {
  const c = active ? 'var(--gold)' : 'var(--tx-3)'
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9L12 2Z"/>
    </svg>
  )
}
function IconVault({ active }) {
  const c = active ? 'var(--gold)' : 'var(--tx-3)'
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <circle cx="12" cy="12" r="3"/>
      <line x1="2" y1="9" x2="22" y2="9"/>
      <line x1="6" y1="4" x2="6" y2="9"/>
    </svg>
  )
}
function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--tx-3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

const ICONS = {
  'planner': IconPlanner,
  'ai-goal': IconAIGoal,
  'ai-auto': IconAIAuto,
  'vault':   IconVault,
}

export default function Sidebar({ user, onLogout }) {
  const { state, dispatch } = usePlanner()
  const { ui, plans } = state
  const { view, weekKey } = ui
  const [showModal, setShowModal] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('planai-theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('planai-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  const setView = (v) => dispatch({ type: 'UI_VIEW', view: v })

  const wp = plans[weekKey] ?? {}
  const allTasks = Object.values(wp).flat()
  const total = allTasks.length
  const done  = allTasks.filter(t => t.done).length
  const pct   = total ? Math.round((done / total) * 100) : 0

  const todayKey   = todayDayKey()
  const todayTasks = wp[todayKey] ?? []
  const todayTotal = todayTasks.length
  const todayDone  = todayTasks.filter(t => t.done).length
  const todayPct   = todayTotal ? Math.round((todayDone / todayTotal) * 100) : 0

  return (
    <>
      {/* ── PC 사이드바 ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div>
            <div className="brand-name">memota</div>
            <div className="brand-sub">AI-POWERED PLANNER</div>
          </div>
          <button className={`theme-switch ${theme==='light'?'is-light':''}`} onClick={toggleTheme} aria-label="테마 변경">
            <span className="theme-switch-thumb">{theme==='dark'?'🌙':'☀️'}</span>
          </button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">메뉴</div>
          {NAV.map(n => {
            const Icon = ICONS[n.id]
            return (
              <button key={n.id} className={`nav-btn ${view===n.id?'active':''}`} onClick={() => setView(n.id)} title={n.tooltip}>
                <span className="nav-icon"><Icon active={view===n.id}/></span>
                <span>{n.label}</span>
              </button>
            )
          })}
        </div>

        {view === 'planner' && (
          <>
            <div className="week-stepper">
              <button className="week-arrow" onClick={() => dispatch({ type:'UI_WEEK', weekKey: prevWeekKey(weekKey) })}>◀</button>
              <div className="week-label">{formatWeekRange(weekKey)}</div>
              <button className="week-arrow" onClick={() => dispatch({ type:'UI_WEEK', weekKey: nextWeekKey(weekKey) })}>▶</button>
            </div>
            {total > 0 && (
              <div className="sidebar-stats">
                {todayTotal > 0 && (
                  <>
                    <div className="stats-row">
                      <span className="stats-title">오늘 달성률</span>
                      <span className="stats-pct" style={{ color:'var(--green)' }}>{todayPct}%</span>
                    </div>
                    <div className="stats-bar"><div className="stats-fill" style={{ width:`${todayPct}%`, background:'var(--green)' }}/></div>
                    <div className="stats-detail" style={{ marginBottom:8 }}>{todayDone} / {todayTotal} 완료</div>
                  </>
                )}
                <div className="stats-row">
                  <span className="stats-title">이번 주 달성률</span>
                  <span className="stats-pct">{pct}%</span>
                </div>
                <div className="stats-bar"><div className="stats-fill" style={{ width:`${pct}%` }}/></div>
                <div className="stats-detail">{done} / {total} 완료</div>
              </div>
            )}
          </>
        )}

        <div className="sidebar-spacer"/>

        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase() ?? '?'}</div>
            <span className="user-name">{user?.username}</span>
          </div>
          <button className="logout-btn" onClick={onLogout} title="로그아웃">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
        <div className="sidebar-footer">llama-3.3-70b · Groq</div>
      </aside>

      {/* ── 모바일 상단 헤더 ── */}
      <header className="mobile-header">
        <div className="mobile-header-brand">memota</div>
        <div className="mobile-header-right">
          {view === 'planner' && (
            <div className="mobile-week-nav">
              <button className="week-arrow" onClick={() => dispatch({ type:'UI_WEEK', weekKey: prevWeekKey(weekKey) })}>◀</button>
              <span className="week-label" style={{ fontSize:11 }}>{formatWeekRange(weekKey)}</span>
              <button className="week-arrow" onClick={() => dispatch({ type:'UI_WEEK', weekKey: nextWeekKey(weekKey) })}>▶</button>
            </div>
          )}
          <button className={`theme-switch ${theme==='light'?'is-light':''}`} onClick={toggleTheme} aria-label="테마 변경">
            <span className="theme-switch-thumb">{theme==='dark'?'🌙':'☀️'}</span>
          </button>
        </div>
      </header>

      {/* ── 모바일 하단 탭바 ── */}
      <nav className="mobile-tabbar">
        {NAV.map(n => {
          const Icon = ICONS[n.id]
          const active = view === n.id
          return (
            <button key={n.id} className={`mobile-tab ${active?'active':''}`} onClick={() => setView(n.id)}>
              <div className="tab-icon-wrap"><Icon active={active}/></div>
              <span className="mobile-tab-label">{n.label}</span>
            </button>
          )
        })}
        <button className="mobile-tab" onClick={onLogout}>
          <div className="tab-icon-wrap"><IconLogout/></div>
          <span className="mobile-tab-label">로그아웃</span>
        </button>
      </nav>

      {showModal && <ApiKeyModal onClose={() => setShowModal(false)}/>}
    </>
  )
}
