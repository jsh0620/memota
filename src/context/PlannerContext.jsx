import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { getWeekKey } from '../utils/dateUtils'
import { fetchPlans, savePlans, isLoggedIn } from '../utils/authApi'

const Ctx = createContext(null)

const todayWk = getWeekKey()

function init() {
  const savedView = localStorage.getItem('planai-view') || 'planner'
  return {
    plans: {},
    aiHistory: [],
    ui: {
      view: savedView,
      weekKey: todayWk,
    },
    loaded: false,
  }
}

function reducer(state, action) {
  switch (action.type) {

    case 'PLANS_LOADED':
      return { ...state, plans: action.plans, loaded: true }

    case 'UI_VIEW':
      localStorage.setItem('planai-view', action.view)
      return { ...state, ui: { ...state.ui, view: action.view } }
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
      const { weekKey, dayTasks } = action
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

    case 'RESET':
      return init()

    default: return state
  }
}

export function PlannerProvider({ children, user }) {
  const [state, dispatch] = useReducer(reducer, null, init)
  const saveTimer = useRef(null)

  // 로그인 시 서버에서 플래너 불러오기
  useEffect(() => {
    if (!user) return
    fetchPlans()
      .then(plans => dispatch({ type: 'PLANS_LOADED', plans }))
      .catch(() => dispatch({ type: 'PLANS_LOADED', plans: {} }))
  }, [user])

  // 플랜 변경 시 서버에 자동 저장 (디바운스 2초)
  useEffect(() => {
    if (!state.loaded) return
    if (!isLoggedIn()) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      savePlans(state.plans).catch(console.error)
    }, 2000)
    return () => clearTimeout(saveTimer.current)
  }, [state.plans, state.loaded])

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function usePlanner() { return useContext(Ctx) }
