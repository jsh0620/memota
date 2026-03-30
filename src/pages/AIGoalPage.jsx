import React, { useState } from 'react'
import { usePlanner } from '../context/PlannerContext'
import { generateGoalPlan } from '../utils/claudeApi'
import { getWeekKey, nextWeekKey } from '../utils/dateUtils'

const DAY_KO = { mon:'월',tue:'화',wed:'수',thu:'목',fri:'금',sat:'토',sun:'일' }
const DAYS = ['mon','tue','wed','thu','fri','sat','sun']

export default function AIGoalPage() {
  const { state, dispatch } = usePlanner()

  const [period, setPeriod]       = useState('1')
  const [goal, setGoal]           = useState('')
  const [details, setDetails]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [result, setResult]       = useState(null)
  const [savedToVault, setSaved]  = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  async function handleGenerate() {
    if (!goal.trim()) { setError('목표를 입력해주세요.'); return }
    setLoading(true); setError(null); setResult(null); setSaved(false)
    try {
      const data = await generateGoalPlan({ period, periodUnit: '주', goal, details })
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleApply() {
    if (!result?.weeks) return
    const startWk = getWeekKey()
    result.weeks.forEach((wk, idx) => {
      let wkKey = startWk
      for (let i = 0; i < idx; i++) wkKey = nextWeekKey(wkKey)
      const dayTasks = {}
      DAYS.forEach(d => { if (wk[d]?.length) dayTasks[d] = wk[d] })
      dispatch({ type: 'AI_APPLY_WEEK', weekKey: wkKey, dayTasks })
    })
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
        type: 'goal',
        title: goal,
        period: `${period}${unit}`,
        goal,
        details,
        result,
      },
    })
    setSaved(true)
  }

  function handleReset() {
    if (!result || savedToVault) {
      doReset()
    } else {
      setShowResetConfirm(true)
    }
  }

  function doReset() {
    setResult(null)
    setGoal('')
    setDetails('')
    setPeriod('1')
    setUnit('개월')
    setError(null)
    setSaved(false)
    setShowResetConfirm(false)
  }

  return (
    <div className="ai-page">

      {/* 왼쪽 */}
      <div>
        <div className="page-header" style={{ padding:'0 0 24px', border:'none' }}>
          <div className="page-title">AI 계획 생성</div>
          <div className="page-sub">기간과 목표를 입력하면 AI가 주간 계획을 설계해줍니다</div>
        </div>

        {!result ? (
          <div className="ai-card">
            <div className="ai-card-title">목표 설정</div>
            <div className="ai-card-sub">달성하고 싶은 목표와 기간을 구체적으로 입력할수록 더 좋은 계획이 만들어집니다</div>
            <div className="form-grid">
              <div className="field span2">
                <label>기간(주)</label>
                <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding:'11px 13px', fontSize:14 }}>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={String(n)}>{n}주</option>
                  ))}
                </select>
              </div>
              <div className="field span2">
                <label>목표 *</label>
                <input type="text" placeholder="예: 토익 900점 달성, 10kg 감량, 스타트업 MVP 완성..." value={goal} onChange={e => setGoal(e.target.value)} style={{ width:'100%' }}/>
              </div>
              <div className="field span2">
                <label>세부 사항</label>
                <textarea rows={3} placeholder={"현재 상태, 가용 시간, 제약 조건 등을 입력해주세요\n예: 현재 토익 700점, 매일 저녁 2시간 공부 가능, 주말 모의고사 응시 예정"} value={details} onChange={e => setDetails(e.target.value)} style={{ width:'100%', padding:'9px 12px' }}/>
              </div>
            </div>
            <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
              {loading ? '⏳ 계획 생성 중...' : '✦ AI 계획 생성'}
            </button>
          </div>
        ) : (
          /* 결과 화면 */
          <div>
            {/* 액션 버튼 3개 */}
            <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
              <button className="btn-primary" style={{ marginTop:0, flex:1 }} onClick={handleApply}>
                ▷ 플래너에 적용
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

            {/* 저장 완료 메시지 */}
            {savedToVault && (
              <div style={{ fontSize:12, color:'var(--green)', marginBottom:12, padding:'8px 12px', background:'var(--green-dim)', borderRadius:'var(--r)' }}>
                ✓ 보관함에 저장되었습니다. 보관함 탭에서 언제든 다시 적용할 수 있습니다.
              </div>
            )}

            {/* 초기화 확인 모달 */}
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
                <span className="result-title">✦ 생성된 계획 — {period}{unit} · {result.totalWeeks}주</span>
              </div>
              <div className="result-body">
                {result.summary && <div className="summary-text">{result.summary}</div>}
                {result.weeks?.map(wk => (
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
                {result.tips?.length > 0 && (
                  <ul className="tips-list">
                    {result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {error && <div className="error-box" style={{ marginTop:12 }}>⚠ {error}</div>}

        {loading && (
          <div className="loading-wrap">
            <div className="spinner"/>
            <div className="loading-text">AI가 최적의 계획을 설계하고 있습니다...</div>
          </div>
        )}
      </div>

    </div>
  )
}