import React, { useState } from 'react'
import { usePlanner } from '../context/PlannerContext'
import { generateAutoNextWeek } from '../utils/claudeApi'
import { getWeekKey, nextWeekKey, prevWeekKey, formatWeekRange, DAYS, DAY_KO } from '../utils/dateUtils'
import AIIllustration from '../components/AIIllustration'

export default function AIAutoPage() {
  const { state, dispatch } = usePlanner()
  const { plans, ui } = state

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [result, setResult]   = useState(null)
  const [applied, setApplied] = useState(false)

  const currentWk = ui.weekKey
  const prevWk    = prevWeekKey(currentWk)

  const recentPlans = {
    [currentWk]: { label: formatWeekRange(currentWk), days: plans[currentWk] ?? {} },
    [prevWk]:    { label: formatWeekRange(prevWk),    days: plans[prevWk]    ?? {} },
  }

  const hasData = Object.values(recentPlans).some(
    w => Object.values(w.days).flat().length > 0
  )

  async function handleGenerate() {
    if (!hasData) { setError('최근 플래너 데이터가 없습니다. 먼저 주간 플래너에 계획을 입력해주세요.'); return }
    setLoading(true); setError(null); setResult(null); setApplied(false)
    try {
      const data = await generateAutoNextWeek(recentPlans)
      setResult(data)
      dispatch({
        type: 'AI_HISTORY_ADD',
        entry: { id: Date.now().toString(), type: 'auto', createdAt: new Date().toISOString(), result: data },
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleApply() {
    if (!result?.nextWeek) return
    const nextWk = nextWeekKey(currentWk)
    const dayTasks = {}
    DAYS.forEach(d => { if (result.nextWeek[d]?.length) dayTasks[d] = result.nextWeek[d] })
    dispatch({ type: 'AI_APPLY_WEEK', weekKey: nextWk, dayTasks })
    setApplied(true)
    dispatch({ type: 'UI_WEEK', weekKey: nextWk })
    dispatch({ type: 'UI_VIEW', view: 'planner' })
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, padding:36, alignItems:'start' }}>

      {/* 왼쪽: 분석 + 결과 */}
      <div>
        <div className="page-header" style={{ padding:'0 0 24px', border:'none' }}>
          <div className="page-title">AI 주간 분석</div>
          <div className="page-sub">최근 플래너 기록을 분석해서 다음 주 계획을 자동으로 생성합니다</div>
        </div>

        {/* 분석 대상 데이터 */}
        <div className="ai-card" style={{ marginBottom:16 }}>
          <div className="ai-card-title" style={{ fontSize:14 }}>분석 대상 데이터</div>
          <div className="ai-card-sub">아래 데이터를 기반으로 다음 주 계획을 생성합니다</div>
          {Object.entries(recentPlans).map(([wk, { label, days }]) => {
            const allTasks = Object.values(days).flat()
            const total = allTasks.length
            const done  = allTasks.filter(t => t.done).length
            return (
              <div key={wk} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderTop:'1px solid var(--line)' }}>
                <span style={{ fontSize:12, color:'var(--tx-2)' }}>{label}</span>
                {total === 0
                  ? <span style={{ fontSize:12, color:'var(--tx-3)' }}>데이터 없음</span>
                  : <span style={{ fontSize:12, color: done === total ? 'var(--green)' : 'var(--tx-2)' }}>
                      {done}/{total} 완료 ({Math.round(done/total*100)}%)
                    </span>
                }
              </div>
            )
          })}
        </div>

        <div className="ai-card">
          <div className="ai-card-title">자동 계획 생성</div>
          <div className="ai-card-sub">
            {hasData
              ? `최근 ${Object.values(recentPlans).filter(w => Object.values(w.days).flat().length > 0).length}주 데이터를 분석해서 다음 주 최적 계획을 생성합니다`
              : '주간 플래너에 데이터가 없습니다. 먼저 계획을 입력해주세요.'}
          </div>
          <button className="btn-primary" onClick={handleGenerate} disabled={loading || !hasData}>
            {loading ? '⏳ 분석 중...' : '✦ 다음 주 계획 생성'}
          </button>
        </div>

        {error && <div className="error-box">⚠ {error}</div>}

        {loading && (
          <div className="loading-wrap">
            <div className="spinner"/>
            <div className="loading-text">패턴을 분석하고 최적 계획을 설계하는 중...</div>
          </div>
        )}

        {result && !loading && (
          <div className="result-box">
            <div className="result-header">
              <span className="result-title">✦ 다음 주 추천 계획</span>
              <button className="apply-btn" onClick={handleApply} disabled={applied}>
                {applied ? '✓ 적용됨' : '▷ 다음 주에 적용'}
              </button>
            </div>
            <div className="result-body">
              {result.analysis && <div className="summary-text">{result.analysis}</div>}
              {result.completionRate != null && (
                <div className="completion-badge" style={{ marginBottom:14 }}>
                  ✓ 최근 달성률 {result.completionRate}%
                </div>
              )}
              {result.insights?.length > 0 && (
                <ul className="insight-list" style={{ marginBottom:20 }}>
                  {result.insights.map((ins, i) => (
                    <li key={i} className="insight-item">{ins}</li>
                  ))}
                </ul>
              )}
              <div style={{ fontWeight:600, fontSize:13, color:'var(--tx)', marginBottom:12 }}>
                추천 주간 계획
              </div>
              {DAYS.map(d => {
                const tasks = result.nextWeek?.[d] ?? []
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
          </div>
        )}
      </div>

      {/* 오른쪽: 일러스트 */}
      <div style={{ position:'sticky', top:32 }}>
        <AIIllustration variant="auto" />
      </div>

    </div>
  )
}
