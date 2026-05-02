import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="auth-container">
        <div className="form-card auth-card">
          <h2>Email Sent</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Check your inbox for a password reset link.
          </p>
          <Link to="/login" className="btn btn-primary auth-btn">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="form-card auth-card">
        <h2>Reset Password</h2>
        <p className="auth-subtitle">Enter your email to receive a reset link</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleReset}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
