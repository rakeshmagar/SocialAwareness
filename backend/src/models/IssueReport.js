const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IssueReport = sequelize.define('IssueReport', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(180), allowNull: false },
  category: { type: DataTypes.STRING(80), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'resolved', 'dismissed'), allowNull: false, defaultValue: 'pending' },
  reporterId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'reporter_id' },
  resolvedBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'resolved_by' },
  resolvedAt: { type: DataTypes.DATE, allowNull: true, field: 'resolved_at' },
}, { tableName: 'issue_reports' });

module.exports = IssueReport;
