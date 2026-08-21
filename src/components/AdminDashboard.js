import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function AdminDashboard({ reports, setReports, campaigns, setCampaigns }) {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);

  useEffect(() => {
    api.pendingCampaigns().then(data => setPendingCampaigns(data.campaigns || [])).catch(error => alert(error.message));
  }, []);

  const handleCampaignAction = async (id, approved) => {
    try {
      const data = await api.reviewCampaign(id, approved ? 'approved' : 'rejected');
      setPendingCampaigns(prev => prev.filter(item => item.id !== id));
      if (approved && typeof setCampaigns === 'function') {
        const refreshed = await api.campaigns();
        setCampaigns(refreshed.campaigns || []);
      }
      alert(data.message);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleIssueResolve = async (id) => {
    try {
      const data = await api.resolveReport(id);
      setReports(prev => prev.map(issue => issue.id === id ? data.report : issue));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleIssueDelete = async (id) => {
    if (window.confirm('Are you sure you want to dismiss this report?')) {
      try {
        await api.dismissReport(id);
        setReports(prev => prev.filter(issue => issue.id !== id));
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.adminHeader}>
        <h2>🛡️ Administrator System Portal</h2>
        <p>Review system submissions, manage community complaints, and audit content compliance.</p>
      </header>

      <div style={styles.adminLayout}>
        {/* Pending Campaign Queue Block */}
        <section style={styles.card}>
          <h3 style={styles.cardHeading}>Pending Campaign Approvals</h3>
          {pendingCampaigns.length === 0 ? (
            <p style={styles.emptyText}>No pending campaigns requiring validation queues.</p>
          ) : (
            pendingCampaigns.map(camp => (
              <div key={camp.id} style={styles.reviewBox}>
                <div style={styles.metaRow}>
                  <span style={styles.categoryBadge}>{camp.category}</span>
                  <span style={styles.authorText}>By: {camp.creator}</span>
                </div>
                <h4 style={styles.itemTitle}>{camp.title}</h4>
                <p style={styles.itemDesc}>{camp.description}</p>
                <div style={styles.actionRow}>
                  <button style={styles.rejectBtn} onClick={() => handleCampaignAction(camp.id, false)}>Reject</button>
                  <button style={styles.approveBtn} onClick={() => handleCampaignAction(camp.id, true)}>Approve & Publish</button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Connected Real-Time Issue List Block */}
        <section style={styles.card}>
          <h3 style={styles.cardHeading}>Reported Community Issues (Live Database)</h3>
          <div style={styles.issueList}>
            {reports.length === 0 ? (
              <p style={styles.emptyText}>No issue reports recorded in system memory.</p>
            ) : (
              reports.map(issue => (
                <div key={issue.id} style={styles.issueItem}>
                  <div style={styles.metaRow}>
                    <h4 style={styles.itemTitle}>{issue.title}</h4>
                    <span style={{
                      ...styles.statusTag,
                      backgroundColor: issue.status === 'Resolved' ? '#dcfce7' : '#fef3c7',
                      color: issue.status === 'Resolved' ? '#16a34a' : '#d97706'
                    }}>{issue.status}</span>
                  </div>
                  <p style={styles.itemDesc}>{issue.description || 'No extended description provided.'}</p>
                  <p style={styles.itemMeta}>Category: <strong>{issue.category}</strong> | Reporter ID: <u>{issue.reporter}</u></p>
                  
                  <div style={styles.btnGroup}>
                    {issue.status !== 'Resolved' && (
                      <button style={styles.resolveBtn} onClick={() => handleIssueResolve(issue.id)}>
                        Mark as Resolved
                      </button>
                    )}
                    <button style={styles.deleteBtn} onClick={() => handleIssueDelete(issue.id)}>
                      Dismiss Report
                    </button>
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
  adminHeader: { backgroundColor: '#1e293b', color: '#fff', padding: '30px', borderRadius: '8px', borderLeft: '6px solid #ef4444' },
  adminLayout: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '25px', marginTop: '10px' },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', height: 'fit-content' },
  cardHeading: { fontSize: '18px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' },
  emptyText: { color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '20px 0' },
  reviewBox: { border: '1px solid #cbd5e1', borderRadius: '6px', padding: '16px', marginBottom: '15px', backgroundColor: '#f8fafc' },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  categoryBadge: { backgroundColor: '#e2e8f0', color: '#334155', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' },
  authorText: { fontSize: '12px', color: '#64748b' },
  itemTitle: { fontSize: '15px', margin: '0 0 6px 0', color: '#0f172a', fontWeight: 'bold' },
  itemDesc: { fontSize: '13px', color: '#334155', lineHeight: '1.4', margin: '0 0 12px 0' },
  actionRow: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  rejectBtn: { backgroundColor: '#fff', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' },
  approveBtn: { backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' },
  issueList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  issueItem: { border: '1px solid #e2e8f0', padding: '14px', borderRadius: '6px', backgroundColor: '#fff' },
  itemMeta: { fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' },
  statusTag: { fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' },
  btnGroup: { display: 'flex', gap: '10px', marginTop: '10px' },
  resolveBtn: { backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' },
  deleteBtn: { backgroundColor: '#fff', color: '#64748b', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }
};