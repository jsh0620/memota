import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { getWeekKey } from '../utils/dateUtils'

const Ctx = createContext(null)

// ── localStorage helpers ──
const STORAGE_KEY = 'planai-v1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveState(state) {
  try {
    const { ui, ...persist } = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persist))
  } catch {}
}

// ── Initial state ──
const todayWk = getWeekKey()

function init() {
  const saved = loadState()
  return {
    // persisted
    plans: saved?.plans ?? {},        // { weekKey: { dayKey: Task[] } }
    aiHistory: saved?.aiHistory ?? [], // [{ id, type, createdAt, input, result }]
    // ui (not persisted)
    ui: {
      view: 'planner',               // 'planner' | 'ai-goal' | 'ai-auto'
      weekKey: todayWk,
    },
  }
}

// ── Reducer ──
function reducer(state, action) {
  switch (action.type) {

    case 'UI_VIEW': return { ...state, ui: { ...state.ui, view: action.view } }
    case 'UI_WEEK': return { ...state, ui: { ...state.ui, weekKey: action.weekKey } }

    case 'TASK_ADD': {
      const { weekKey, day, text } = action
      const prev = state.plans[weekKey]?.[day] ?? []
      const task = { id: `${Date.now()}`, text, done: false, createdAt: new Date().toISOString() }
      return {
        ...state,
        plans: {
          ...state.plans,
          [weekKey]: { ...state.plans[weekKey], [day]: [...prev, task] },
        },
      }
    }

    case 'TASK_TOGGLE': {
      const { weekKey, day, id } = action
      const tasks = state.plans[weekKey]?.[day] ?? []
      return {
        ...state,
        plans: {
          ...state.plans,
          [weekKey]: {
            ...state.plans[weekKey],
            [day]: tasks.map(t => t.id === id ? { ...t, done: !t.done } : t),
          },
        },
      }
    }

    case 'TASK_DELETE': {
      const { weekKey, day, id } = action
      const tasks = state.plans[weekKey]?.[day] ?? []
      return {
        ...state,
        plans: {
          ...state.plans,
          [weekKey]: {
            ...state.plans[weekKey],
            [day]: tasks.filter(t => t.id !== id),
          },
        },
      }
    }

    case 'TASK_EDIT': {
      const { weekKey, day, id, text } = action
      const tasks = state.plans[weekKey]?.[day] ?? []
      return {
        ...state,
        plans: {
          ...state.plans,
          [weekKey]: {
            ...state.plans[weekKey],
            [day]: tasks.map(t => t.id === id ? { ...t, text } : t),
          },
        },
      }
    }

    case 'AI_APPLY_WEEK': {
      // Apply AI result for a specific weekKey
      const { weekKey, dayTasks } = action  // dayTasks: { mon:[...], tue:[...], ... }
      const existing = state.plans[weekKey] ?? {}
      const merged = { ...existing }
      Object.entries(dayTasks).forEach(([day, texts]) => {
        const prev = merged[day] ?? []
        const newTasks = texts.map((text, i) => ({
          id: `ai-${Date.now()}-${i}`,
          text,
          done: false,
          createdAt: new Date().toISOString(),
          fromAI: true,
        }))
        merged[day] = [...prev, ...newTasks]
      })
      return { ...state, plans: { ...state.plans, [weekKey]: merged } }
    }

    case 'AI_HISTORY_ADD': {
      return {
        ...state,
        aiHistory: [action.entry, ...state.aiHistory].slice(0, 10),
      }
    }

    default: return state
  }
}

// ── Provider ──
export function PlannerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, init)

  useEffect(() => { saveState(state) }, [state])

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function usePlanner() { return useContext(Ctx) }
