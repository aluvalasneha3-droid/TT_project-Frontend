import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

const AuthContext = createContext(null)

async function fetchAccountData() {
  const [portfolio, transactions] = await Promise.all([
    apiRequest('/portfolio'),
    apiRequest('/transactions'),
  ])

  return { portfolio, transactions }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('candlecraft-user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(localStorage.getItem('candlecraft-token') || '')
  const [stocks, setStocks] = useState([])
  const [stocksLoading, setStocksLoading] = useState(true)
  const [stocksError, setStocksError] = useState('')
  const [holdings, setHoldings] = useState([])
  const [transactions, setTransactions] = useState([])
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('candlecraft-watchlist') || '[]')
    } catch {
      return []
    }
  })

  const logout = () => {
    setUser(null)
    setToken('')
    setHoldings([])
    setTransactions([])
    localStorage.removeItem('candlecraft-user')
    localStorage.removeItem('candlecraft-token')
  }

  useEffect(() => {
    apiRequest('/stocks')
      .then(setStocks)
      .catch((error) => setStocksError(error.message))
      .finally(() => setStocksLoading(false))
  }, [])

  useEffect(() => {
    if (!token) return

    fetchAccountData()
      .then(({ portfolio, transactions: accountTransactions }) => {
        setHoldings(portfolio.holdings)
        setTransactions(accountTransactions)
        setUser((currentUser) => {
          const updatedUser = { ...currentUser, balance: Number(portfolio.balance) }
          localStorage.setItem('candlecraft-user', JSON.stringify(updatedUser))
          return updatedUser
        })
      })
      .catch(() => logout())
  }, [token])

  const saveAuth = (response) => {
    const nextUser = {
      id: response.userId,
      username: response.username,
      email: response.email,
      balance: Number(response.balance),
    }

    localStorage.setItem('candlecraft-token', response.token)
    localStorage.setItem('candlecraft-user', JSON.stringify(nextUser))
    setToken(response.token)
    setUser(nextUser)
  }

  const login = async (username, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    saveAuth(response)
  }

  const register = async (username, email, password) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    })
    saveAuth(response)
  }

  const trade = async ({ type, symbol, quantity }) => {
    const response = await apiRequest(`/trades/${type.toLowerCase()}`, {
      method: 'POST',
      body: JSON.stringify({ symbol, quantity }),
    })
    const { portfolio, transactions: accountTransactions } = await fetchAccountData()
    setHoldings(portfolio.holdings)
    setTransactions(accountTransactions)
    setUser((currentUser) => {
      const updatedUser = { ...currentUser, balance: Number(portfolio.balance) }
      localStorage.setItem('candlecraft-user', JSON.stringify(updatedUser))
      return updatedUser
    })
    return response
  }

  const toggleWatchlist = (symbol) => {
    setWatchlist((currentWatchlist) => {
      const nextWatchlist = currentWatchlist.includes(symbol)
        ? currentWatchlist.filter((item) => item !== symbol)
        : [...currentWatchlist, symbol]
      localStorage.setItem('candlecraft-watchlist', JSON.stringify(nextWatchlist))
      return nextWatchlist
    })
  }

  const value = {
    user,
    token,
    stocks,
    stocksLoading,
    stocksError,
    holdings,
    transactions,
    watchlist,
    isAuthenticated: Boolean(token && user),
    balance: user?.balance ?? 0,
    login,
    register,
    logout,
    trade,
    toggleWatchlist,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}
