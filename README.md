# PLANAI — AI 기반 스마트 플래너

## 🔒 보안 방식
각 사용자가 **자신의 Anthropic API 키를 직접 입력**해서 사용합니다.
개발자의 키가 노출되지 않으며, API 비용도 사용자 본인에게 청구됩니다.

---

## 🚀 Vercel 배포 (무료, 5분)

### 1. GitHub에 올리기
```bash
git init
git add .
git commit -m "init"
# GitHub에서 새 레포 만든 후:
git remote add origin https://github.com/YOUR_ID/ai-planner.git
git push -u origin main
```

### 2. Vercel 배포
1. [vercel.com](https://vercel.com) → GitHub 로그인
2. **Add New Project** → 레포 선택
3. 그대로 **Deploy** 클릭 (환경변수 불필요!)
4. 배포 완료 → `https://ai-planner-xxx.vercel.app` 링크 공유

> `.env` 파일 없이도 완전히 동작합니다.
> 사용자가 앱에서 직접 API 키를 입력합니다.

---

## 💻 로컬 개발

```bash
npm install
npm run dev
# http://localhost:5173 접속 후 ⚙ 버튼으로 API 키 입력
```

---

## 사용 방법 (테스터 안내)

1. 배포된 URL 접속
2. 좌측 하단 **"API 키 설정 필요"** 버튼 클릭
3. [console.anthropic.com](https://console.anthropic.com) 에서 API 키 발급
4. 키 입력 후 저장
5. 🎯 AI 기능 사용 시작!

---

## 기술 스택
- React 18 + Vite
- useReducer + Context (상태관리)
- localStorage (데이터 + API 키 저장)
- Claude API claude-sonnet-4-20250514
- date-fns
