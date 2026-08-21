const { Lead, LeadResponse, User } = require('../models');

function shapeLead(row) {
  const l = row.toJSON ? row.toJSON() : row;
  return { id: l.id, client: l.business?.fullName || 'Business', businessId: l.businessId, need: l.need, value: `$${Number(l.contractValue).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`, contractValue: Number(l.contractValue), type: l.type, responses: l.leadResponses?.length ?? 0, status: l.status, createdAt: l.createdAt };
}

const includes = [{ model: User, as: 'business', attributes: ['id', 'fullName'] }, { model: LeadResponse, as: 'leadResponses', attributes: ['id'] }];

exports.listOpen = async (req, res) => {
  const rows = await Lead.findAll({ where: { status: 'open' }, include: includes, order: [['createdAt', 'DESC']] });
  res.json({ leads: rows.map(shapeLead) });
};

exports.create = async (req, res) => {
  const { need, value, contractValue, type } = req.body;
  const amount = Number(String(contractValue ?? value ?? '').replace(/[$,\s]/g, ''));
  if (!need?.trim() || !type?.trim()) return res.status(400).json({ message: 'Need and contract type are required.' });
  if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: 'Contract value must be greater than zero.' });
  const lead = await Lead.create({ need: need.trim(), contractValue: amount, type: type.trim(), businessId: req.user.id });
  const loaded = await Lead.findByPk(lead.id, { include: includes });
  res.status(201).json({ message: 'Lead/RFP published.', lead: shapeLead(loaded) });
};

exports.respond = async (req, res) => {
  const lead = await Lead.findOne({ where: { id: req.params.id, status: 'open' } });
  if (!lead) return res.status(404).json({ message: 'Open lead not found.' });
  if (lead.businessId === req.user.id) return res.status(400).json({ message: 'You cannot respond to your own lead.' });
  const [, created] = await LeadResponse.findOrCreate({ where: { leadId: lead.id, userId: req.user.id }, defaults: { leadId: lead.id, userId: req.user.id, message: req.body.message || null } });
  if (!created) return res.status(409).json({ message: 'You have already responded to this lead.' });
  const responses = await LeadResponse.count({ where: { leadId: lead.id } });
  res.status(201).json({ message: 'Response submitted.', responses });
};
