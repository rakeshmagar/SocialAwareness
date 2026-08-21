import React, { useState } from 'react';
import { api } from '../services/api';

export default function BusinessDashboard({ userSession, campaigns = [], setCampaigns, leads = [], setLeads }) {
  const campaignCategories = ['Littering', 'Water Wastage', 'Traffic Violations', 'Illegal Dumping', 'Environmental Protection'];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(campaignCategories[0]);
  const [target, setTarget] = useState('');
  const [description, setDescription] = useState('');

  // B2B Lead Form State
  const [leadNeed, setLeadNeed] = useState('');
  const [leadValue, setLeadValue] = useState('');
  const [leadType, setLeadType] = useState('B2B Consulting');

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !target) return alert('Please complete all campaign details.');

    try {
      const data = await api.createCampaign({ title, category, target: parseInt(target, 10), description });
      setTitle('');
      setDescription('');
      setTarget('');
      alert(data.message);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadNeed || !leadValue) return alert('Please complete lead requirement and valuation.');

    try {
      const data = await api.createLead({ need: leadNeed, value: leadValue, type: leadType });
      if (typeof setLeads === 'function') setLeads([data.lead, ...leads]);
      setLeadNeed('');
      setLeadValue('');
      alert(data.message);
    } catch (error) {
      alert(error.message);
    }
  };

  const currentBusinessName = userSession?.name || 'BUSINESS_CORP';
  const myCampaigns = campaigns.filter(camp => camp.creator === currentBusinessName);

  return (
    <div style={styles.container}>
      <header style={styles.businessHeader}>
        <h2>🏢 Corporate CSR & Business Portal</h2>
        <p>Launch community initiatives, sponsor local events, and issue B2B consulting RFP opportunities.</p>
      </header>

      <div style={styles.dashboardLayout}>
        {/* Left Column: Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Launch a Campaign Card */}
          <section style={styles.card}>
            <h3 style={styles.cardHeading}>Launch a Community Campaign</h3>
            <form onSubmit={handleCampaignSubmit} style={styles.form}>
              <div style={styles.infoField}>
                <label style={styles.label}>Campaign Title</label>
                <input type="text" style={styles.input} placeholder="e.g., Downtown Clean-Up Drive" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div style={styles.infoField}>
                <label style={styles.label}>Focus Area</label>
                <select style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {campaignCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div style={styles.infoField}>
                <label style={styles.label}>Target Goal (Volunteers / Funding)</label>
                <input type="number" style={styles.input} placeholder="e.g., 100" value={target} onChange={(e) => setTarget(e.target.value)} required min="1" />
              </div>
              <div style={styles.infoField}>
                <label style={styles.label}>Campaign Description</label>
                <textarea style={{...styles.input, height: '70px', resize: 'none'}} placeholder="Describe the mission..." value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <button type="submit" style={styles.submitBtn}>Publish Campaign</button>
            </form>
          </section>

          {/* Post B2B Lead Opportunity Card */}
          <section style={styles.card}>
            <h3 style={styles.cardHeading}>💼 Post B2B Consulting Lead / RFP</h3>
            <form onSubmit={handleLeadSubmit} style={styles.form}>
              <div style={styles.infoField}>
                <label style={styles.label}>Project Need / Requirement</label>
                <input type="text" style={styles.input} placeholder="e.g., Carbon Neutrality Audit" value={leadNeed} onChange={(e) => setLeadNeed(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ ...styles.infoField, flex: 1 }}>
                  <label style={styles.label}>Contract Value</label>
                  <input type="text" style={styles.input} placeholder="e.g., $12,500" value={leadValue} onChange={(e) => setLeadValue(e.target.value)} required />
                </div>
                <div style={{ ...styles.infoField, flex: 1 }}>
                  <label style={styles.label}>Contract Type</label>
                  <select style={styles.input} value={leadType} onChange={(e) => setLeadType(e.target.value)}>
                    <option value="B2B Consulting">B2B Consulting</option>
                    <option value="Government Contract">Government Contract</option>
                    <option value="Corporate RFP">Corporate RFP</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={{...styles.submitBtn, backgroundColor: '#0284c7'}}>Publish Lead RFP</button>
            </form>
          </section>
        </div>

        {/* Right Column: Active Campaigns List */}
        <section style={styles.card}>
          <h3 style={styles.cardHeading}>My Active Campaigns</h3>
          <p style={styles.subText}>Track community engagement for your sponsored initiatives:</p>
          <div style={styles.campaignList}>
            {myCampaigns.length === 0 ? (
              <p style={styles.subText}>Your organization has not launched any campaigns yet.</p>
            ) : (
              myCampaigns.map(camp => (
                <div key={camp.id} style={styles.campaignItem}>
                  <h4 style={styles.itemTitle}>{camp.title}</h4>
                  <span style={styles.badge}>{camp.category}</span>
                  <p style={styles.itemDesc}>{camp.desc}</p>
                  <div style={styles.progressTracker}>
                    <p style={styles.progressText}>Engagement: <strong>{camp.joined}</strong> / {camp.target}</p>
                    <div style={styles.progressBar}>
                      <div style={{
                        ...styles.progressFill,
                        width: `${Math.min((camp.joined / camp.target) * 100, 100)}%`
                      }}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' },
  businessHeader: { backgroundColor: '#1e40af', color: '#fff', padding: '30px', borderRadius: '8px', borderLeft: '6px solid #fbbf24' },
  dashboardLayout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '10px' },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', height: 'fit-content' },
  cardHeading: { fontSize: '18px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  infoField: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#475569' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' },
  submitBtn: { backgroundColor: '#1e40af', color: '#fff', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '5px' },
  subText: { fontSize: '13px', color: '#64748b', margin: '0 0 15px 0' },
  campaignList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  campaignItem: { border: '1px solid #e2e8f0', padding: '16px', borderRadius: '6px', backgroundColor: '#f8fafc' },
  itemTitle: { fontSize: '16px', margin: '0 0 8px 0', color: '#1e293b' },
  badge: { display: 'inline-block', fontSize: '11px', backgroundColor: '#e2e8f0', padding: '3px 8px', borderRadius: '4px', color: '#475569', marginBottom: '10px' },
  itemDesc: { fontSize: '13px', color: '#475569', margin: '0 0 15px 0', lineHeight: '1.4' },
  progressTracker: { borderTop: '1px solid #e2e8f0', paddingTop: '10px' },
  progressText: { fontSize: '12px', color: '#334155', margin: '0 0 5px 0' },
  progressBar: { height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#10b981' }
};