import React, { useState } from 'react'
import { usePlanner } from '../context/PlannerContext'
import { generateAutoNextWeek } from '../utils/claudeApi'
import { getWeekKey, nextWeekKey, prevWeekKey, formatWeekRange, DAYS, DAY_KO } from '../utils/dateUtils'
import AIIllustration from '../components/AIIllustration'

export default function AIAutoPage() {
  const { state, dispatch } = usePlanner()
  const { plans, ui } = state

  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [result, setResult]       = useState(null)
  const [savedToVault, setSaved]  = useState(false)
  const [applied, setApplied]     = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

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
    setLoading(true); setError(null); setResult(null); setSaved(false); setApplied(false)
    try {
      const data = await generateAutoNextWeek(recentPlans)
      setResult(data)
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

  function handleSaveVault() {
    if (!result) return
    const vaultCount = state.vault?.length ?? 0
    if (vaultCount >= 5) {
      setError('보관함이 가득 찼습니다. 기존 항목을 삭제 후 저장해주세요. (최대 5개)')
      return
    }
    dispatch({
      type: 'VAULT_SAVE',
      entry: {
        type: 'auto',
        title: `AI 주간 분석 — ${formatWeekRange(currentWk)}`,
        result,
      },
    })
    setSaved(true)
  }

  function handleReset() {
    if (!result || savedToVault || applied) {
      doReset()
    } else {
      setShowResetConfirm(true)
    }
  }

  function doReset() {
    setResult(null)
    setError(null)
    setSaved(false)
    setApplied(false)
    setShowResetConfirm(false)
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, padding:36, alignItems:'start' }}>

      {/* 왼쪽 */}
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

        {!result ? (
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
        ) : (
          <div>
            {/* 액션 버튼 3개 */}
            <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
              <button className="btn-primary" style={{ marginTop:0, flex:1 }} onClick={handleApply} disabled={applied}>
                {applied ? '✓ 적용됨' : '▷ 다음 주에 적용'}
              </button>
              <button
                className="btn-secondary"
                style={{ flex:1 }}
                onClick={handleSaveVault}
                disabled={savedToVault}
              >
                {savedToVault ? '✓ 보관함에 저장됨' : '🗂 보관함에 저장'}
              </button>
              <button className="btn-secondary" onClick={handleReset} style={{ flex:'0 0 auto' }}>
                ↺ 다시 설정
              </button>
            </div>

            {savedToVault && (
              <div style={{ fontSize:12, color:'var(--green)', marginBottom:12, padding:'8px 12px', background:'var(--green-dim)', borderRadius:'var(--r)' }}>
                ✓ 보관함에 저장되었습니다. 보관함 탭에서 언제든 다시 적용할 수 있습니다.
              </div>
            )}

            {showResetConfirm && (
              <div style={{ padding:'14px 16px', background:'var(--red-dim)', border:'1px solid rgba(248,113,113,.25)', borderRadius:'var(--r)', marginBottom:14 }}>
                <div style={{ fontSize:13, color:'var(--tx)', marginBottom:10 }}>
                  ⚠ 보관함에 저장되지 않은 계획입니다. 삭제하고 처음으로 돌아가시겠습니까?
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn-primary" style={{ marginTop:0, background:'var(--red)', fontSize:12, padding:'7px 16px' }} onClick={doReset}>
                    삭제하고 돌아가기
                  </button>
                  <button className="btn-secondary" style={{ fontSize:12, padding:'7px 16px' }} onClick={() => setShowResetConfirm(false)}>
                    취소
                  </button>
                </div>
              </div>
            )}

            <div className="result-box">
              <div className="result-header">
                <span className="result-title">✦ 다음 주 추천 계획</span>
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
                    {result.insights.map((ins, i) => <li key={i} className="insight-item">{ins}</li>)}
                  </ul>
                )}
                <div style={{ fontWeight:600, fontSize:13, color:'var(--tx)', marginBottom:12 }}>추천 주간 계획</div>
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
          </div>
        )}

        {error && <div className="error-box" style={{ marginTop:12 }}>⚠ {error}</div>}

        {loading && (
          <div className="loading-wrap">
            <div className="spinner"/>
            <div className="loading-text">패턴을 분석하고 최적 계획을 설계하는 중...</div>
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
