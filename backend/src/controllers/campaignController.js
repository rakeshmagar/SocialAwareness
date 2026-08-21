const { Op } = require('sequelize');
const { Campaign, CampaignParticipant, User } = require('../models');

const includeCreator = [{ model: User, as: 'creator', attributes: ['id', 'fullName', 'role'] }];

function shapeCampaign(row) {
  const c = row.toJSON ? row.toJSON() : row;
  return {
    id: c.id,
    title: c.title,
    category: c.category,
    creator: c.creator?.fullName || 'Unknown',
    creatorId: c.creatorId,
    target: c.target,
    joined: Number(c.participantCount ?? c.participations?.length ?? 0),
    desc: c.description,
    description: c.description,
    status: c.status,
    createdAt: c.createdAt,
  };
}

exports.listApproved = async (req, res) => {
  const rows = await Campaign.findAll({
    where: { status: 'approved' }, include: [...includeCreator, { model: CampaignParticipant, as: 'participations', attributes: ['id'] }], order: [['createdAt', 'DESC']],
  });
  res.json({ campaigns: rows.map(shapeCampaign) });
};

exports.listMine = async (req, res) => {
  const rows = await Campaign.findAll({ where: { creatorId: req.user.id }, include: [...includeCreator, { model: CampaignParticipant, as: 'participations', attributes: ['id'] }], order: [['createdAt', 'DESC']] });
  res.json({ campaigns: rows.map(shapeCampaign) });
};

exports.listPending = async (req, res) => {
  const rows = await Campaign.findAll({ where: { status: 'pending' }, include: includeCreator, order: [['createdAt', 'ASC']] });
  res.json({ campaigns: rows.map(shapeCampaign) });
};

exports.create = async (req, res) => {
  const { title, category, target, description, desc } = req.body;
  const text = description ?? desc;
  if (!title?.trim()) return res.status(400).json({ message: 'Campaign title is required.' });
  if (!category?.trim()) return res.status(400).json({ message: 'Campaign category is required.' });
  if (!Number.isInteger(Number(target)) || Number(target) < 1) return res.status(400).json({ message: 'Target must be a positive whole number.' });
  if (!text?.trim() || text.trim().length < 10) return res.status(400).json({ message: 'Description must contain at least 10 characters.' });

  const campaign = await Campaign.create({ title: title.trim(), category: category.trim(), target: Number(target), description: text.trim(), creatorId: req.user.id, status: 'pending' });
  const loaded = await Campaign.findByPk(campaign.id, { include: includeCreator });
  res.status(201).json({ message: 'Campaign submitted for administrator approval.', campaign: shapeCampaign(loaded) });
};

exports.join = async (req, res) => {
  const campaign = await Campaign.findOne({ where: { id: req.params.id, status: 'approved' } });
  if (!campaign) return res.status(404).json({ message: 'Approved campaign not found.' });
  const [, created] = await CampaignParticipant.findOrCreate({ where: { campaignId: campaign.id, userId: req.user.id }, defaults: { campaignId: campaign.id, userId: req.user.id } });
  if (!created) return res.status(409).json({ message: 'You have already joined this campaign.' });
  const joined = await CampaignParticipant.count({ where: { campaignId: campaign.id } });
  res.status(201).json({ message: 'You joined the campaign.', joined });
};

exports.review = async (req, res) => {
  const { decision, rejectionReason } = req.body;
  if (!['approved', 'rejected'].includes(decision)) return res.status(400).json({ message: 'Decision must be approved or rejected.' });
  const campaign = await Campaign.findByPk(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found.' });
  if (campaign.status !== 'pending') return res.status(409).json({ message: `Campaign is already ${campaign.status}.` });

  campaign.status = decision;
  campaign.approvedBy = req.user.id;
  campaign.approvedAt = new Date();
  campaign.rejectionReason = decision === 'rejected' ? (rejectionReason || null) : null;
  await campaign.save();
  res.json({ message: `Campaign ${decision}.`, campaign: shapeCampaign(campaign) });
};
