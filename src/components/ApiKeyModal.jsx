import React, { useState } from 'react'
import { saveApiKey, getStoredApiKey, clearApiKey } from '../utils/claudeApi'

export default function ApiKeyModal({ onClose }) {
  const current = getStoredApiKey()
  const [input, setInput] = useState(current)
  const [show, setShow]   = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function handleSave() {
    const trimmed = input.trim()
    if (!trimmed) { setError('API 키를 입력해주세요.'); return }
    if (!trimmed.startsWith('gsk_')) { setError('올바른 Groq API 키 형식이 아닙니다. (gsk_ 로 시작해야 합니다)'); return }
    saveApiKey(trimmed)
    setSaved(true)
    setError('')
    setTimeout(() => onClose(), 900)
  }

  function handleClear() {
    clearApiKey()
    setInput('')
    setSaved(false)
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-title">⚙ API 키 설정</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-desc">
            AI 기능을 사용하려면 <strong>Groq API 키</strong>가 필요합니다.
            키는 이 브라우저에만 저장되며 서버로 전송되지 않습니다.
          </p>

          <div className="modal-steps">
            <div className="step">
              <span className="step-num">1</span>
              <span className="step-text">
                <a href="https://console.groq.com" target="_blank" rel="noreferrer">
                  console.groq.com
                </a>
                &nbsp;접속 → Google 계정으로 로그인
              </span>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <span className="step-text">좌측 메뉴 <strong>API Keys</strong> → <strong>Create API Key</strong> 클릭</span>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <span className="step-text">생성된 키 (<code>gsk_...</code>) 를 아래에 붙여넣기</span>
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-label">Groq API Key</label>
            <div className="key-input-wrap">
              <input
                type={show ? 'text' : 'password'}
                className="key-input"
                placeholder="gsk_..."
                value={input}
                onChange={e => { setInput(e.target.value); setError(''); setSaved(false) }}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                spellCheck={false}
                autoComplete="off"
              />
              <button className="key-toggle" onClick={() => setShow(s => !s)}>
                {show ? '🙈' : '👁'}
              </button>
            </div>
            {error && <div className="key-error">{error}</div>}
            {saved && <div className="key-success">✓ 저장되었습니다!</div>}
          </div>

          <div className="modal-notice">
            🔒 키는 이 기기의 localStorage에만 저장됩니다. 완전 무료 플랜으로 사용 가능합니다.
          </div>
        </div>

        <div className="modal-footer">
          {current && (
            <button className="btn-ghost" onClick={handleClear}>키 삭제</button>
          )}
          <button className="btn-primary" onClick={handleSave} style={{ marginTop: 0 }}>
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
