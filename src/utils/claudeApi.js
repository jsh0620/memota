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

// ── 공통 fetch (Gemini) ──
async function ask(system, user) {
  const KEY = import.meta.env.VITE_GEMINI_API_KEY || getStoredApiKey()
  if (!KEY) {
    throw new Error('API 키가 설정되지 않았습니다.')
  }

  const prompt = `${system}\n\n${user}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2500,
        },
      }),
    }
  )

  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    const msg = j?.error?.message ?? `API 오류 ${res.status}`
    if (res.status === 400) throw new Error('API 키가 유효하지 않습니다. 키를 다시 확인해주세요.')
    throw new Error(msg)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
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

규칙: 각 요일 1~3개 항목, 항목은 구체적인 행동 단위, 주말은 복습/회고/휴식 위주`

  const user = `기간: ${period}${periodUnit}\n목표: ${goal}\n세부사항: ${details || '없음'}`
  return ask(system, user)
}

/* ── ② 최근 기록 기반 자동 생성 ── */
export async function generateAutoNextWeek(recentData) {
  const system = `당신은 개인 AI 플래너입니다. 사용자의 최근 2주 플래너 기록을 분석해서 다음 주 계획을 제안해주세요.

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