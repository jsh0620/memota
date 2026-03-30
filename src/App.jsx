import React, { useState } from 'react'
import { PlannerProvider, usePlanner } from './context/PlannerContext'
import Sidebar from './components/Sidebar'
import WeeklyPlanner from './components/WeeklyPlanner'
import AIGoalPage from './pages/AIGoalPage'
import AIAutoPage from './pages/AIAutoPage'
import VaultPage from './pages/VaultPage'
import AuthPage from './components/AuthPage'
import { getUser, isLoggedIn, logout } from './utils/authApi'

function AppInner({ user, onLogout }) {
  const { state } = usePlanner()
  const view = state.ui.view

  return (
    <div className="app-shell">
      {/* PC: 사이드바 / 모바일: 상단헤더만 */}
      <Sidebar onLogout={onLogout} user={user} />

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        {view === 'planner' && <WeeklyPlanner />}
        {view === 'ai-goal' && <AIGoalPage />}
        {view === 'ai-auto' && <AIAutoPage />}
        {view === 'vault'   && <VaultPage />}
      </main>

      {/* 모바일 하단 탭바 — main-content 아래에 배치 */}
      <BottomTabbar onLogout={onLogout} user={user} />
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(() => isLoggedIn() ? getUser() : null)
  function handleLogin(userData) { setUser(userData) }
  function handleLogout() { logout(); setUser(null) }
  if (!user) return <AuthPage onLogin={handleLogin} />
  return (
    <PlannerProvider user={user}>
      <AppInner user={user} onLogout={handleLogout} />
    </PlannerProvider>
  )
}

// 하단 탭바를 별도 컴포넌트로 분리
function BottomTabbar({ onLogout }) {
  const { state, dispatch } = usePlanner()
  const view = state.ui.view

  const setView = (v) => dispatch({ type: 'UI_VIEW', view: v })

  const tabs = [
    { id: 'planner',  label: '플래너',  Icon: IconPlanner },
    { id: 'ai-goal',  label: 'AI 계획', Icon: IconAIGoal },
    { id: 'ai-auto',  label: 'AI 분석', Icon: IconAIAuto },
    { id: 'vault',    label: '보관함',  Icon: IconVault },
  ]

  return (
    <nav className="mobile-tabbar">
      {tabs.map(({ id, label, Icon }) => {
        const active = view === id
        return (
          <button key={id} className={`mobile-tab ${active ? 'active' : ''}`} onClick={() => setView(id)}>
            <div className="tab-icon-wrap"><Icon active={active} /></div>
            <span className="mobile-tab-label">{label}</span>
          </button>
        )
      })}
      <button className="mobile-tab" onClick={onLogout}>
        <div className="tab-icon-wrap"><IconLogout /></div>
        <span className="mobile-tab-label">로그아웃</span>
      </button>
    </nav>
  )
}

// SVG 아이콘
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