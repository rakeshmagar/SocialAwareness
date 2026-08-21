const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CampaignParticipant = sequelize.define('CampaignParticipant', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  campaignId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'campaign_id' },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' },
}, {
  tableName: 'campaign_participants',
  indexes: [{ unique: true, fields: ['campaign_id', 'user_id'] }],
});

module.exports = CampaignParticipant;
