export function getStoredApiKey() { return localStorage.getItem('planai-apikey') || '' }
export function saveApiKey(key)   { localStorage.setItem('planai-apikey', key.trim()) }
export function clearApiKey()     { localStorage.removeItem('planai-apikey') }

async function ask(system, fewShot, user) {
  const KEY = import.meta.env.VITE_GROQ_API_KEY || getStoredApiKey()
  if (!KEY) throw new Error('API 키가 설정되지 않았습니다. ⚙ 설정에서 Groq API 키를 입력해주세요.')

  const messages = [
    { role: 'system', content: system },
    ...fewShot,
    { role: 'user', content: user },
  ]

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.45,
      max_tokens: 2500,
    }),
  })

  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    if (res.status === 401) throw new Error('API 키가 유효하지 않습니다. 키를 다시 확인해주세요.')
    throw new Error(j?.error?.message ?? `API 오류 ${res.status}`)
  }

  const data = await res.json()
  let text = data.choices?.[0]?.message?.content ?? ''

  // ── 안전장치: 한글/숫자/공백/문장부호 외 외국어 감지 ──
  const foreignRegex = /[^가-힣0-9\s.,!?:%~()\[\]{}"'\-_\n\r]/g
  const foreignMatches = text.match(foreignRegex)
  if (foreignMatches) {
    console.warn('외국어 감지:', [...new Set(foreignMatches)].join(''))
    // JSON 키·구조 문자(영문 키)는 유지하면서 값 내 외국어만 제거
    // JSON 파싱 후 값 레벨에서 필터링
  }

  const clean = text.replace(/```json|```/g, '').trim()

  let parsed
  try {
    parsed = JSON.parse(clean)
  } catch {
    // JSON 파싱 실패 시 외국어 제거 후 재시도
    const cleaned = clean.replace(/[^\x00-\x7F가-힣0-9\s.,!?:%~()\[\]{}"'\-_\n\r]/g, '')
    parsed = JSON.parse(cleaned)
  }

  // ── 파싱된 JSON 내 문자열 값에서 외국어 제거 ──
  return sanitizeKorean(parsed)
}

// JSON 내 모든 문자열 값에서 한글 외 문자 제거 (JSON 키는 유지)
function sanitizeKorean(obj) {
  if (typeof obj === 'string') {
    // 한글, 숫자, 공백, 기본 문장부호만 허용
    return obj.replace(/[^\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F0-9\s.,!?:%~()\-]/g, '').trim()
  }
  if (Array.isArray(obj)) return obj.map(sanitizeKorean)
  if (obj && typeof obj === 'object') {
    const result = {}
    for (const [k, v] of Object.entries(obj)) result[k] = sanitizeKorean(v)
    return result
  }
  return obj
}

/* ── ① 기간 목표 기반 계획 ── */
export async function generateGoalPlan({ period, periodUnit, goal, details }) {
  const system = `당신은 한국어만 사용하는 전문 라이프코치입니다.

[필수 규칙]
1. 모든 출력은 반드시 '한글'로만 작성합니다.
2. 영어 단어도 한글 발음으로 표기합니다. (React → 리액트, AI → 인공지능, app → 앱)
3. JSON 형식을 엄격히 지키며, 한글 이외의 문자가 값에 포함되면 시스템 오류가 발생합니다.
4. 순수 JSON만 출력하고 코드블록(\`\`\`)은 절대 사용하지 않습니다.

[출력 형식]
{
  "summary": "전체 계획 요약 2~3문장",
  "totalWeeks": 숫자,
  "weeks": [
    {
      "weekNum": 1,
      "theme": "이번 주 핵심 테마 (15자 이내)",
      "mon": ["할일 (20자 이내)"],
      "tue": [], "wed": [], "thu": [], "fri": [], "sat": [], "sun": []
    }
  ],
  "tips": ["실천 팁"]
}

[계획 규칙]
- 각 요일 1~3개 항목
- 사용자가 언급한 가용 요일에만 계획 배정
- 주말이라고 해서 특별히 복습/휴식/회고로 고정하지 말 것. 세부사항에 주말 관련 언급이 없다면 평일과 동일하게 자유롭게 계획 배정
- 주차가 지날수록 난이도 점진적으로 상승`

  const fewShot = [
    {
      role: 'user',
      content: '기간: 1주\n목표: React 공부\n세부사항: 매일 저녁 2시간 가능'
    },
    {
      role: 'assistant',
      content: JSON.stringify({
        summary: '리액트 기초를 다지는 1주 계획입니다. 매일 꾸준히 학습하여 기본 개념을 완성합니다.',
        totalWeeks: 1,
        weeks: [{
          weekNum: 1,
          theme: '리액트 기초 완성',
          mon: ['리액트 컴포넌트 개념 학습하기'],
          tue: ['상태 관리 기초 익히기'],
          wed: ['이벤트 처리 실습하기'],
          thu: ['리스트 렌더링 연습하기'],
          fri: ['간단한 앱 만들어보기'],
          sat: ['실습 프로젝트 만들어보기'],
          sun: ['이번 주 내용 정리하기']
        }],
        tips: ['매일 같은 시간에 학습하는 습관을 들이세요.', '모르는 내용은 바로 검색하여 해결하세요.']
      })
    }
  ]

  const user = `기간: ${period}${periodUnit}\n목표: ${goal}\n세부사항: ${details || '없음'}`
  return ask(system, fewShot, user)
}

/* ── ② 최근 기록 기반 자동 생성 ── */
export async function generateAutoNextWeek(recentData) {
  const system = `당신은 한국어만 사용하는 개인 인공지능 플래너입니다.

[필수 규칙]
1. 모든 출력은 반드시 '한글'로만 작성합니다.
2. 영어 단어도 한글 발음으로 표기합니다. (app → 앱, AI → 인공지능)
3. JSON 형식을 엄격히 지키며, 한글 이외의 문자가 값에 포함되면 시스템 오류가 발생합니다.
4. 순수 JSON만 출력하고 코드블록(\`\`\`)은 절대 사용하지 않습니다.

[출력 형식]
{
  "analysis": "패턴 분석 요약 2~3문장",
  "completionRate": 숫자(0~100),
  "insights": ["인사이트"],
  "nextWeek": {
    "mon": ["할일"], "tue": [], "wed": [], "thu": [], "fri": [], "sat": [], "sun": []
  }
}

[분석 규칙]
- 완료율 낮은 요일은 할일 수를 줄여 달성 가능하게 조정
- 미완료 항목 중 중요한 것을 이어받기
- 점진적 난이도 조정
- 모든 할일은 구체적인 행동 단위로 작성`

  const fewShot = [
    {
      role: 'user',
      content: '최근 플래너 기록:\n{"2025-03-17": {"label": "3.17~3.23", "days": {"mon": [{"text": "운동하기", "done": true}], "tue": [{"text": "독서하기", "done": false}]}}}'
    },
    {
      role: 'assistant',
      content: JSON.stringify({
        analysis: '저번 주 운동은 잘 완료하셨지만 독서는 미완료되었습니다. 이번 주는 독서 시간을 확보하는 데 집중합니다.',
        completionRate: 50,
        insights: ['운동 루틴은 잘 유지되고 있습니다.', '독서 목표를 더 짧게 조정해보세요.'],
        nextWeek: {
          mon: ['가벼운 운동 30분 하기'],
          tue: ['책 10쪽 읽기'],
          wed: ['운동 30분 하기'],
          thu: ['책 10쪽 읽기'],
          fri: ['이번 주 돌아보기'],
          sat: ['가벼운 운동 30분 하기'],
          sun: ['이번 주 돌아보기']
        }
      })
    }
  ]

  const user = `최근 플래너 기록:\n${JSON.stringify(recentData, null, 2)}`
  return ask(system, fewShot, user)
}