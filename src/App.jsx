import React, { useState, useEffect } from 'react'
import { PlannerProvider, usePlanner } from './context/PlannerContext'
import Sidebar from './components/Sidebar'
import WeeklyPlanner from './components/WeeklyPlanner'
import AIGoalPage from './pages/AIGoalPage'
import AIAutoPage from './pages/AIAutoPage'
import AuthPage from './components/AuthPage'
import { getUser, isLoggedIn, logout } from './utils/authApi'

function AppInner({ user, onLogout }) {
  const { state, dispatch } = usePlanner()
  const view = state.ui.view

  return (
    <div className="app-shell">
      <Sidebar onLogout={onLogout} user={user} />
      <main className="main-content">
        {view === 'planner'  && <WeeklyPlanner />}
        {view === 'ai-goal'  && <AIGoalPage />}
        {view === 'ai-auto'  && <AIAutoPage />}
      </main>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(() => isLoggedIn() ? getUser() : null)

  function handleLogin(userData) {
    setUser(userData)
  }

  function handleLogout() {
    logout()
    setUser(null)
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />
  }

  return (
    <PlannerProvider user={user}>
      <AppInner user={user} onLogout={handleLogout} />
    </PlannerProvider>
  )
}
