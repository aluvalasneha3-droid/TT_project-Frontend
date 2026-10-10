import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await login(form.username, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p>Use your Candle Craft account to continue.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Username
            <input
              type="text"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              placeholder="demoTrader"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Enter password"
            />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="primary-btn full-width">
            Login
          </button>
        </form>

        <p className="auth-link">
          Need an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
