import React, { useState, useRef } from 'react'
import { usePlanner } from '../context/PlannerContext'
import { DAYS, DAY_KO, DAY_FULL_KO, getWeekDates, isToday, formatMonthDay, todayDayKey } from '../utils/dateUtils'

function TaskItem({ task, weekKey, day }) {
  const { dispatch } = usePlanner()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(task.text)
  const inputRef = useRef(null)

  const toggle = () => dispatch({ type:'TASK_TOGGLE', weekKey, day, id:task.id })
  const remove = () => dispatch({ type:'TASK_DELETE', weekKey, day, id:task.id })
  const startEdit = () => { setEditing(true); setTimeout(() => inputRef.current?.focus(), 0) }
  const commitEdit = () => {
    if (draft.trim()) dispatch({ type:'TASK_EDIT', weekKey, day, id:task.id, text:draft.trim() })
    else setDraft(task.text)
    setEditing(false)
  }
  const onKey = e => { if (e.key==='Enter') commitEdit(); if (e.key==='Escape') { setDraft(task.text); setEditing(false) } }

  return (
    <div className={`task-item ${task.done?'done':''} ${task.fromAI?'ai-made':''}`}>
      <button className={`task-check-btn ${task.done?'checked':''}`} onClick={toggle}>
        {task.done && (
          <svg className="check-mark" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 5 4.5 8.5 11 1"/>
          </svg>
        )}
      </button>
      {editing ? (
        <input ref={inputRef} className="task-edit-input" value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={onKey}/>
      ) : (
        <span className="task-text" onDoubleClick={startEdit}>{task.text}</span>
      )}
      {task.fromAI && !editing && <span className="ai-pill">AI</span>}
      <button className="task-del-btn" onClick={remove}>✕</button>
    </div>
  )
}

function AddTask({ weekKey, day }) {
  const { dispatch } = usePlanner()
  const [val, setVal] = useState('')
  const submit = () => {
    if (!val.trim()) return
    dispatch({ type:'TASK_ADD', weekKey, day, text:val.trim() })
    setVal('')
  }
  return (
    <div className="add-task-wrap">
      <div className="add-task-row">
        <input className="add-task-input" placeholder="+ 할 일 추가" value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key==='Enter') submit() }}/>
        <button className="add-task-btn" onClick={submit} disabled={!val.trim()}>+</button>
      </div>
    </div>
  )
}

// PC용 컬럼
function DayCol({ day, date, weekKey, tasks }) {
  const today   = isToday(date)
  const weekend = day==='sat' || day==='sun'
  return (
    <div className={`day-col ${today?'is-today':''} ${weekend?'is-weekend':''}`}>
      <div className="day-head">
        <div className="day-name">{DAY_KO[day]}{today && <span className="today-dot"/>}</div>
        <div className="day-date">{formatMonthDay(date)}</div>
      </div>
      <div className="task-area">
        {tasks.map(t => <TaskItem key={t.id} task={t} weekKey={weekKey} day={day}/>)}
      </div>
      <AddTask weekKey={weekKey} day={day}/>
    </div>
  )
}

export default function WeeklyPlanner() {
  const { state } = usePlanner()
  const { ui, plans } = state
  const { weekKey } = ui
  const dates  = getWeekDates(weekKey)
  const wp     = plans[weekKey] ?? {}
  const today  = todayDayKey()

  // 아코디언: 열린 요일 관리 (오늘 기본 열림)
  const [openDay, setOpenDay] = useState(today)

  const toggleDay = (day) => {
    setOpenDay(prev => prev === day ? null : day)
  }

  // 달성률
  const allTasks = Object.values(wp).flat()
  const total = allTasks.length
  const done  = allTasks.filter(t => t.done).length
  const pct   = total ? Math.round(done/total*100) : 0

  return (
    <>
      {/* ── 모바일 플래너 ── */}
      <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
        {/* 요일 탭 스트립 */}
        <div className="day-strip">
          {DAYS.map(day => {
            const date   = dates[day]
            const isTod  = isToday(date)
            const isWknd = day==='sat' || day==='sun'
            const isOpen = openDay === day
            return (
              <button
                key={day}
                className={`day-strip-btn ${isTod?'today':''} ${isWknd?'weekend':''} ${isOpen&&!isTod?'selected':''}`}
                onClick={() => toggleDay(day)}
              >
                <span className="day-strip-name">{DAY_KO[day]}</span>
                <span className="day-strip-num">{formatMonthDay(date).split('/')[1]}</span>
              </button>
            )
          })}
        </div>

        {/* 아코디언 카드 리스트 */}
        <div className="planner-mobile-body">
          {/* 달성률 바 */}
          {total > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'var(--bg-3)', borderRadius:'var(--r)', border:'1px solid var(--line)' }}>
              <span style={{ fontSize:11, color:'var(--tx-3)' }}>이번 주</span>
              <div style={{ flex:1, height:3, background:'var(--line-2)', borderRadius:2, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--gold),#f5d08a)', borderRadius:2, transition:'width .5s' }}/>
              </div>
              <span style={{ fontSize:11, fontWeight:700, color:'var(--gold)' }}>{pct}%</span>
            </div>
          )}

          {/* 모든 요일을 순서대로 아코디언으로 */}
          {DAYS.map(day => {
            const date    = dates[day]
            const isTod   = isToday(date)
            const isWknd  = day==='sat' || day==='sun'
            const isOpen  = openDay === day
            const tasks   = wp[day] ?? []
            const doneCnt = tasks.filter(t => t.done).length

            return (
              <div key={day} className={`day-card-mobile ${isTod?'is-today':''} ${isWknd?'is-weekend':''}`}>
                {/* 헤더 — 클릭으로 열기/닫기 */}
                <div
                  className="day-card-head"
                  style={{ cursor:'pointer' }}
                  onClick={() => toggleDay(day)}
                >
                  <div className="day-card-label">
                    {isTod && <span className="today-dot"/>}
                    {DAY_FULL_KO[day]}
                    <span style={{ fontSize:13, fontWeight:400, color:'var(--tx-3)', marginLeft:4 }}>
                      {formatMonthDay(date)}
                    </span>
                    {isTod && <span style={{ fontSize:10, color:'var(--gold)', marginLeft:4 }}>오늘</span>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    {tasks.length > 0 && (
                      <span style={{
                        fontSize:11,
                        color: doneCnt === tasks.length && tasks.length > 0 ? 'var(--green)' : 'var(--tx-3)',
                        fontWeight:600
                      }}>
                        {doneCnt}/{tasks.length}
                      </span>
                    )}
                    <div className="day-card-count" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition:'transform .2s' }}>
                      ▼
                    </div>
                  </div>
                </div>

                {/* 펼쳐진 내용 */}
                {isOpen && (
                  <>
                    <div className="task-area">
                      {tasks.length === 0 && (
                        <div style={{ padding:'18px 10px', textAlign:'center', color:'var(--tx-3)', fontSize:12 }}>
                          할 일을 추가해보세요
                        </div>
                      )}
                      {tasks.map(t => <TaskItem key={t.id} task={t} weekKey={weekKey} day={day}/>)}
                    </div>
                    <AddTask weekKey={weekKey} day={day}/>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── PC 플래너 그리드 ── */}
      <div className="planner-grid">
        {DAYS.map(day => (
          <DayCol key={day} day={day} date={dates[day]} weekKey={weekKey} tasks={wp[day]??[]}/>
        ))}
      </div>
    </>
  )
}