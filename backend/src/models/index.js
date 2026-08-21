const User = require('./User');
const Campaign = require('./Campaign');
const CampaignParticipant = require('./CampaignParticipant');
const IssueReport = require('./IssueReport');
const Lead = require('./Lead');
const LeadResponse = require('./LeadResponse');

User.hasMany(Campaign, { foreignKey: 'creatorId', as: 'campaigns' });
Campaign.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
Campaign.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

User.belongsToMany(Campaign, { through: CampaignParticipant, foreignKey: 'userId', otherKey: 'campaignId', as: 'joinedCampaigns' });
Campaign.belongsToMany(User, { through: CampaignParticipant, foreignKey: 'campaignId', otherKey: 'userId', as: 'participants' });
Campaign.hasMany(CampaignParticipant, { foreignKey: 'campaignId', as: 'participations' });
CampaignParticipant.belongsTo(Campaign, { foreignKey: 'campaignId' });
CampaignParticipant.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(IssueReport, { foreignKey: 'reporterId', as: 'reports' });
IssueReport.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });
IssueReport.belongsTo(User, { foreignKey: 'resolvedBy', as: 'resolver' });

User.hasMany(Lead, { foreignKey: 'businessId', as: 'leads' });
Lead.belongsTo(User, { foreignKey: 'businessId', as: 'business' });
Lead.hasMany(LeadResponse, { foreignKey: 'leadId', as: 'leadResponses' });
LeadResponse.belongsTo(Lead, { foreignKey: 'leadId' });
LeadResponse.belongsTo(User, { foreignKey: 'userId', as: 'responder' });

module.exports = { User, Campaign, CampaignParticipant, IssueReport, Lead, LeadResponse };
