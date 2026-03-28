// ── API 키 관리 (localStorage) ──
export function getStoredApiKey() {
  return localStorage.getItem('planai-apikey') || ''
}
export function saveApiKey(key) {
  localStorage.setItem('planai-apikey', key.trim())
}
export function clearApiKey() {
  localStorage.removeItem('planai-apikey')
}

// ── 공통 fetch (Groq) ──
async function ask(system, user) {
  const KEY = import.meta.env.VITE_GROQ_API_KEY || getStoredApiKey()
  if (!KEY) {
    throw new Error('API 키가 설정되지 않았습니다. ⚙ 설정에서 Groq API 키를 입력해주세요.')
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: user },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    }),
  })

  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    if (res.status === 401) throw new Error('API 키가 유효하지 않습니다. 키를 다시 확인해주세요.')
    throw new Error(j?.error?.message ?? `API 오류 ${res.status}`)
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content ?? ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

/* ── ① 기간 목표 기반 계획 ── */
export async function generateGoalPlan({ period, periodUnit, goal, details }) {
  const system = `당신은 전문 라이프코치입니다. 사용자의 목표와 기간을 바탕으로 구체적이고 실행 가능한 주간 계획을 JSON으로 만들어주세요.

출력 형식 (순수 JSON, 코드블록 없음):
{
  "summary": "전체 계획 요약 2~3문장",
  "totalWeeks": 숫자,
  "weeks": [
    {
      "weekNum": 1,
      "theme": "이번 주 핵심 테마 (15자 이내)",
      "mon": ["할일 (20자 이내)", ...],
      "tue": [...], "wed": [...], "thu": [...],
      "fri": [...], "sat": [...], "sun": [...]
    }
  ],
  "tips": ["실천 팁 3~4개"]
}

규칙: 각 요일 1~3개 항목, 항목은 구체적인 행동 단위, 절대로 사용자가 언급한 목표와 계획에 있는 단어중 관련되지 않은 한국어 외의 다른 단어를 답변이나 계획에 사용해서는 안됨`

  const user = `기간: ${period}${periodUnit}\n목표: ${goal}\n세부사항: ${details || '없음'}`
  return ask(system, user)
}

/* ── ② 최근 기록 기반 자동 생성 ── */
export async function generateAutoNextWeek(recentData) {
  const system = `당신은 개인 AI 플래너입니다. 사용자의 최근 2주 플래너 기록을 분석해서 다음 주 계획을 제안해주세요. 절대로 사용자가 언급한 목표와 계획에 있는 단어중 관련되지 않은 한국어 외의 다른 단어를 답변이나 계획에 사용해서는 안됨.

출력 형식 (순수 JSON, 코드블록 없음):
{
  "analysis": "패턴 분석 요약 2~3문장",
  "completionRate": 숫자(0~100),
  "insights": ["인사이트 2~3개"],
  "nextWeek": {
    "mon": ["할일", ...],
    "tue": [...], "wed": [...], "thu": [...],
    "fri": [...], "sat": [...], "sun": [...]
  }
}

분석 기준:
- 완료율 낮은 요일/시간대 파악
- 반복 등장하는 패턴 인식
- 미완료 항목 중 중요한 것 이어받기
- 점진적 난이도 조정`

  const user = `최근 플래너 기록:\n${JSON.stringify(recentData, null, 2)}`
  return ask(system, user)
}
