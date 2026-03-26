# PLANAI — AI 기반 스마트 플래너

## 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env
# .env 파일을 열어 API 키 입력

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## Claude API 키 발급

1. https://console.anthropic.com 접속
2. 회원가입 / 로그인
3. **API Keys** 메뉴에서 새 키 생성
4. `.env` 파일에 붙여넣기:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-...
   ```

> ⚠️ `.env` 파일은 절대 git에 커밋하지 마세요 (`.gitignore`에 포함됨)

---

## 기능 안내

### 📅 주간 플래너
- 월~일 요일별 할 일 관리
- **Enter** 로 할 일 추가
- **더블클릭** 으로 내용 수정
- 체크버튼으로 완료 표시
- 사이드바 ◀▶ 로 주간 이동
- AI가 생성한 항목은 `AI` 뱃지 표시

### 🎯 AI 목표 플래너
- 기간(주/개월/년) + 목표 + 세부사항 입력
- Claude AI가 전체 기간의 주간 계획 자동 생성
- **플래너에 적용** 버튼으로 해당 주차에 자동 입력

### ✨ AI 자동 플래너
- 현재 + 이전 주 플래너 데이터를 분석
- 완료율, 패턴, 미완료 항목 기반으로 다음 주 계획 제안
- **다음 주에 적용** 버튼으로 바로 적용

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 18 + Vite |
| 상태관리 | useReducer + Context API |
| 데이터 저장 | localStorage |
| AI | Claude API (claude-sonnet-4) |
| 날짜 처리 | date-fns |

---

## 프로젝트 구조

```
src/
├── App.jsx                  # 루트 컴포넌트
├── main.jsx                 # 진입점
├── index.css                # 전체 디자인 시스템
├── context/
│   └── PlannerContext.jsx   # 전역 상태 관리
├── components/
│   ├── Sidebar.jsx          # 사이드바 네비게이션
│   └── WeeklyPlanner.jsx    # 주간 플래너 뷰
├── pages/
│   ├── AIGoalPage.jsx       # AI 목표 플래너
│   └── AIAutoPage.jsx       # AI 자동 플래너
└── utils/
    ├── claudeApi.js         # Claude API 호출
    └── dateUtils.js         # 날짜 유틸리티
```
