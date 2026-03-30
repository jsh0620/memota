import React, { useState, useEffect } from 'react'
import { usePlanner } from '../context/PlannerContext'
import { prevWeekKey, nextWeekKey, formatWeekRange, todayDayKey } from '../utils/dateUtils'
import { getStoredApiKey } from '../utils/claudeApi'
import ApiKeyModal from './ApiKeyModal'

const NAV = [
  { id: 'planner',  icon: '📅', label: '플래너',      tooltip: '오늘 할 일을 요일별로 직접 관리하세요' },
  { id: 'ai-goal',  icon: '🤖', label: 'AI 계획 생성', tooltip: '목표와 기간을 입력하면 AI가 맞춤 계획을 설계해드립니다' },
  { id: 'ai-auto',  icon: '✨', label: 'AI 주간 분석', tooltip: '지난 플래너를 분석해 다음 주 계획을 자동으로 제안해드립니다' },
  { id: 'vault',    icon: '🗂', label: '보관함',       tooltip: '저장된 AI 계획을 보관하고 언제든 적용하세요' },
]

export default function Sidebar({ user, onLogout }) {
  const { state, dispatch } = usePlanner()
  const { ui, plans } = state
  const { view, weekKey } = ui
  const [showModal, setShowModal] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('planai-theme') || 'dark')

  const hasKey = Boolean(getStoredApiKey())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('planai-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  const setView = (v) => dispatch({ type: 'UI_VIEW', view: v })

  // 이번 주 달성률
  const wp = plans[weekKey] ?? {}
  const allTasks = Object.values(wp).flat()
  const total = allTasks.length
  const done  = allTasks.filter(t => t.done).length
  const pct   = total ? Math.round((done / total) * 100) : 0

  // 오늘 달성률
  const todayKey   = todayDayKey()
  const todayTasks = wp[todayKey] ?? []
  const todayTotal = todayTasks.length
  const todayDone  = todayTasks.filter(t => t.done).length
  const todayPct   = todayTotal ? Math.round((todayDone / todayTotal) * 100) : 0

  return (
    <>
      {/* ── 데스크탑 사이드바 ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="brand-name">memota</div>
            <button
              className={`theme-switch ${theme === 'light' ? 'is-light' : ''}`}
              onClick={toggleTheme}
              title="테마 변경"
              aria-label="테마 변경"
            >
              <span className="theme-switch-thumb">
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </button>
          </div>
          <div className="brand-sub">AI-POWERED PLANNER</div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">메뉴</div>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-btn ${view === n.id ? 'active' : ''}`}
              onClick={() => setView(n.id)}
              title={n.tooltip}
            >
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </div>

        {view === 'planner' && (
          <>
            <div className="week-stepper">
              <button className="week-arrow" onClick={() => dispatch({ type: 'UI_WEEK', weekKey: prevWeekKey(weekKey) })}>◀</button>
              <div className="week-label">{formatWeekRange(weekKey)}</div>
              <button className="week-arrow" onClick={() => dispatch({ type: 'UI_WEEK', weekKey: nextWeekKey(weekKey) })}>▶</button>
            </div>

            {total > 0 && (
              <div className="sidebar-stats">
                {todayTotal > 0 && (
                  <>
                    <div className="stats-row">
                      <span className="stats-title">오늘 달성률</span>
                      <span className="stats-pct" style={{ color: 'var(--green)' }}>{todayPct}%</span>
                    </div>
                    <div className="stats-bar">
                      <div className="stats-fill" style={{ width: `${todayPct}%`, background: 'var(--green)' }} />
                    </div>
                    <div className="stats-detail" style={{ marginBottom: 10 }}>{todayDone} / {todayTotal} 완료</div>
                  </>
                )}
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

        {/* 사용자 정보 + 로그아웃 */}
        <div className="sidebar-spacer" />
        <div className="sidebar-user">
          <div className="user-info">
            <span className="user-avatar">{user?.username?.[0]?.toUpperCase() ?? '?'}</span>
            <span className="user-name">{user?.username}</span>
          </div>
          <button className="logout-btn" onClick={onLogout} title="로그아웃">↩</button>
        </div>

        <div className="sidebar-footer">llama-3.3-70b · Groq</div>
      </aside>

      {/* ── 모바일 상단 헤더 ── */}
      <header className="mobile-header">
        <div className="mobile-header-brand">memota</div>
        <div className="mobile-header-right">
          {view === 'planner' && (
            <div className="mobile-week-nav">
              <button className="week-arrow" onClick={() => dispatch({ type: 'UI_WEEK', weekKey: prevWeekKey(weekKey) })}>◀</button>
              <span className="week-label" style={{ fontSize: 11 }}>{formatWeekRange(weekKey)}</span>
              <button className="week-arrow" onClick={() => dispatch({ type: 'UI_WEEK', weekKey: nextWeekKey(weekKey) })}>▶</button>
            </div>
          )}
          <button
            className={`theme-switch ${theme === 'light' ? 'is-light' : ''}`}
            onClick={toggleTheme}
            aria-label="테마 변경"
          >
            <span className="theme-switch-thumb">
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
          </button>
        </div>
      </header>

      {/* ── 모바일 하단 탭바 ── */}
      <nav className="mobile-tabbar">
        {NAV.map(n => (
          <button
            key={n.id}
            className={`mobile-tab ${view === n.id ? 'active' : ''}`}
            onClick={() => setView(n.id)}
          >
            <span className="mobile-tab-icon">{n.icon}</span>
            <span className="mobile-tab-label">{n.label}</span>
          </button>
        ))}
        <button
          key="vault"
          className={`mobile-tab ${view === 'vault' ? 'active' : ''}`}
          onClick={() => setView('vault')}
        >
          <span className="mobile-tab-icon">🗂</span>
          <span className="mobile-tab-label">보관함</span>
        </button>
        <button className="mobile-tab" onClick={onLogout}>
          <span className="mobile-tab-icon">↩</span>
          <span className="mobile-tab-label">로그아웃</span>
        </button>
      </nav>

      {showModal && <ApiKeyModal onClose={() => setShowModal(false)} />}
    </>
  )
}
