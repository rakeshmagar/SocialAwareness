const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lead = sequelize.define('Lead', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  need: { type: DataTypes.STRING(220), allowNull: false },
  contractValue: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'contract_value', validate: { min: 0 } },
  type: { type: DataTypes.STRING(80), allowNull: false },
  status: { type: DataTypes.ENUM('open', 'closed'), allowNull: false, defaultValue: 'open' },
  businessId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'business_id' },
}, { tableName: 'leads' });

module.exports = Lead;
