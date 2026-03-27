const BASE = '/api'

// ── 토큰 관리 ──
export function getToken() {
  return localStorage.getItem('memota-token')
}
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('memota-user'))
  } catch { return null }
}
export function setAuth(token, user) {
  localStorage.setItem('memota-token', token)
  localStorage.setItem('memota-user', JSON.stringify(user))
}
export function clearAuth() {
  localStorage.removeItem('memota-token')
  localStorage.removeItem('memota-user')
}
export function isLoggedIn() {
  return Boolean(getToken())
}

// ── API 호출 헬퍼 ──
async function call(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? '오류가 발생했습니다.')
  return data
}

// ── 인증 ──
export async function register(username, password) {
  return call('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function login(username, password) {
  const data = await call('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  setAuth(data.token, data.user)
  return data
}

export function logout() {
  clearAuth()
}

// ── 플래너 데이터 ──
export async function fetchPlans() {
  const data = await call('/plans/get')
  return data.plans ?? {}
}

export async function savePlans(plans) {
  return call('/plans/save', {
    method: 'POST',
    body: JSON.stringify({ plans }),
  })
}
