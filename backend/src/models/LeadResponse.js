const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeadResponse = sequelize.define('LeadResponse', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  leadId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'lead_id' },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' },
  message: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'lead_responses',
  indexes: [{ unique: true, fields: ['lead_id', 'user_id'] }],
});

module.exports = LeadResponse;
