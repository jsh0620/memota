import React, { useState, useRef } from 'react'
import { usePlanner } from '../context/PlannerContext'
import { DAYS, DAY_KO, getWeekDates, isToday, formatMonthDay } from '../utils/dateUtils'

// ── Task Item ──
function TaskItem({ task, weekKey, day }) {
  const { dispatch } = usePlanner()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(task.text)
  const inputRef = useRef(null)

  const toggle = () => dispatch({ type: 'TASK_TOGGLE', weekKey, day, id: task.id })
  const remove = () => dispatch({ type: 'TASK_DELETE', weekKey, day, id: task.id })

  const startEdit = () => {
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const commitEdit = () => {
    if (draft.trim()) dispatch({ type: 'TASK_EDIT', weekKey, day, id: task.id, text: draft.trim() })
    else setDraft(task.text)
    setEditing(false)
  }

  const onKey = e => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') { setDraft(task.text); setEditing(false) }
  }

  return (
    <div className={`task-item ${task.done ? 'done' : ''} ${task.fromAI ? 'ai-made' : ''}`}>
      <button className={`task-check-btn ${task.done ? 'checked' : ''}`} onClick={toggle}>
        {task.done && (
          <svg className="check-mark" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 5 4.5 8.5 11 1" />
          </svg>
        )}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          className="task-edit-input"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={onKey}
        />
      ) : (
        <span className="task-text" onDoubleClick={startEdit}>{task.text}</span>
      )}

      {task.fromAI && !editing && <span className="ai-pill">AI</span>}

      <button className="task-del-btn" onClick={remove} title="삭제">✕</button>
    </div>
  )
}

// ── Add Task Input ──
function AddTask({ weekKey, day }) {
  const { dispatch } = usePlanner()
  const [val, setVal] = useState('')

  const submit = () => {
    if (!val.trim()) return
    dispatch({ type: 'TASK_ADD', weekKey, day, text: val.trim() })
    setVal('')
  }

  return (
    <div className="add-task-wrap">
    <div className="add-task-row">
      <input
        className="add-task-input"
        placeholder="+ 할 일 추가"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit() }}
      />
      <button
        className="add-task-btn"
        onClick={submit}
        disabled={!val.trim()}
        title="추가"
      >+</button>
    </div>
    </div>
  )
}

// ── Day Column ──
function DayCol({ day, date, weekKey, tasks }) {
  const today    = isToday(date)
  const weekend  = day === 'sat' || day === 'sun'

  return (
    <div className={`day-col ${today ? 'is-today' : ''} ${weekend ? 'is-weekend' : ''}`}>
      <div className="day-head">
        <div className="day-name">
          {DAY_KO[day]}{today && <span className="today-dot" />}
        </div>
        <div className="day-date">{formatMonthDay(date)}</div>
      </div>
      <div className="task-area">
        {tasks.map(t => (
          <TaskItem key={t.id} task={t} weekKey={weekKey} day={day} />
        ))}
      </div>
      <AddTask weekKey={weekKey} day={day} />
    </div>
  )
}

// ── Main ──
export default function WeeklyPlanner() {
  const { state } = usePlanner()
  const { ui, plans } = state
  const { weekKey } = ui
  const dates = getWeekDates(weekKey)
  const wp    = plans[weekKey] ?? {}

  return (
    <>
      <div className="page-header">
        <div className="page-title">주간 플래너</div>
        <div className="page-sub">더블클릭으로 수정 · Enter로 추가</div>
      </div>
      <div className="planner-grid">
        {DAYS.map(day => (
          <DayCol
            key={day}
            day={day}
            date={dates[day]}
            weekKey={weekKey}
            tasks={wp[day] ?? []}
          />
        ))}
      </div>
    </>
  )
}
