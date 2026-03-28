import React, { useState } from 'react'
import { usePlanner } from '../context/PlannerContext'
import { generateGoalPlan } from '../utils/claudeApi'
import { getWeekKey, nextWeekKey } from '../utils/dateUtils'

const DAY_KO = { mon:'월',tue:'화',wed:'수',thu:'목',fri:'금',sat:'토',sun:'일' }
const DAYS = ['mon','tue','wed','thu','fri','sat','sun']

function NightSkyIllustration() {
  return (
    <svg width="100%" viewBox="0 0 680 760" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="680" height="760" fill="#0d0b1a" rx="16"/>
      <path d="M0 620 L60 520 L130 580 L200 460 L280 540 L340 400 L410 490 L480 430 L560 510 L620 460 L680 520 L680 760 L0 760 Z" fill="#0a0820"/>
      <path d="M0 680 L80 600 L150 640 L230 590 L300 620 L380 570 L440 610 L510 580 L580 610 L640 590 L680 610 L680 760 L0 760 Z" fill="#0c0a25"/>
      <path d="M0 720 L100 680 L180 700 L260 680 L340 695 L420 678 L500 695 L580 680 L680 690 L680 760 L0 760 Z" fill="#110e2e"/>
      <circle cx="520" cy="140" r="60" fill="#f5e8c0"/>
      <circle cx="500" cy="125" r="60" fill="#0d0b1a"/>
      <circle cx="535" cy="125" r="7" fill="#e8d8a0" opacity="0.4"/>
      <circle cx="510" cy="155" r="4" fill="#e8d8a0" opacity="0.3"/>
      <circle cx="548" cy="150" r="5" fill="#e8d8a0" opacity="0.25"/>
      <circle cx="525" cy="108" r="3" fill="#e8d8a0" opacity="0.35"/>
      <circle cx="520" cy="140" r="80" fill="none" stroke="#f5e8c0" strokeWidth="1" opacity="0.08"/>
      <circle cx="520" cy="140" r="95" fill="none" stroke="#f5e8c0" strokeWidth="0.5" opacity="0.05"/>
      <circle cx="80" cy="60" r="2.5" fill="#ffffff" opacity="0.95"/>
      <circle cx="160" cy="100" r="2" fill="#fffde0" opacity="0.9"/>
      <circle cx="240" cy="40" r="2.5" fill="#ffffff" opacity="0.85"/>
      <circle cx="320" cy="80" r="2" fill="#e0e8ff" opacity="0.9"/>
      <circle cx="420" cy="50" r="2" fill="#ffffff" opacity="0.9"/>
      <circle cx="600" cy="70" r="2.5" fill="#fffde0" opacity="0.85"/>
      <circle cx="640" cy="200" r="2" fill="#ffffff" opacity="0.9"/>
      <circle cx="40" cy="200" r="2" fill="#ffe8e0" opacity="0.85"/>
      <circle cx="380" cy="160" r="2" fill="#ffffff" opacity="0.8"/>
      <circle cx="100" cy="320" r="2.5" fill="#e0e8ff" opacity="0.9"/>
      <circle cx="30" cy="390" r="2" fill="#ffffff" opacity="0.85"/>
      <circle cx="620" cy="320" r="2" fill="#fffde0" opacity="0.9"/>
      <circle cx="650" cy="420" r="2.5" fill="#ffffff" opacity="0.8"/>
      <circle cx="50" cy="130" r="1.5" fill="#ffffff" opacity="0.8"/>
      <circle cx="120" cy="180" r="1.5" fill="#fffde0" opacity="0.75"/>
      <circle cx="200" cy="150" r="1.5" fill="#ffffff" opacity="0.7"/>
      <circle cx="280" cy="200" r="1.5" fill="#e0e8ff" opacity="0.8"/>
      <circle cx="360" cy="120" r="1.5" fill="#ffffff" opacity="0.75"/>
      <circle cx="460" cy="180" r="1.5" fill="#fffde0" opacity="0.7"/>
      <circle cx="560" cy="130" r="1.5" fill="#ffffff" opacity="0.8"/>
      <circle cx="630" cy="160" r="1.5" fill="#e0e8ff" opacity="0.75"/>
      <circle cx="70" cy="260" r="1.5" fill="#ffffff" opacity="0.7"/>
      <circle cx="170" cy="280" r="1.5" fill="#fffde0" opacity="0.75"/>
      <circle cx="260" cy="300" r="1.5" fill="#ffffff" opacity="0.7"/>
      <circle cx="450" cy="260" r="1.5" fill="#e0e8ff" opacity="0.8"/>
      <circle cx="580" cy="250" r="1.5" fill="#ffffff" opacity="0.75"/>
      <circle cx="140" cy="380" r="1.5" fill="#fffde0" opacity="0.7"/>
      <circle cx="340" cy="360" r="1.5" fill="#ffffff" opacity="0.75"/>
      <circle cx="490" cy="360" r="1.5" fill="#e0e8ff" opacity="0.7"/>
      <circle cx="35" cy="80" r="1" fill="#ffffff" opacity="0.6"/>
      <circle cx="90" cy="50" r="1" fill="#fffde0" opacity="0.55"/>
      <circle cx="145" cy="70" r="1" fill="#ffffff" opacity="0.6"/>
      <circle cx="265" cy="65" r="1" fill="#e0e8ff" opacity="0.6"/>
      <circle cx="305" cy="45" r="1" fill="#ffffff" opacity="0.55"/>
      <circle cx="370" cy="55" r="1" fill="#fffde0" opacity="0.5"/>
      <circle cx="435" cy="75" r="1" fill="#ffffff" opacity="0.6"/>
      <circle cx="490" cy="95" r="1" fill="#e0e8ff" opacity="0.55"/>
      <circle cx="545" cy="55" r="1" fill="#ffffff" opacity="0.5"/>
      <circle cx="595" cy="110" r="1" fill="#fffde0" opacity="0.6"/>
      <circle cx="660" cy="85" r="1" fill="#ffffff" opacity="0.55"/>
      <circle cx="110" cy="210" r="1" fill="#e0e8ff" opacity="0.55"/>
      <circle cx="230" cy="170" r="1" fill="#fffde0" opacity="0.6"/>
      <circle cx="310" cy="240" r="1" fill="#ffffff" opacity="0.5"/>
      <circle cx="395" cy="210" r="1" fill="#ffffff" opacity="0.55"/>
      <circle cx="555" cy="200" r="1" fill="#ffffff" opacity="0.6"/>
      <circle cx="610" cy="245" r="1" fill="#fffde0" opacity="0.55"/>
      <circle cx="55" cy="310" r="1" fill="#ffffff" opacity="0.55"/>
      <circle cx="295" cy="380" r="1" fill="#fffde0" opacity="0.5"/>
      <circle cx="530" cy="310" r="1" fill="#e0e8ff" opacity="0.5"/>
      <circle cx="600" cy="380" r="1" fill="#ffffff" opacity="0.55"/>
      <circle cx="660" cy="360" r="1" fill="#fffde0" opacity="0.5"/>
      <line x1="80" y1="60" x2="160" y2="100" stroke="#a78bfa" strokeWidth="0.5" opacity="0.25"/>
      <line x1="160" y1="100" x2="240" y2="40" stroke="#a78bfa" strokeWidth="0.5" opacity="0.25"/>
      <line x1="240" y1="40" x2="320" y2="80" stroke="#a78bfa" strokeWidth="0.5" opacity="0.25"/>
      <line x1="320" y1="80" x2="380" y2="160" stroke="#a78bfa" strokeWidth="0.5" opacity="0.25"/>
      <line x1="100" y1="320" x2="30" y2="390" stroke="#e8b86d" strokeWidth="0.5" opacity="0.2"/>
      <line x1="30" y1="390" x2="140" y2="380" stroke="#e8b86d" strokeWidth="0.5" opacity="0.2"/>
      <line x1="140" y1="380" x2="170" y2="280" stroke="#e8b86d" strokeWidth="0.5" opacity="0.2"/>
      <line x1="620" y1="320" x2="650" y2="420" stroke="#a78bfa" strokeWidth="0.5" opacity="0.2"/>
      <line x1="650" y1="420" x2="600" y2="380" stroke="#a78bfa" strokeWidth="0.5" opacity="0.2"/>
      <line x1="620" y1="320" x2="640" y2="200" stroke="#a78bfa" strokeWidth="0.5" opacity="0.2"/>
      <line x1="180" y1="120" x2="240" y2="160" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" strokeLinecap="round"/>
      <line x1="183" y1="123" x2="200" y2="134" stroke="#ffffff" strokeWidth="0.8" opacity="0.3"/>
      <line x1="560" y1="80" x2="620" y2="130" stroke="#f5e8c0" strokeWidth="1" opacity="0.6" strokeLinecap="round"/>
      <line x1="563" y1="83" x2="580" y2="96" stroke="#f5e8c0" strokeWidth="0.6" opacity="0.25"/>
      <ellipse cx="160" cy="340" rx="50" ry="25" fill="#a78bfa" opacity="0.04"/>
      <ellipse cx="500" cy="280" rx="60" ry="30" fill="#60a5fa" opacity="0.04"/>
      <ellipse cx="320" cy="420" rx="70" ry="35" fill="#a78bfa" opacity="0.03"/>
      <line x1="420" y1="46" x2="420" y2="54" stroke="#ffffff" strokeWidth="1" opacity="0.9"/>
      <line x1="416" y1="50" x2="424" y2="50" stroke="#ffffff" strokeWidth="1" opacity="0.9"/>
      <circle cx="420" cy="50" r="2" fill="#ffffff" opacity="0.9"/>
      <line x1="600" y1="66" x2="600" y2="74" stroke="#fffde0" strokeWidth="1" opacity="0.8"/>
      <line x1="596" y1="70" x2="604" y2="70" stroke="#fffde0" strokeWidth="1" opacity="0.8"/>
      <circle cx="600" cy="70" r="2.5" fill="#fffde0" opacity="0.85"/>
      <line x1="80" y1="56" x2="80" y2="64" stroke="#ffffff" strokeWidth="0.8" opacity="0.9"/>
      <line x1="76" y1="60" x2="84" y2="60" stroke="#ffffff" strokeWidth="0.8" opacity="0.9"/>
      <text x="340" y="730" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" fill="#e8b86d" opacity="0.5" letterSpacing="8">memota</text>
      <text x="340" y="752" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#a0a0c0" opacity="0.3" letterSpacing="4">AI-POWERED PLANNER</text>
    </svg>
  )
}

