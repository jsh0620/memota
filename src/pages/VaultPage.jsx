import React, { useState } from 'react'
import { usePlanner } from '../context/PlannerContext'
import { getWeekKey, nextWeekKey, DAYS, DAY_KO } from '../utils/dateUtils'

function VaultCard({ entry, onDelete, onApply }) {
  const [expanded, setExpanded] = useState(false)
  const isGoal = entry.type === 'goal'

  const totalTasks = entry.result?.weeks
    ? entry.result.weeks.reduce((acc, wk) =>
        acc + DAYS.reduce((a, d) => a + (wk[d]?.length ?? 0), 0), 0)
    : entry.result?.nextWeek
      ? DAYS.reduce((a, d) => a + (entry.result.nextWeek[d]?.length ?? 0), 0)
      : 0

  const savedDate = new Date(entry.savedAt).toLocaleDateString('ko-KR', { month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })

  return (
    <div className="vault-card">
      <div className="vault-card-head">
        <div className="vault-card-meta">
          <span className="vault-type-badge" style={{ background: isGoal ? 'var(--gold-dim)' : 'var(--violet-dim)', color: isGoal ? 'var(--gold)' : 'var(--violet)' }}>
            {isGoal ? 'AI 계획' : 'AI 분석'}
          </span>
          <span className="vault-date">{savedDate}</span>
        </div>
        <div className="vault-card-actions">
          <button className="vault-expand-btn" onClick={() => setExpanded(e => !e)}>
            {expanded ? '▲ 접기' : '▼ 펼치기'}
          </button>
          <button className="apply-btn" onClick={() => onApply(entry)}>▷ 적용</button>
          <button className="vault-del-btn" onClick={() => onDelete(entry.id)}>✕</button>
        </div>
      </div>

      <div className="vault-card-title">{entry.title}</div>

      <div className="vault-card-stats">
        {isGoal && entry.period && (
          <span className="vault-stat">기간 {entry.period}</span>
        )}
        {isGoal && entry.result?.totalWeeks && (
          <span className="vault-stat">{entry.result.totalWeeks}주 계획</span>
        )}
        <span className="vault-stat">총 {totalTasks}개 항목</span>
      </div>

      {expanded && (
        <div className="vault-card-body">
          {entry.result?.summary && (
            <div className="summary-text" style={{ marginBottom:14 }}>{entry.result.summary}</div>
          )}
          {entry.result?.analysis && (
            <div className="summary-text" style={{ marginBottom:14 }}>{entry.result.analysis}</div>
          )}

          {/* goal: 주차별 */}
          {isGoal && entry.result?.weeks?.map(wk => (
            <div key={wk.weekNum} className="week-block">
              <div className="week-block-head">
                <span className="week-num">{wk.weekNum}주차</span>
                <span className="week-theme">{wk.theme}</span>
              </div>
              {DAYS.map(d => wk[d]?.length ? (
                <div key={d} className="day-tasks-row">
                  <span className="day-label">{DAY_KO[d]}요일</span>
                  <div className="day-tasks-list">
                    {wk[d].map((t, i) => <span key={i} className="task-chip">{t}</span>)}
                  </div>
                </div>
              ) : null)}
            </div>
          ))}

          {/* auto: 다음 주 계획 */}
          {!isGoal && entry.result?.nextWeek && (
            <div>
              {DAYS.map(d => {
                const tasks = entry.result.nextWeek[d] ?? []
                if (!tasks.length) return null
                return (
                  <div key={d} className="day-tasks-row">
                    <span className="day-label">{DAY_KO[d]}요일</span>
                    <div className="day-tasks-list">
                      {tasks.map((t, i) => <span key={i} className="task-chip">{t}</span>)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {entry.result?.tips?.length > 0 && (
            <ul className="tips-list" style={{ marginTop:14 }}>
              {entry.result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default function VaultPage() {
  const { state, dispatch } = usePlanner()
  const vault = state.vault ?? []

  function handleDelete(id) {
    if (window.confirm('보관함에서 삭제하시겠습니까?')) {
      dispatch({ type: 'VAULT_DELETE', id })
    }
  }

  function handleApply(entry) {
    const startWk = getWeekKey()
    if (entry.type === 'goal' && entry.result?.weeks) {
      entry.result.weeks.forEach((wk, idx) => {
        let wkKey = startWk
        for (let i = 0; i < idx; i++) wkKey = nextWeekKey(wkKey)
        const dayTasks = {}
        DAYS.forEach(d => { if (wk[d]?.length) dayTasks[d] = wk[d] })
        dispatch({ type: 'AI_APPLY_WEEK', weekKey: wkKey, dayTasks })
      })
    } else if (entry.type === 'auto' && entry.result?.nextWeek) {
      const nextWk = nextWeekKey(startWk)
      const dayTasks = {}
      DAYS.forEach(d => { if (entry.result.nextWeek[d]?.length) dayTasks[d] = entry.result.nextWeek[d] })
      dispatch({ type: 'AI_APPLY_WEEK', weekKey: nextWk, dayTasks })
    }
    dispatch({ type: 'UI_VIEW', view: 'planner' })
  }

  return (
    <div className="ai-page">
      <div className="page-header" style={{ padding:'32px 0 24px', border:'none' }}>
        <div className="page-title">🗂 보관함</div>
        <div className="page-sub">저장한 AI 계획을 보관하고 언제든 플래너에 적용할 수 있습니다</div>
      </div>

      {/* 사용량 표시 */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20, padding:'10px 14px', background:'var(--bg-3)', borderRadius:'var(--r)', border:'1px solid var(--line)' }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, color:'var(--tx-3)', marginBottom:4 }}>보관함 사용량</div>
          <div style={{ height:4, background:'var(--line-2)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(vault.length/5)*100}%`, background: vault.length >= 5 ? 'var(--red)' : 'var(--gold)', borderRadius:2, transition:'width .4s' }}/>
          </div>
        </div>
        <span style={{ fontSize:13, fontWeight:700, color: vault.length >= 5 ? 'var(--red)' : 'var(--gold)', flexShrink:0 }}>
          {vault.length} / 5
        </span>
      </div>

      {vault.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗂</div>
          <div className="empty-text">
            저장된 계획이 없습니다<br/>
            AI 계획 생성 후 보관함에 저장해보세요
          </div>
          <button className="btn-secondary" style={{ marginTop:16 }} onClick={() => dispatch({ type:'UI_VIEW', view:'ai-goal' })}>
            AI 계획 생성하러 가기
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {vault.map(entry => (
            <VaultCard
              key={entry.id}
              entry={entry}
              onDelete={handleDelete}
              onApply={handleApply}
            />
          ))}
        </div>
      )}
    </div>
  )
}
