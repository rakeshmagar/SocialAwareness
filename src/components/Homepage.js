import React, { useState } from 'react';
import { api } from '../services/api';

export default function Homepage({ 
  userSession, 
  navigateTo, 
  campaigns = [], 
  setCampaigns, 
  reports = [], 
  setReports,
  leads = [], 
  setLeads 
}) {
  
  // Toggle Visibility Controllers
  const [showCampForm, setShowCampForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  // Form Field States
  const [newCamp, setNewCamp] = useState({ title: '', category: 'Littering', target: '', desc: '' });
  const [newReport, setNewReport] = useState({ title: '', category: 'Illegal Dumping', description: '' });

  // Form Error States
  const [campErrors, setCampErrors] = useState({});
  const [reportErrors, setReportErrors] = useState({});

  const handleJoinCampaign = async (id) => {
    if (!userSession) {
      alert('Authentication required! Please sign in to register for community initiatives.');
      navigateTo('login');
      return;
    }
    try {
      const data = await api.joinCampaign(id);
      if (typeof setCampaigns === 'function') {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, joined: data.joined } : c));
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleApplyToLead = async (id) => {
    if (!userSession) {
      alert('Authentication required! Sign in to submit an Advanced Consulting proposal.');
      navigateTo('login');
      return;
    }
    try {
      const data = await api.respondToLead(id);
      if (typeof setLeads === 'function') {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, responses: data.responses } : l));
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Submit Handler for New Campaign
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!userSession) {
      alert('Please log in to launch a community movement!');
      navigateTo('login');
      return;
    }

    const errs = {};
    if (!newCamp.title.trim()) errs.title = 'Campaign title is required.';
    if (!newCamp.target || isNaN(newCamp.target) || parseInt(newCamp.target) <= 0) errs.target = 'Enter a valid volunteer target number.';
    if (!newCamp.desc.trim() || newCamp.desc.length < 10) errs.desc = 'Provide a descriptive breakdown (min 10 chars).';

    if (Object.keys(errs).length > 0) {
      setCampErrors(errs);
      return;
    }

    try {
      const data = await api.createCampaign({
        title: newCamp.title,
        category: newCamp.category,
        target: parseInt(newCamp.target, 10),
        description: newCamp.desc
      });
      setNewCamp({ title: '', category: 'Littering', target: '', desc: '' });
      setCampErrors({});
      setShowCampForm(false);
      alert(data.message);
    } catch (error) {
      setCampErrors({ form: error.message });
    }
  };

  // Submit Handler for New Maintenance Log
  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!userSession) {
      alert('Please log in to submit public framework defect logs!');
      navigateTo('login');
      return;
    }

    const errs = {};
    if (!newReport.title.trim()) errs.title = 'Log title summary is required.';
    if (!newReport.description.trim() || newReport.description.length < 10) errs.description = 'Please detail structural error indicators.';

    if (Object.keys(errs).length > 0) {
      setReportErrors(errs);
      return;
    }

    try {
      const data = await api.createReport(newReport);
      setReports(prev => [data.report, ...prev]);
      setNewReport({ title: '', category: 'Illegal Dumping', description: '' });
      setReportErrors({});
      setShowReportForm(false);
    } catch (error) {
      setReportErrors({ form: error.message });
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroBadge}>v2.4 Live Platform Active</span>
          <h1 style={styles.heroHead}>Empower Your Local Neighborhood</h1>
          <p style={styles.heroSub}>Crowdsourcing dynamic environmental oversight, tracking structural community goals, and monitoring professional B2B project consulting leads instantly.</p>
          {!userSession && (
            <button style={styles.heroBtn} onClick={() => navigateTo('register')}>Get Started for Free →</button>
          )}
        </div>
      </header>

      {/* Responsive Row/Column Layout Wrapper */}
      <div style={styles.contentLayout}>
        
        {/* Main Feed Content Column */}
        <section style={styles.campaignSection}>
          <div style={styles.sectionHeaderRow}>
            <div style={styles.sectionTitleBlock}>
              <h2 style={styles.sectionHeading}>🔥 Active Community Campaigns</h2>
              <p style={styles.sectionSubtext}>Review, track, and register for active localized movements.</p>
            </div>
            <button 
              style={{...styles.toggleFormBtn, backgroundColor: showCampForm ? '#64748b' : '#0284c7'}}
              onClick={() => setShowCampForm(!showCampForm)}
            >
              {showCampForm ? '✕ Close Form' : '＋ Launch Campaign'}
            </button>
          </div>

          {/* Interactive Campaign Form */}
          {showCampForm && (
            <form onSubmit={handleCreateCampaign} style={styles.inlineForm}>
              <h4 style={styles.formSectionTitle}>Setup New Initiative Movement</h4>
              <div style={styles.formRowGrid}>
                <div style={{flex: 2, display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <label style={styles.formLabel}>Campaign Title</label>
                  <input type="text" placeholder="e.g. Clean Up Beach Reserve" value={newCamp.title} onChange={e => setNewCamp({...newCamp, title: e.target.value})} style={styles.formInput}/>
                  {campErrors.title && <span style={styles.errInline}>{campErrors.title}</span>}
                </div>
                <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <label style={styles.formLabel}>Category</label>
                  <select value={newCamp.category} onChange={e => setNewCamp({...newCamp, category: e.target.value})} style={styles.formInput}>
                    <option value="Littering">Littering</option>
                    <option value="Water Wastage">Water Wastage</option>
                    <option value="Traffic Violations">Traffic Violations</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>
                <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <label style={styles.formLabel}>Volunteer Target</label>
                  <input type="number" placeholder="50" value={newCamp.target} onChange={e => setNewCamp({...newCamp, target: e.target.value})} style={styles.formInput}/>
                  {campErrors.target && <span style={styles.errInline}>{campErrors.target}</span>}
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px'}}>
                <label style={styles.formLabel}>Action Description</label>
                <textarea rows="2" placeholder="Describe scope schedules and assembly parameters clearly..." value={newCamp.desc} onChange={e => setNewCamp({...newCamp, desc: e.target.value})} style={{...styles.formInput, resize:'none'}}></textarea>
                {campErrors.desc && <span style={styles.errInline}>{campErrors.desc}</span>}
              </div>
              {campErrors.form && <span style={styles.errInline}>{campErrors.form}</span>}
              <button type="submit" style={styles.formSubmitActionBtn}>Submit Campaign for Approval</button>
            </form>
          )}

          <div style={styles.campaignGrid}>
            {campaigns.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px' }}>No active campaigns found.</p>
            ) : (
              campaigns.map(camp => {
                const joinedCount = camp.joined || 0;
                const targetCount = camp.target || 1;
                const calculatedPercentage = Math.min(Math.round((joinedCount / targetCount) * 100), 100);
                
                return (
                  <div key={camp.id} style={styles.campaignCard}>
                    <div>
                      <div style={styles.cardHeader}>
                        <span style={styles.categoryTag}>{camp.category || 'General'}</span>
                        <span style={styles.creatorTag}>👤 {camp.creator || 'Anonymous'}</span>
                      </div>
                      <h3 style={styles.cardTitle}>{camp.title || 'Untitled Campaign'}</h3>
                      <p style={styles.cardDesc}>{camp.desc || 'No description provided.'}</p>
                    </div>
                    
                    <div>
                      <div style={styles.progressContainer}>
                        <div style={styles.progressLabels}>
                          <span style={styles.votersText}>Volunteers: <strong>{joinedCount}</strong> / {targetCount}</span>
                          <span style={styles.percentText}>{calculatedPercentage}%</span>
                        </div>
                        <div style={styles.trackBar}>
                          <div style={{ ...styles.fillBar, width: `${calculatedPercentage}%` }}></div>
                        </div>
                      </div>

                      <button style={styles.actionBtn} onClick={() => handleJoinCampaign(camp.id)}>
                        Join Initiative
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Sidebar Workspace Panels Column */}
        <div style={styles.sidebarGroup}>
          
          {/* Panel A: Advanced Consulting Project Pipeline */}
          <section style={styles.sidebarCardBlue}>
            <div style={styles.panelTitleBlock}>
              <h2 style={{...styles.sectionHeading, fontSize: '18px', color: '#1e3a8a'}}>💼 Professional B2B Consulting Leads</h2>
              <p style={{...styles.sectionSubtext, marginBottom: '16px'}}>Exclusive channels managed for Advanced Consulting networks.</p>
            </div>
            
            <div style={styles.listContainer}>
              {leads.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13px' }}>No consulting leads currently available.</p>
              ) : (
                leads.map(lead => (
                  <div key={lead.id} style={styles.leadItem}>
                    <div style={styles.leadHeader}>
                      <h4 style={styles.leadTitle}>{lead.need}</h4>
                      <span style={styles.leadValueBadge}>{lead.value}</span>
                    </div>
                    <p style={styles.leadMeta}>Client: <span style={{color: '#334155', fontWeight: '600'}}>{lead.client}</span> | {lead.type}</p>
                    <div style={styles.leadFooter}>
                      <span style={styles.responseCount}>📊 {lead.responses || 0} offers submitted</span>
                      <button style={styles.leadApplyBtn} onClick={() => handleApplyToLead(lead.id)}>Submit Bid</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Panel B: Public Real-time Defect Logs */}
          <section style={styles.sidebarCardWhite}>
            <div style={styles.sectionHeaderRow}>
              <div style={styles.panelTitleBlock}>
                <h2 style={{...styles.sectionHeading, fontSize: '18px'}}>📋 Live Public Maintenance Logs</h2>
                <p style={{...styles.sectionSubtext}}>Citizen tracked regional logs.</p>
              </div>
              <button 
                style={{...styles.toggleFormBtn, fontSize: '11px', padding: '4px 10px'}}
                onClick={() => setShowReportForm(!showReportForm)}
              >
                {showReportForm ? '✕ Close' : '＋ Log Issue'}
              </button>
            </div>

            {/* Interactive Maintenance Incident Logger Form */}
            {showReportForm && (
              <form onSubmit={handleCreateReport} style={{...styles.inlineForm, backgroundColor: '#fdfdfd', border: '1px solid #cbd5e1', marginBottom: '16px'}}>
                <h4 style={{...styles.formSectionTitle, fontSize: '13px'}}>Log Citizen Hazard Report</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  <div>
                    <label style={styles.formLabel}>Issue Summary</label>
                    <input type="text" placeholder="Broken streetlight, pathway pothole..." value={newReport.title} onChange={e => setNewReport({...newReport, title: e.target.value})} style={styles.formInput}/>
                    {reportErrors.title && <span style={styles.errInline}>{reportErrors.title}</span>}
                  </div>
                  <div>
                    <label style={styles.formLabel}>Classification Category</label>
                    <select value={newReport.category} onChange={e => setNewReport({...newReport, category: e.target.value})} style={styles.formInput}>
                      <option value="Illegal Dumping">Illegal Dumping</option>
                      <option value="Water Wastage">Water Wastage</option>
                      <option value="Structural Damage">Structural Damage</option>
                      <option value="Road Hazard">Road Hazard</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.formLabel}>Incident Description</label>
                    <textarea rows="2" placeholder="State specific coordinate markers or safety impacts..." value={newReport.description} onChange={e => setNewReport({...newReport, description: e.target.value})} style={{...styles.formInput, resize:'none'}}></textarea>
                    {reportErrors.description && <span style={styles.errInline}>{reportErrors.description}</span>}
                  </div>
                  <button type="submit" style={{...styles.formSubmitActionBtn, padding: '8px'}}>File Public Report</button>
                </div>
              </form>
            )}
            
            <div style={styles.listContainer}>
              {reports.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13px' }}>No public status reports logged.</p>
              ) : (
                reports.map(issue => (
                  <div key={issue.id} style={styles.reportItem}>
                    <div style={styles.reportHeader}>
                      <h4 style={styles.reportTitle}>{issue.title}</h4>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: issue.status === 'Resolved' ? '#dcfee7' : '#ffedd5',
                        color: issue.status === 'Resolved' ? '#15803d' : '#ea580c'
                      }}>{issue.status || 'Pending'}</span>
                    </div>
                    <p style={styles.reportDesc}>{issue.description}</p>
                    <div style={styles.reportFooterDetails}>
                      <span>Type: <strong style={{color: '#475569'}}>{issue.category}</strong></span>
                      <span>By: {issue.reporter}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', width: '100%' },
  hero: { backgroundColor: '#0f172a', color: '#fff', padding: '70px 40px', textAlign: 'center', backgroundImage: 'radial-gradient(circle at top right, #1e3a8a 0%, #0f172a 70%)', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'center' },
  heroContent: { maxWidth: '850px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  heroBadge: { backgroundColor: 'rgba(56,189,248,0.12)', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', border: '1px solid rgba(56,189,248,0.2)' },
  heroHead: { fontSize: '38px', fontWeight: '900', margin: '0 0 16px 0', color: '#fff', letterSpacing: '-1px', lineHeight: '1.2' },
  heroSub: { fontSize: '17px', color: '#94a3b8', margin: '0 auto 28px auto', lineHeight: '1.6', fontWeight: '400' },
  heroBtn: { backgroundColor: '#fff', color: '#0f172a', border: 'none', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' },
  
  // FIXED FOR MOBILE RESPONSIVENESS (Uses wrapping flex layout blocks instead of hardcoded desktop grids)
  contentLayout: { display: 'flex', flexWrap: 'wrap', gap: '35px', padding: '50px 40px', maxWidth: '1440px', width: '100%', margin: '0 auto', boxSizing: 'border-box' },
  campaignSection: { flex: '1 1 650px', display: 'flex', flexDirection: 'column' },
  sidebarGroup: { flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: '30px' },
  
  sectionHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  toggleFormBtn: { border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  
  // Dynamic Inline Form Modules Styles
  inlineForm: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '10px', marginBottom: '30px', display: 'flex', flexDirection: 'column' },
  formSectionTitle: { fontSize: '15px', fontWeight: '700', margin: '0 0 14px 0', color: '#0f172a' },
  formRowGrid: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  formLabel: { fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' },
  formInput: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#0f172a' },
  formSubmitActionBtn: { backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '14px' },
  errInline: { color: '#ef4444', fontSize: '11px', fontWeight: '500' },

  sectionTitleBlock: { marginBottom: 0 },
  panelTitleBlock: { borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '0px', flex: 1 },
  sectionHeading: { fontSize: '22px', margin: '0 0 6px 0', color: '#0f172a', fontWeight: '800', letterSpacing: '-0.3px' },
  sectionSubtext: { fontSize: '14px', color: '#64748b', margin: 0, lineHeight: '1.5' },
  sidebarCardWhite: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  sidebarCardBlue: { backgroundColor: '#f0f7ff', border: '1px solid #e0f2fe', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(2,132,199,0.02)' },
  campaignGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '24px' },
  campaignCard: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 24px rgba(15,23,42,0.03)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  categoryTag: { backgroundColor: '#f0fdf4', color: '#15803d', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bbf7d0' },
  creatorTag: { fontSize: '12px', color: '#64748b', fontWeight: '500' },
  cardTitle: { fontSize: '18px', margin: '0 0 10px 0', color: '#0f172a', fontWeight: '700', letterSpacing: '-0.2px' },
  cardDesc: { fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: '0 0 24px 0' },
  progressContainer: { borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '16px' },
  progressLabels: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' },
  votersText: { color: '#475569', fontWeight: '500' },
  percentText: { fontWeight: '700', color: '#0284c7' },
  trackBar: { height: '8px', backgroundColor: '#e2e8f0', borderRadius: '20px', overflow: 'hidden' },
  fillBar: { height: '100%', backgroundColor: '#0284c7', borderRadius: '20px' },
  actionBtn: { width: '100%', backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(15,23,42,0.1)' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' },
  leadItem: { backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e0f2fe', boxShadow: '0 2px 12px rgba(2,132,199,0.02)' },
  leadHeader: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' },
  leadTitle: { fontSize: '14px', fontWeight: '700', color: '#1e3a8a', margin: 0, lineHeight: '1.4' },
  leadValueBadge: { backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '6px' },
  leadMeta: { fontSize: '12px', color: '#64748b', margin: '6px 0 14px 0' },
  leadFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '10px' },
  responseCount: { fontSize: '11px', color: '#64748b', fontWeight: '600' },
  leadApplyBtn: { backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' },
  reportItem: { borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' },
  reportHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' },
  reportTitle: { fontSize: '14px', fontWeight: '700', margin: 0, color: '#0f172a' },
  statusBadge: { fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  reportDesc: { fontSize: '12px', color: '#475569', margin: '0 0 10px 0', lineHeight: '1.5' },
  reportFooterDetails: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', fontWeight: '500' }
}; 