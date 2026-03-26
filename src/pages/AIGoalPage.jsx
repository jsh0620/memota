import React, { useState } from 'react'
import { usePlanner } from '../context/PlannerContext'
import { generateGoalPlan } from '../utils/claudeApi'
import { getWeekKey, nextWeekKey } from '../utils/dateUtils'

const DAY_KO = { mon:'월',tue:'화',wed:'수',thu:'목',fri:'금',sat:'토',sun:'일' }
const DAYS = ['mon','tue','wed','thu','fri','sat','sun']

export default function AIGoalPage() {
  const { dispatch } = usePlanner()

  // form
  const [period, setPeriod]     = useState('1')
  const [unit, setUnit]         = useState('개월')
  const [goal, setGoal]         = useState('')
  const [details, setDetails]   = useState('')

  // state
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [result, setResult]     = useState(null)
  const [applied, setApplied]   = useState(false)

  async function handleGenerate() {
    if (!goal.trim()) { setError('목표를 입력해주세요.'); return }
    setLoading(true); setError(null); setResult(null); setApplied(false)
    try {
      const data = await generateGoalPlan({ period, periodUnit: unit, goal, details })
      setResult(data)
      // save to history
      dispatch({
        type: 'AI_HISTORY_ADD',
        entry: { id: Date.now().toString(), type: 'goal', createdAt: new Date().toISOString(), input: { period, unit, goal, details }, result: data },
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleApply() {
    if (!result?.weeks) return
    const startWk = getWeekKey() // start from current week

    result.weeks.forEach((wk, idx) => {
      let wkKey = startWk
      for (let i = 0; i < idx; i++) wkKey = nextWeekKey(wkKey)

      const dayTasks = {}
      DAYS.forEach(d => {
        if (wk[d]?.length) dayTasks[d] = wk[d]
      })
      dispatch({ type: 'AI_APPLY_WEEK', weekKey: wkKey, dayTasks })
    })

    setApplied(true)
    dispatch({ type: 'UI_VIEW', view: 'planner' })
  }

  return (
    <div className="ai-page">
      <div className="page-header" style={{ padding: '32px 0 24px', border: 'none' }}>
        <div className="page-title">🎯 AI 목표 플래너</div>
        <div className="page-sub">기간과 목표를 입력하면 AI가 주간 계획을 설계해줍니다</div>
      </div>

      <div className="ai-card">
        <div className="ai-card-title">목표 설정</div>
        <div className="ai-card-sub">달성하고 싶은 목표와 기간을 구체적으로 입력할수록 더 좋은 계획이 만들어집니다</div>

        <div className="form-grid">
          <div className="field">
            <label>기간</label>
            <input
              type="number"
              min="1" max="24"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div className="field">
            <label>단위</label>
            <select value={unit} onChange={e => setUnit(e.target.value)} style={{ padding: '9px 12px' }}>
              <option>주</option>
              <option>개월</option>
              <option>년</option>
            </select>
          </div>
          <div className="field span2">
            <label>목표 *</label>
            <input
              type="text"
              placeholder="예: 토익 900점 달성, 10kg 감량, 스타트업 MVP 완성..."
              value={goal}
              onChange={e => setGoal(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div className="field span2">
            <label>세부 사항</label>
            <textarea
              rows={3}
              placeholder="현재 상태, 가용 시간, 제약 조건 등을 입력해주세요&#10;예: 현재 토익 700점, 매일 저녁 2시간 공부 가능, 주말 모의고사 응시 예정"
              value={details}
              onChange={e => setDetails(e.target.value)}
              style={{ width: '100%', padding: '9px 12px' }}
            />
          </div>
        </div>

        <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? '⏳ 계획 생성 중...' : '✦ AI 계획 생성'}
        </button>
      </div>

      {error && <div className="error-box">⚠ {error}</div>}

      {loading && (
        <div className="loading-wrap">
          <div className="spinner" />
          <div className="loading-text">AI가 최적의 계획을 설계하고 있습니다...</div>
        </div>
      )}

      {result && !loading && (
        <div className="result-box">
          <div className="result-header">
            <span className="result-title">✦ 생성된 계획 — {period}{unit} · {result.totalWeeks}주</span>
            <button className="apply-btn" onClick={handleApply}>
              ▷ 플래너에 적용
            </button>
          </div>
          <div className="result-body">
            {result.summary && (
              <div className="summary-text">{result.summary}</div>
            )}

            {result.weeks?.map(wk => (
              <div key={wk.weekNum} className="week-block">
                <div className="week-block-head">
                  <span className="week-num">{wk.weekNum}주차</span>
                  <span className="week-theme">{wk.theme}</span>
                </div>
                {['mon','tue','wed','thu','fri','sat','sun'].map(d =>
                  wk[d]?.length ? (
                    <div key={d} className="day-tasks-row">
                      <span className="day-label">{DAY_KO[d]}요일</span>
                      <div className="day-tasks-list">
                        {wk[d].map((t, i) => <span key={i} className="task-chip">{t}</span>)}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            ))}

            {result.tips?.length > 0 && (
              <ul className="tips-list">
                {result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
