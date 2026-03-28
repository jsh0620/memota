import React from 'react'

// ── 다크모드 일러스트: 밤하늘 (배경과 자연스럽게 이어짐) ──
function DarkIllustration({ variant }) {
  const isAuto = variant === 'auto'
  return (
    <svg width="100%" viewBox="0 0 480 520" xmlns="http://www.w3.org/2000/svg">
      {/* 배경 — 다크모드 배경색과 동일하게 */}
      <rect x="0" y="0" width="480" height="520" fill="#1a1a2a" rx="16"/>

      {/* 지평선 산 레이어 */}
      <path d="M0 420 L50 340 L110 380 L170 300 L240 360 L300 290 L360 340 L420 310 L480 350 L480 520 L0 520Z" fill="#131322"/>
      <path d="M0 460 L70 410 L140 435 L210 400 L280 425 L350 395 L420 415 L480 400 L480 520 L0 520Z" fill="#161628"/>
      <path d="M0 490 L80 470 L180 482 L280 468 L380 478 L480 470 L480 520 L0 520Z" fill="#1c1c30"/>

      {/* 달 */}
      <circle cx="370" cy="110" r="45" fill="#f0dfa0"/>
      <circle cx="352" cy="96" r="45" fill="#1a1a2a"/>
      <circle cx="380" cy="98" r="5" fill="#e0cc88" opacity="0.35"/>
      <circle cx="360" cy="122" r="3" fill="#e0cc88" opacity="0.28"/>
      <circle cx="390" cy="118" r="4" fill="#e0cc88" opacity="0.22"/>
      <circle cx="370" cy="110" r="60" fill="none" stroke="#f0dfa0" strokeWidth="1" opacity="0.06"/>
      <circle cx="370" cy="110" r="72" fill="none" stroke="#f0dfa0" strokeWidth="0.5" opacity="0.04"/>

      {/* 별 — 큰 것 */}
      <circle cx="40" cy="50" r="2" fill="#fff" opacity="0.9"/>
      <circle cx="120" cy="80" r="1.8" fill="#fffde0" opacity="0.85"/>
      <circle cx="200" cy="40" r="2" fill="#fff" opacity="0.8"/>
      <circle cx="280" cy="70" r="1.8" fill="#e8eeff" opacity="0.85"/>
      <circle cx="60" cy="160" r="2" fill="#fff" opacity="0.85"/>
      <circle cx="160" cy="200" r="1.8" fill="#fffde0" opacity="0.8"/>
      <circle cx="420" cy="200" r="2" fill="#fff" opacity="0.85"/>
      <circle cx="30" cy="280" r="1.8" fill="#e8eeff" opacity="0.8"/>
      <circle cx="440" cy="280" r="2" fill="#fffde0" opacity="0.85"/>

      {/* 별 — 중간 */}
      <circle cx="80" cy="110" r="1.3" fill="#fff" opacity="0.7"/>
      <circle cx="155" cy="130" r="1.3" fill="#fffde0" opacity="0.65"/>
      <circle cx="240" cy="100" r="1.3" fill="#fff" opacity="0.7"/>
      <circle cx="320" cy="150" r="1.3" fill="#e8eeff" opacity="0.65"/>
      <circle cx="100" cy="230" r="1.3" fill="#fff" opacity="0.7"/>
      <circle cx="380" cy="160" r="1.3" fill="#fffde0" opacity="0.65"/>
      <circle cx="460" cy="130" r="1.3" fill="#fff" opacity="0.7"/>
      <circle cx="210" cy="250" r="1.3" fill="#e8eeff" opacity="0.65"/>
      <circle cx="340" cy="240" r="1.3" fill="#fff" opacity="0.7"/>

      {/* 별 — 작은 것 */}
      <circle cx="55" cy="85" r="0.9" fill="#fff" opacity="0.55"/>
      <circle cx="100" cy="55" r="0.9" fill="#fffde0" opacity="0.5"/>
      <circle cx="175" cy="65" r="0.9" fill="#fff" opacity="0.55"/>
      <circle cx="255" cy="55" r="0.9" fill="#e8eeff" opacity="0.5"/>
      <circle cx="310" cy="90" r="0.9" fill="#fff" opacity="0.55"/>
      <circle cx="450" cy="80" r="0.9" fill="#fffde0" opacity="0.5"/>
      <circle cx="135" cy="180" r="0.9" fill="#fff" opacity="0.5"/>
      <circle cx="270" cy="190" r="0.9" fill="#e8eeff" opacity="0.55"/>
      <circle cx="410" cy="240" r="0.9" fill="#fff" opacity="0.5"/>
      <circle cx="50" cy="320" r="0.9" fill="#fffde0" opacity="0.5"/>
      <circle cx="460" cy="340" r="0.9" fill="#fff" opacity="0.55"/>

      {/* 별자리 연결선 */}
      <line x1="40" y1="50" x2="120" y2="80" stroke="#a78bfa" strokeWidth="0.5" opacity="0.2"/>
      <line x1="120" y1="80" x2="200" y2="40" stroke="#a78bfa" strokeWidth="0.5" opacity="0.2"/>
      <line x1="200" y1="40" x2="280" y2="70" stroke="#a78bfa" strokeWidth="0.5" opacity="0.2"/>
      <line x1="60" y1="160" x2="30" y2="280" stroke="#e8b86d" strokeWidth="0.5" opacity="0.18"/>
      <line x1="30" y1="280" x2="100" y2="230" stroke="#e8b86d" strokeWidth="0.5" opacity="0.18"/>
      <line x1="420" y1="200" x2="440" y2="280" stroke="#a78bfa" strokeWidth="0.5" opacity="0.18"/>
      <line x1="440" y1="280" x2="380" y2="160" stroke="#a78bfa" strokeWidth="0.5" opacity="0.18"/>

      {/* 반짝이는 별 (십자형) */}
      <line x1="280" y1="68" x2="280" y2="76" stroke="#fff" strokeWidth="0.9" opacity="0.85"/>
      <line x1="276" y1="72" x2="284" y2="72" stroke="#fff" strokeWidth="0.9" opacity="0.85"/>
      <circle cx="280" cy="72" r="1.8" fill="#fff" opacity="0.85"/>

      <line x1="40" y1="47" x2="40" y2="55" stroke="#fffde0" strokeWidth="0.8" opacity="0.9"/>
      <line x1="36" y1="51" x2="44" y2="51" stroke="#fffde0" strokeWidth="0.8" opacity="0.9"/>

      {/* 유성 */}
      <line x1="130" y1="100" x2="175" y2="135" stroke="#fff" strokeWidth="1.2" opacity="0.65" strokeLinecap="round"/>
      <line x1="133" y1="103" x2="150" y2="115" stroke="#fff" strokeWidth="0.6" opacity="0.28"/>

      {/* variant별 추가 요소 */}
      {isAuto ? (
        <>
          {/* AI 자동: 차트/분석 느낌의 점선 궤도 */}
          <circle cx="240" cy="320" r="70" fill="none" stroke="#a78bfa" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.25"/>
          <circle cx="240" cy="320" r="45" fill="none" stroke="#e8b86d" strokeWidth="0.6" strokeDasharray="3 5" opacity="0.2"/>
          <circle cx="240" cy="320" r="8" fill="#a78bfa" opacity="0.35"/>
          <circle cx="240" cy="320" r="4" fill="#a78bfa" opacity="0.6"/>
          {/* 궤도 위 행성들 */}
          <circle cx="310" cy="320" r="5" fill="#e8b86d" opacity="0.7"/>
          <circle cx="170" cy="320" r="4" fill="#4ade9e" opacity="0.6"/>
          <circle cx="240" cy="250" r="3" fill="#60a5fa" opacity="0.6"/>
          <circle cx="240" cy="390" r="3.5" fill="#f87171" opacity="0.5"/>
        </>
      ) : (
        <>
          {/* AI 계획: 나침반/목표 느낌 */}
          <circle cx="240" cy="330" r="65" fill="none" stroke="#e8b86d" strokeWidth="0.8" opacity="0.2"/>
          <circle cx="240" cy="330" r="48" fill="none" stroke="#a78bfa" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.18"/>
          <line x1="240" y1="268" x2="240" y2="395" stroke="#e8b86d" strokeWidth="0.6" opacity="0.2"/>
          <line x1="175" y1="330" x2="305" y2="330" stroke="#e8b86d" strokeWidth="0.6" opacity="0.2"/>
          {/* 나침반 바늘 */}
          <line x1="240" y1="330" x2="265" y2="298" stroke="#e8b86d" strokeWidth="2" opacity="0.7" strokeLinecap="round"/>
          <line x1="240" y1="330" x2="218" y2="358" stroke="#a78bfa" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
          <circle cx="240" cy="330" r="5" fill="#e8b86d" opacity="0.8"/>
          <circle cx="240" cy="330" r="2.5" fill="#1a1a2a"/>
        </>
      )}

      {/* 은하수 느낌 희미한 띠 */}
      <ellipse cx="240" cy="200" rx="180" ry="20" fill="#a78bfa" opacity="0.025" transform="rotate(-15 240 200)"/>

      {/* 하단 브랜드 */}
      <text x="240" y="500" textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fill="#e8b86d" opacity="0.4" letterSpacing="6">memota</text>
    </svg>
  )
}

