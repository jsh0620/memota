export function getStoredApiKey() { return localStorage.getItem('planai-apikey') || '' }
export function saveApiKey(key)   { localStorage.setItem('planai-apikey', key.trim()) }
export function clearApiKey()     { localStorage.removeItem('planai-apikey') }

async function ask(system, user) {
  const KEY = import.meta.env.VITE_GROQ_API_KEY || getStoredApiKey()
  if (!KEY) throw new Error('API 키가 설정되지 않았습니다. ⚙ 설정에서 Groq API 키를 입력해주세요.')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'qwen-qwq-32b',
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

export async function generateGoalPlan({ period, periodUnit, goal, details }) {
  const system = `당신은 한국어만 사용하는 전문 라이프코치입니다.
사용자의 목표와 기간을 바탕으로 구체적이고 실행 가능한 주간 계획을 JSON으로 만들어주세요.

[언어 규칙 - 절대적으로 준수]
- 모든 출력은 반드시 순수한 한국어로만 작성합니다
- 한자(漢字), 일본어(ひらがな·カタカナ·漢字), 중국어(简体/繁體), 러시아어(кириллица), 아랍어, 기타 모든 외국 문자 사용 절대 금지
- 영어 단어도 사용 금지 (예: React → 리액트, AI → 인공지능, app → 앱, TOEIC → 토익)
- 숫자와 기본 특수문자(!, ?, ., ,, %, ~)만 허용
- 이 규칙을 어기면 응답 전체가 무효입니다

[출력 형식 - 순수 JSON만, 코드블록 없음]
{
  "summary": "전체 계획 요약 2~3문장 (한국어만)",
  "totalWeeks": 숫자,
  "weeks": [
    {
      "weekNum": 1,
      "theme": "이번 주 핵심 테마 (15자 이내, 한국어만)",
      "mon": ["구체적인 할일 (20자 이내, 한국어만)", ...],
      "tue": [...], "wed": [...], "thu": [...],
      "fri": [...], "sat": [...], "sun": [...]
    }
  ],
  "tips": ["실천 팁 (한국어만)"]
}

[계획 작성 규칙]
- 각 요일 1~3개 항목
- 할일은 "~하기" 형태의 구체적 행동 단위로 작성
- 사용자가 언급한 가용 요일에만 계획 배정, 나머지는 빈 배열 []
- 주말(토,일)은 복습/회고/휴식/실전 연습 위주
- 주차가 지날수록 난이도와 양을 점진적으로 높임
- 사용자의 가용 시간을 철저히 반영하여 현실적인 양으로 조정`

  const user = `기간: ${period}${periodUnit}\n목표: ${goal}\n세부사항: ${details || '없음'}`
  return ask(system, user)
}

export async function generateAutoNextWeek(recentData) {
  const system = `당신은 한국어만 사용하는 개인 AI 플래너입니다.
사용자의 최근 2주 플래너 기록을 분석해서 다음 주 계획을 제안해주세요.

[언어 규칙 - 절대적으로 준수]
- 모든 출력은 반드시 순수한 한국어로만 작성합니다
- 한자(漢字), 일본어(ひらがな·カタカナ·漢字), 중국어(简体/繁體), 러시아어(кириллица), 아랍어, 기타 모든 외국 문자 사용 절대 금지
- 영어 단어도 사용 금지 (예: React → 리액트, AI → 인공지능, app → 앱)
- 숫자와 기본 특수문자(!, ?, ., ,, %, ~)만 허용
- 이 규칙을 어기면 응답 전체가 무효입니다

[출력 형식 - 순수 JSON만, 코드블록 없음]
{
  "analysis": "패턴 분석 요약 2~3문장 (한국어만)",
  "completionRate": 숫자(0~100),
  "insights": ["인사이트 (한국어만)"],
  "nextWeek": {
    "mon": ["할일 (한국어만)", ...],
    "tue": [...], "wed": [...], "thu": [...],
    "fri": [...], "sat": [...], "sun": [...]
  }
}

[분석 및 계획 작성 규칙]
- 완료율이 낮은 요일과 시간대를 파악하여 계획량 조정
- 반복 등장하는 패턴을 인식하여 습관 형성에 반영
- 미완료 항목 중 중요한 것을 이어받아 다음 주 계획에 포함
- 점진적으로 난이도를 높이되 현실적인 양 유지
- 모든 할일은 "~하기" 형태의 구체적 행동 단위로 작성
- 완료율이 낮았던 요일은 할일 수를 줄여 달성 가능하게 조정`

  const user = `최근 플래너 기록:\n${JSON.stringify(recentData, null, 2)}`
  return ask(system, user)
}
