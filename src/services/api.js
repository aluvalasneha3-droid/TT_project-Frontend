export const API_BASE_URL = 'http://localhost:8080/api'

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('candlecraft-token')
  const { headers = {}, ...requestOptions } = options
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed (${response.status}).`)
  }

  return data
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value || 0))
}