// ── 라이트모드 일러스트: 낮하늘/구름 ──
function LightIllustration({ variant }) {
  const isAuto = variant === 'auto'
  return (
    <svg width="100%" viewBox="0 0 480 520" xmlns="http://www.w3.org/2000/svg">
      {/* 배경 — 라이트모드 배경색과 어울리는 하늘빛 */}
      <rect x="0" y="0" width="480" height="520" fill="#eeeef6" rx="16"/>

      {/* 하늘 그라디언트 느낌 (flat 레이어) */}
      <rect x="0" y="0" width="480" height="280" fill="#e8eaf8" rx="16"/>
      <rect x="0" y="280" width="480" height="240" fill="#eeeef6"/>

      {/* 태양 */}
      <circle cx="370" cy="100" r="50" fill="#fde68a" opacity="0.9"/>
      <circle cx="370" cy="100" r="65" fill="none" stroke="#fde68a" strokeWidth="1.5" opacity="0.3"/>
      <circle cx="370" cy="100" r="80" fill="none" stroke="#fde68a" strokeWidth="1" opacity="0.15"/>
      {/* 태양 광선 */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        const x1 = 370 + 58 * Math.cos(rad)
        const y1 = 100 + 58 * Math.sin(rad)
        const x2 = 370 + 72 * Math.cos(rad)
        const y2 = 100 + 72 * Math.sin(rad)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fde68a" strokeWidth="2" opacity="0.5" strokeLinecap="round"/>
      })}

      {/* 구름 1 — 크고 선명 */}
      <ellipse cx="150" cy="140" rx="80" ry="35" fill="#ffffff" opacity="0.95"/>
      <ellipse cx="120" cy="148" rx="55" ry="30" fill="#ffffff" opacity="0.95"/>
      <ellipse cx="185" cy="148" rx="50" ry="28" fill="#ffffff" opacity="0.95"/>
      <ellipse cx="150" cy="158" rx="80" ry="22" fill="#ffffff" opacity="0.95"/>

      {/* 구름 2 — 중간 */}
      <ellipse cx="60" cy="220" rx="55" ry="24" fill="#ffffff" opacity="0.85"/>
      <ellipse cx="38" cy="228" rx="38" ry="20" fill="#ffffff" opacity="0.85"/>
      <ellipse cx="82" cy="228" rx="35" ry="20" fill="#ffffff" opacity="0.85"/>
      <ellipse cx="60" cy="234" rx="55" ry="15" fill="#ffffff" opacity="0.85"/>

      {/* 구름 3 — 작고 멀리 */}
      <ellipse cx="300" cy="170" rx="45" ry="20" fill="#ffffff" opacity="0.7"/>
      <ellipse cx="280" cy="177" rx="32" ry="17" fill="#ffffff" opacity="0.7"/>
      <ellipse cx="318" cy="177" rx="30" ry="16" fill="#ffffff" opacity="0.7"/>
      <ellipse cx="300" cy="183" rx="45" ry="12" fill="#ffffff" opacity="0.7"/>

      {/* 구름 4 — 배경 */}
      <ellipse cx="430" cy="195" rx="38" ry="17" fill="#e8eaf8" opacity="0.9"/>
      <ellipse cx="412" cy="202" rx="28" ry="14" fill="#e8eaf8" opacity="0.9"/>
      <ellipse cx="448" cy="202" rx="25" ry="13" fill="#e8eaf8" opacity="0.9"/>

      {/* 언덕 실루엣 */}
      <ellipse cx="100" cy="500" rx="180" ry="100" fill="#d8d8eb" opacity="0.6"/>
      <ellipse cx="380" cy="510" rx="160" ry="90" fill="#d8d8eb" opacity="0.5"/>
      <ellipse cx="240" cy="520" rx="220" ry="80" fill="#d0d0e8" opacity="0.4"/>

      {/* 작은 새들 */}
      <path d="M80 100 Q85 96 90 100 Q95 96 100 100" fill="none" stroke="#8888aa" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M108 90 Q113 86 118 90 Q123 86 128 90" fill="none" stroke="#8888aa" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M60 115 Q64 112 68 115 Q72 112 76 115" fill="none" stroke="#8888aa" strokeWidth="1.2" strokeLinecap="round"/>

      {/* variant별 추가 요소 */}
      {isAuto ? (
        <>
          {/* AI 자동: 분석/패턴 느낌의 원형 차트 */}
          <circle cx="240" cy="350" r="70" fill="#ffffff" opacity="0.6"/>
          <circle cx="240" cy="350" r="70" fill="none" stroke="#c4b5fd" strokeWidth="2" opacity="0.4"/>
          <circle cx="240" cy="350" r="50" fill="none" stroke="#c4a758" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.35"/>
          <circle cx="240" cy="350" r="8" fill="#c4b5fd" opacity="0.7"/>
          {/* 방향 화살표들 */}
          <line x1="240" y1="342" x2="240" y2="285" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
          <line x1="248" y1="292" x2="240" y2="285" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
          <line x1="232" y1="292" x2="240" y2="285" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
          <circle cx="310" cy="350" r="6" fill="#c4a758" opacity="0.6"/>
          <circle cx="170" cy="350" r="5" fill="#4ade9e" opacity="0.5"/>
          <circle cx="240" cy="420" r="4" fill="#f87171" opacity="0.45"/>
        </>
      ) : (
        <>
          {/* AI 계획: 나침반/목표 */}
          <circle cx="240" cy="355" r="70" fill="#ffffff" opacity="0.6"/>
          <circle cx="240" cy="355" r="70" fill="none" stroke="#c4a758" strokeWidth="2" opacity="0.35"/>
          <circle cx="240" cy="355" r="52" fill="none" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
          <line x1="240" y1="287" x2="240" y2="423" stroke="#c4a758" strokeWidth="0.8" opacity="0.25"/>
          <line x1="170" y1="355" x2="310" y2="355" stroke="#c4a758" strokeWidth="0.8" opacity="0.25"/>
          {/* 나침반 바늘 */}
          <line x1="240" y1="355" x2="262" y2="325" stroke="#c4a758" strokeWidth="2.5" opacity="0.75" strokeLinecap="round"/>
          <line x1="240" y1="355" x2="220" y2="382" stroke="#c4b5fd" strokeWidth="2" opacity="0.55" strokeLinecap="round"/>
          <circle cx="240" cy="355" r="6" fill="#c4a758" opacity="0.8"/>
          <circle cx="240" cy="355" r="3" fill="#ffffff"/>
        </>
      )}

      {/* 하단 브랜드 */}
      <text x="240" y="500" textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fill="#8080a8" opacity="0.45" letterSpacing="6">memota</text>
    </svg>
  )
}

// ── 공통 컴포넌트: 테마에 따라 자동 선택 ──
export default function AIIllustration({ variant = 'goal' }) {
  const theme = localStorage.getItem('planai-theme') || 'dark'
  const [currentTheme, setCurrentTheme] = React.useState(theme)

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute('data-theme') || 'dark'
      setCurrentTheme(t)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return currentTheme === 'light'
    ? <LightIllustration variant={variant} />
    : <DarkIllustration variant={variant} />
}