export default function AIGoalPage() {
  const { dispatch } = usePlanner()

  const [period, setPeriod]   = useState('1')
  const [unit, setUnit]       = useState('개월')
  const [goal, setGoal]       = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [result, setResult]   = useState(null)
  const [applied, setApplied] = useState(false)

  async function handleGenerate() {
    if (!goal.trim()) { setError('목표를 입력해주세요.'); return }
    setLoading(true); setError(null); setResult(null); setApplied(false)
    try {
      const data = await generateGoalPlan({ period, periodUnit: unit, goal, details })
      setResult(data)
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
    const startWk = getWeekKey()
    result.weeks.forEach((wk, idx) => {
      let wkKey = startWk
      for (let i = 0; i < idx; i++) wkKey = nextWeekKey(wkKey)
      const dayTasks = {}
      DAYS.forEach(d => { if (wk[d]?.length) dayTasks[d] = wk[d] })
      dispatch({ type: 'AI_APPLY_WEEK', weekKey: wkKey, dayTasks })
    })
    setApplied(true)
    dispatch({ type: 'UI_VIEW', view: 'planner' })
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: 36, alignItems: 'start', minHeight: '100%' }}>

      {/* 왼쪽: 폼 + 결과 */}
      <div>
        <div className="page-header" style={{ padding: '0 0 24px', border: 'none' }}>
          <div className="page-title">AI 계획 생성</div>
          <div className="page-sub">기간과 목표를 입력하면 AI가 주간 계획을 설계해줍니다</div>
        </div>

        <div className="ai-card">
          <div className="ai-card-title">목표 설정</div>
          <div className="ai-card-sub">달성하고 싶은 목표와 기간을 구체적으로 입력할수록 더 좋은 계획이 만들어집니다</div>

          <div className="form-grid">
            <div className="field">
              <label>기간</label>
              <input
                type="number" min="1" max="24"
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
                placeholder={"현재 상태, 가용 시간, 제약 조건 등을 입력해주세요\n예: 현재 토익 700점, 매일 저녁 2시간 공부 가능, 주말 모의고사 응시 예정"}
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
              {result.summary && <div className="summary-text">{result.summary}</div>}
              {result.weeks?.map(wk => (
                <div key={wk.weekNum} className="week-block">
                  <div className="week-block-head">
                    <span className="week-num">{wk.weekNum}주차</span>
                    <span className="week-theme">{wk.theme}</span>
                  </div>
                  {DAYS.map(d =>
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

      {/* 오른쪽: 밤하늘 일러스트 */}
      <div style={{ position: 'sticky', top: 32 }}>
        <NightSkyIllustration />
      </div>

    </div>
  )
}