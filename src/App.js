import React, { useState, useEffect } from 'react';
import { api, clearSession } from './services/api';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import BusinessDashboard from './components/BusinessDashboard';

const BrandLogo = () => (
  <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
    <rect width="32" height="32" rx="10" fill="url(#logo-grad)"/>
    <path d="M16 7L24 13V21L16 26L8 21V13L16 7Z" fill="#ffffff" opacity="0.25"/>
    <path d="M16 11L21 15V20L16 23L11 20V15L16 11Z" fill="#ffffff"/>
    <circle cx="16" cy="17" r="2.5" fill="#0284c7"/>
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284c7"/>
        <stop offset="1" stopColor="#0369a1"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [userSession, setUserSession] = useState(null); 
  const [successMessage, setSuccessMessage] = useState('');

  const [globalCampaigns, setGlobalCampaigns] = useState([]);

  const [globalReports, setGlobalReports] = useState([]);

  const [globalLeads, setGlobalLeads] = useState([]);

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const [campaignData, leadData] = await Promise.all([api.campaigns(), api.leads()]);
        setGlobalCampaigns(campaignData.campaigns || []);
        setGlobalLeads(leadData.leads || []);
      } catch (error) {
        console.error('Unable to load public API data:', error.message);
      }
    };
    const restoreSession = async () => {
      if (!localStorage.getItem('socialconnect_token')) return;
      try {
        const data = await api.me();
        setUserSession(data.user);
      } catch (error) {
        clearSession();
      }
    };
    loadPublicData();
    restoreSession();
  }, []);

  useEffect(() => {
    if (!userSession) { setGlobalReports([]); return; }
    api.reports().then(data => setGlobalReports(data.reports || [])).catch(error => console.error(error.message));
  }, [userSession]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view) => {
    setSuccessMessage('');
    setCurrentView(view);
    window.history.pushState({ view }, '', '');
  };

  const handleLogout = () => {
    clearSession();
    setUserSession(null);
    setSuccessMessage('Successfully signed out.');
    navigateTo('home');
  };

  return (
    <div style={styles.appContainer}>
      {/* Glassmorphic Top Navbar */}
      <nav style={styles.navbar} aria-label="Main Navigation">
        <div style={styles.brandWrapper} onClick={() => navigateTo('home')}>
          <BrandLogo />
          <div style={styles.navLogo}>SocialConnect</div>
        </div>
        
        {/* Clean, Uniform Navigation Links */}
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigateTo('home')}>
            Home
          </button>
          
          {userSession ? (
            <>
              {userSession.role === 'admin' ? (
                <button style={styles.adminNavBtn} onClick={() => navigateTo('admin')}>
                  🛡️ Admin Panel
                </button>
              ) : userSession.role === 'business' ? (
                <button style={styles.businessNavBtn} onClick={() => navigateTo('business')}>
                  💼 Business Hub
                </button>
              ) : (
                <button style={styles.navBtn} onClick={() => navigateTo('profile')}>
                  My Dashboard
                </button>
              )}
              
              <div style={styles.userBadge}>
                <span style={styles.roleDot} />
                {userSession.name}
              </div>
              <button style={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <button style={styles.navBtn} onClick={() => navigateTo('login')}>
                Sign In
              </button>
              <button style={styles.registerBtn} onClick={() => navigateTo('register')}>
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Floating Toast Notification */}
      {successMessage && (
        <div style={styles.toastBanner}>
          <span style={styles.toastIcon}>✨</span> {successMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {currentView === 'home' && (
          <Homepage 
            userSession={userSession} 
            navigateTo={navigateTo} 
            campaigns={globalCampaigns} 
            setCampaigns={setGlobalCampaigns} 
            reports={globalReports}
            setReports={setGlobalReports}
            leads={globalLeads}
            setLeads={setGlobalLeads}
          />
        )}
        {currentView === 'profile' && (
          <UserProfile userSession={userSession} reports={globalReports} setReports={setGlobalReports} campaigns={globalCampaigns} />
        )}
        {currentView === 'admin' && (
          <AdminDashboard reports={globalReports} setReports={setGlobalReports} campaigns={globalCampaigns} setCampaigns={setGlobalCampaigns} />
        )}
        {currentView === 'business' && (
          <BusinessDashboard userSession={userSession} campaigns={globalCampaigns} setCampaigns={setGlobalCampaigns} leads={globalLeads} setLeads={setGlobalLeads} />
        )}
        {currentView === 'login' && (
          <Login setUserSession={setUserSession} navigateTo={navigateTo} setSuccessMessage={setSuccessMessage} />
        )}
        {currentView === 'register' && (
          <Register navigateTo={navigateTo} setSuccessMessage={setSuccessMessage} />
        )}
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <p style={styles.footerText}>© 2026 SocialConnect Platform. Designed for modern community engagement.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  appContainer: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
    color: '#0f172a'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 48px',
    backgroundColor: '#0f172a',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)'
  },
  brandWrapper: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
  navLogo: { fontSize: '20px', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto' },
  navBtn: {
    background: 'none',
    border: 'none',
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 12px',
    transition: 'all 0.2s ease'
  },
  adminNavBtn: { backgroundColor: '#be123c', color: '#fff', border: 'none', fontSize: '13px', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
  businessNavBtn: { backgroundColor: '#b45309', color: '#fff', border: 'none', fontSize: '13px', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
  registerBtn: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    fontSize: '14px',
    padding: '9px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
    transition: 'all 0.2s ease'
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#f87171',
    border: '1px solid rgba(248, 113, 113, 0.3)',
    fontSize: '13px',
    padding: '7px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#e2e8f0',
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: '#1e293b',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #334155'
  },
  roleDot: { width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#38bdf8' },
  toastBanner: {
    backgroundColor: '#f0fdf4',
    color: '#15803d',
    padding: '12px 24px',
    textAlign: 'center',
    fontWeight: '600',
    borderBottom: '1px solid #bbf7d0',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  toastIcon: { fontSize: '16px' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column' },
  footer: { backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', padding: '24px 0', marginTop: 'auto' },
  footerInner: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' },
  footerText: { color: '#64748b', fontSize: '13px', margin: 0 }
};