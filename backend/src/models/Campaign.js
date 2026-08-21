const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campaign = sequelize.define('Campaign', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(180), allowNull: false },
  category: { type: DataTypes.STRING(80), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  target: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { min: 1 } },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
  rejectionReason: { type: DataTypes.STRING(500), allowNull: true, field: 'rejection_reason' },
  creatorId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'creator_id' },
  approvedBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'approved_by' },
  approvedAt: { type: DataTypes.DATE, allowNull: true, field: 'approved_at' },
}, { tableName: 'campaigns' });

module.exports = Campaign;
