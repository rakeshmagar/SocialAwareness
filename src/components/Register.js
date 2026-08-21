import React, { useState } from 'react';
import { api } from '../services/api';

export default function Register({ navigateTo, setSuccessMessage }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'user', 
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.fullName.trim()) {
      validationErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 3) {
      validationErrors.fullName = 'Name must be at least 3 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      validationErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      validationErrors.email = 'Please provide a valid email format.';
    }

    const phoneRegex = /^[0-9\s+-]{8,15}$/;
    if (!formData.phone) {
      validationErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone)) {
      validationErrors.phone = 'Please enter a valid phone number (8-15 digits).';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeToTerms) {
      validationErrors.agreeToTerms = 'You must accept the Terms and Conditions to proceed.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password
      });
      setSuccessMessage(`Account created successfully for ${formData.fullName}! Please sign in.`);
      navigateTo('login');
    } catch (error) {
      setErrors({ form: error.message });
    }
  };

  return (
    <div style={styles.pageWrap}>
      <div style={styles.authCard}>
        <h2 style={styles.formTitle}>Create your account</h2>
        <p style={styles.formSubtitle}>Join the SocialConnect community</p>

        <form onSubmit={handleRegisterSubmit} noValidate style={styles.formGroup}>
          
          <div style={styles.inputBlock}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              style={{...styles.inputField, borderColor: errors.fullName ? '#ef4444' : '#cbd5e1'}} 
              placeholder="John Doe"
            />
            {errors.fullName && <span style={styles.errText}>{errors.fullName}</span>}
          </div>

          <div style={styles.inputBlock}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              style={{...styles.inputField, borderColor: errors.email ? '#ef4444' : '#cbd5e1'}} 
              placeholder="name@example.com"
            />
            {errors.email && <span style={styles.errText}>{errors.email}</span>}
          </div>

          <div style={styles.inputBlock}>
            <label style={styles.label}>Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              style={{...styles.inputField, borderColor: errors.phone ? '#ef4444' : '#cbd5e1'}} 
              placeholder="+1 234 567 890"
            />
            {errors.phone && <span style={styles.errText}>{errors.phone}</span>}
          </div>

          <div style={styles.inputBlock}>
            <label style={styles.label}>I am a</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              style={styles.inputField}
            >
              <option value="user">General User</option>
              <option value="business">Small Business Owner</option>
            </select>
          </div>

          <div style={styles.inputBlock}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              style={{...styles.inputField, borderColor: errors.password ? '#ef4444' : '#cbd5e1'}} 
              placeholder="••••••••"
            />
            {errors.password && <span style={styles.errText}>{errors.password}</span>}
          </div>

          <div style={styles.inputBlock}>
            <label style={styles.label}>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              style={{...styles.inputField, borderColor: errors.confirmPassword ? '#ef4444' : '#cbd5e1'}} 
              placeholder="••••••••"
            />
            {errors.confirmPassword && <span style={styles.errText}>{errors.confirmPassword}</span>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                name="agreeToTerms" 
                checked={formData.agreeToTerms} 
                onChange={handleChange} 
                style={{ marginRight: '8px', width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
                I agree to the Terms & Conditions and Privacy Policy
              </span>
            </label>
            {errors.agreeToTerms && <div style={{...styles.errText, marginTop: '4px'}}>{errors.agreeToTerms}</div>}
          </div>

          {errors.form && <div style={{...styles.errText, marginBottom: '10px'}}>{errors.form}</div>}
          <button type="submit" style={styles.submitBtn}>Create Account</button>
        </form>

        <div style={styles.formFooter}>
          Already have an account? <span style={styles.linkText} onClick={() => navigateTo('login')}>Log in</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrap: { display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', padding: '40px 20px', backgroundColor: '#f8fafc' },
  authCard: { backgroundColor: '#fff', width: '100%', maxWidth: '440px', padding: '35px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(15,23,42,0.04)' },
  formTitle: { fontSize: '24px', fontWeight: '800', textAlign: 'center', color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.5px' },
  formSubtitle: { fontSize: '14px', textAlign: 'center', color: '#64748b', margin: '0 0 25px 0' },
  formGroup: { display: 'flex', flexDirection: 'column' },
  inputBlock: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#334155' },
  inputField: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', color: '#0f172a' },
  checkboxLabel: { display: 'flex', alignItems: 'flex-start', cursor: 'pointer' },
  errText: { color: '#ef4444', fontSize: '12px', fontWeight: '500' },
  submitBtn: { backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
  formFooter: { marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#64748b' },
  linkText: { color: '#0284c7', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }
};