import React, { useState } from 'react';
import { api, saveSession } from '../services/api';

export default function Login({ setUserSession, navigateTo, setSuccessMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [errors, setErrors] = useState({});

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!email) {
      validationErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      validationErrors.password = 'Password is required.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = await api.login({ email, password });
      saveSession(data.token);
      setUserSession(data.user);
      setSuccessMessage(`Welcome back, ${data.user.name}!`);
      navigateTo('home');
    } catch (error) {
      setErrors({ form: error.message });
    }
  };

  return (
    <div style={styles.pageWrap}>
      <div style={styles.authCard}>
        {/* Top Accent Gradient Line */}
        <div style={styles.topGradient} />

        <div style={styles.cardContent}>
          <div style={styles.headerBlock}>
            <h2 style={styles.formTitle}>Sign in to SocialConnect</h2>
            <p style={styles.formSubtitle}>Access community action items and analytics</p>
          </div>

          <form onSubmit={handleLoginSubmit} noValidate style={styles.formGroup}>
            <div style={styles.inputBlock}>
              <label style={styles.label} htmlFor="email-input">Email Address</label>
              <input 
                id="email-input"
                type="email" 
                value={email} 
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                onChange={(e) => { 
                  setEmail(e.target.value); 
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' })); 
                }} 
                style={{
                  ...styles.inputField, 
                  ...(focusedInput === 'email' ? styles.inputFocused : {}),
                  borderColor: errors.email ? '#ef4444' : (focusedInput === 'email' ? '#0284c7' : '#cbd5e1')
                }}
                placeholder="name@example.com" 
              />
              {errors.email && <span style={styles.errText}>{errors.email}</span>}
            </div>

            <div style={styles.inputBlock}>
              <label style={styles.label} htmlFor="password-input">Password</label>
              <input 
                id="password-input"
                type="password" 
                value={password} 
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                onChange={(e) => { 
                  setPassword(e.target.value); 
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' })); 
                }} 
                style={{
                  ...styles.inputField, 
                  ...(focusedInput === 'password' ? styles.inputFocused : {}),
                  borderColor: errors.password ? '#ef4444' : (focusedInput === 'password' ? '#0284c7' : '#cbd5e1')
                }}
                placeholder="••••••••" 
              />
              {errors.password && <span style={styles.errText}>{errors.password}</span>}
            </div>

            {errors.form && <span style={{...styles.errText, marginBottom: '10px'}}>{errors.form}</span>}
            <button type="submit" style={styles.submitBtn}>
              Sign In to Platform →
            </button>
          </form>

          <div style={styles.formFooter}>
            Don't have an account yet?{' '}
            <span style={styles.linkText} onClick={() => navigateTo('register')}>
              Register
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrap: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px 20px',
    backgroundColor: '#f8fafc',
    backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
    backgroundSize: '24px 24px'
  },
  authCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '420px',
    borderRadius: '16px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.02)',
    overflow: 'hidden'
  },
  topGradient: { height: '6px', background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)' },
  cardContent: { padding: '36px' },
  headerBlock: { marginBottom: '28px', textAlign: 'center' },
  formTitle: { fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em' },
  formSubtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  formGroup: { display: 'flex', flexDirection: 'column' },
  inputBlock: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#334155' },
  inputField: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    transition: 'all 0.2s ease'
  },
  inputFocused: {
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 4px rgba(2, 132, 199, 0.12)'
  },
  errText: { color: '#ef4444', fontSize: '12px', fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
    transition: 'all 0.2s ease'
  },
  formFooter: { marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#64748b' },
  linkText: { color: '#0284c7', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }
};