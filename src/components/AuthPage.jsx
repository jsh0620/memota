import React, { useState } from 'react'
import { register, login } from '../utils/authApi'

export default function AuthPage({ onLogin }) {
  const [mode, setMode]         = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [theme, setTheme]       = useState(() => localStorage.getItem('planai-theme') || 'dark')

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('planai-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  async function handleSubmit() {
    setError(''); setSuccess('')
    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.'); return
    }
    if (mode === 'register') {
      if (password !== confirm) { setError('비밀번호가 일치하지 않습니다.'); return }
      if (password.length < 6)  { setError('비밀번호는 6자 이상이어야 합니다.'); return }
    }
    setLoading(true)
    try {
      if (mode === 'register') {
        await register(username.trim(), password)
        setSuccess('가입이 완료되었습니다! 로그인해주세요.')
        setMode('login')
        setPassword(''); setConfirm('')
      } else {
        const data = await login(username.trim(), password)
        onLogin(data.user)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function onKey(e) { if (e.key === 'Enter') handleSubmit() }

  return (
    <div className="auth-wrap">
      <div className="auth-box">

        {/* 테마 토글 — 박스 안 우상단 */}
        <button
          className="theme-toggle"
          style={{ position: 'absolute', top: 14, right: 14 }}
          onClick={toggleTheme}
          title="테마 변경"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className="auth-logo">
          <div className="auth-logo-icon">✦</div>
          <div className="auth-logo-name">memota</div>
          <div className="auth-logo-sub">AI-POWERED PLANNER</div>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); setSuccess('') }}
          >로그인</button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); setSuccess('') }}
          >회원가입</button>
        </div>

        <div className="auth-form">
          <div className="auth-field">
            <label className="auth-label">아이디</label>
            <input
              className="auth-input"
              type="text"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={onKey}
              autoComplete="username"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">비밀번호</label>
            <input
              className="auth-input"
              type="password"
              placeholder="비밀번호를 입력하세요 (6자 이상)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={onKey}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          {mode === 'register' && (
            <div className="auth-field">
              <label className="auth-label">비밀번호 확인</label>
              <input
                className="auth-input"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={onKey}
                autoComplete="new-password"
              />
            </div>
          )}

          {error   && <div className="auth-error">⚠ {error}</div>}
          {success && <div className="auth-success">✓ {success}</div>}

          <button
            className="auth-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '처리 중...' : mode === 'login' ? '로그인' : '가입하기'}
          </button>
        </div>

        <div className="auth-footer">
          개인 플래너 데이터는 암호화되어 안전하게 저장됩니다
        </div>
      </div>
    </div>
  )
}
