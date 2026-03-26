import React from 'react'
import { PlannerProvider, usePlanner } from './context/PlannerContext'
import Sidebar from './components/Sidebar'
import WeeklyPlanner from './components/WeeklyPlanner'
import AIGoalPage from './pages/AIGoalPage'
import AIAutoPage from './pages/AIAutoPage'

function AppInner() {
  const { state } = usePlanner()
  const view = state.ui.view

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        {view === 'planner'  && <WeeklyPlanner />}
        {view === 'ai-goal'  && <AIGoalPage />}
        {view === 'ai-auto'  && <AIAutoPage />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <PlannerProvider>
      <AppInner />
    </PlannerProvider>
  )
}
