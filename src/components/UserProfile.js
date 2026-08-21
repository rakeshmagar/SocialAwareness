import React, { useState } from 'react';
import { api } from '../services/api';

export default function UserProfile({ userSession, reports = [], setReports, campaigns = [] }) {
  const issueCategories = ['Littering', 'Water Wastage', 'Traffic Violations', 'Illegal Dumping', 'Noise Pollution', 'Environmental Pollution'];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(issueCategories[0]);
  const [description, setDescription] = useState('');
  const [mockImage, setMockImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMockImage(e.target.files[0].name);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return alert('Please input mandatory reporting details.');

    try {
      const data = await api.createReport({ title, category, description });
      setReports([data.report, ...reports]);
      setTitle('');
      setDescription('');
      setMockImage(null);
      alert('Issue reported successfully! It has been sent to the administrator for review.');
    } catch (error) {
      alert(error.message);
    }
  };

  const currentUserName = userSession?.name || 'COMMUNITY_USER';
  const myFilteredLogs = reports.filter(r => r.reporter === currentUserName);

  return (
    <div style={styles.container}>
      <header style={styles.profileHeader}>
        <h2>👤 Community Member Dashboard</h2>
        <p>Manage your public profile information, submit localization issues, and audit active responses.</p>
      </header>

      <div style={styles.dashboardLayout}>
        {/* Profile Details Card */}
        <section style={styles.card}>
          <h3 style={styles.cardHeading}>Account Information</h3>
          <div style={styles.infoField}>
            <label style={styles.label}>Profile Name:</label>
            <input type="text" style={styles.staticInput} value={currentUserName} readOnly />
          </div>
          <div style={styles.infoField}>
            <label style={styles.label}>Communication Route:</label>
            <input type="email" style={styles.staticInput} value={userSession?.email || 'user@socialconnect.org'} readOnly disabled />
          </div>
          <div style={styles.infoField}>
            <label style={styles.label}>Assigned System Role:</label>
            <span style={styles.roleTag}>General Community Member</span>
          </div>

          <div style={{ marginTop: '25px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
            <h4 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 10px 0' }}>🌱 Active Initiatives Available</h4>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              There are currently <strong>{campaigns.length}</strong> campaigns active on the global network.
            </p>
          </div>
        </section>

        {/* Issue Form Card */}
        <section style={styles.card}>
          <h3 style={styles.cardHeading}>Report a New Community Issue</h3>
          <form onSubmit={handleReportSubmit} style={styles.form}>
            <div style={styles.infoField}>
              <label style={styles.label} htmlFor="issue-title">Issue Title / Short Summary</label>
              <input id="issue-title" type="text" style={styles.input} placeholder="e.g., Pothole near university gate" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div style={styles.infoField}>
              <label style={styles.label} htmlFor="issue-category">Issue Category</label>
              <select id="issue-category" style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
                {issueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div style={styles.infoField}>
              <label style={styles.label} htmlFor="issue-desc">Detailed Description</label>
              <textarea id="issue-desc" style={{...styles.input, height: '80px', resize: 'none'}} placeholder="Provide distinct landmarks or specific conditions..." value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div style={styles.infoField}>
              <label style={styles.label} htmlFor="issue-file">Upload Evidence Photo</label>
              <input id="issue-file" type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
              {mockImage && <p style={styles.fileSuccess}>✓ Staged file for payload: {mockImage}</p>}
            </div>
            <button type="submit" style={styles.submitBtn}>Dispatch Community Report</button>
          </form>
        </section>

        {/* Dynamic User Feedback Log Card */}
        <section style={styles.card}>
          <h3 style={styles.cardHeading}>My Activity Logs</h3>
          <p style={styles.subText}>Historical monitoring of issues reported by your account:</p>
          <div style={styles.reportList}>
            {myFilteredLogs.length === 0 ? (
              <p style={styles.subText}>You haven't dispatched any issue tickets yet.</p>
            ) : (
              myFilteredLogs.map(rep => (
                <div key={rep.id} style={styles.reportItem}>
                  <h4 style={styles.reportItemTitle}>{rep.title}</h4>
                  <div style={styles.reportMetaRow}>
                    <span style={styles.reportBadge}>{rep.category}</span>
                    <span style={{
                      ...styles.statusBadge, 
                      backgroundColor: rep.status === 'Resolved' ? '#dcfce7' : '#fef3c7',
                      color: rep.status === 'Resolved' ? '#15803d' : '#b45309'
                    }}>{rep.status}</span>
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
  profileHeader: { backgroundColor: '#0f172a', color: '#fff', padding: '30px', borderRadius: '8px' },
  dashboardLayout: { display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '25px', marginTop: '10px' },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', height: 'fit-content' },
  cardHeading: { fontSize: '18px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  infoField: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#475569' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' },
  staticInput: { padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px', color: '#334155' },
  roleTag: { display: 'inline-block', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', width: 'fit-content' },
  submitBtn: { backgroundColor: '#0284c7', color: '#fff', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  fileInput: { fontSize: '13px', color: '#64748b' },
  fileSuccess: { fontSize: '12px', color: '#16a34a', margin: '4px 0 0 0', fontWeight: '500' },
  subText: { fontSize: '13px', color: '#64748b', margin: '0 0 15px 0' },
  reportList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  reportItem: { border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px', backgroundColor: '#f8fafc' },
  reportItemTitle: { fontSize: '14px', margin: '0 0 8px 0', color: '#1e293b' },
  reportMetaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  reportBadge: { fontSize: '11px', backgroundColor: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', color: '#475569' },
  statusBadge: { fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }
};