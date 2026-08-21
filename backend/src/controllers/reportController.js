const { IssueReport, User } = require('../models');

function shapeReport(row) {
  const r = row.toJSON ? row.toJSON() : row;
  return { id: r.id, title: r.title, category: r.category, description: r.description, status: r.status === 'pending' ? 'Pending Review' : (r.status === 'resolved' ? 'Resolved' : 'Dismissed'), reporter: r.reporter?.fullName || r.reporterId, reporterId: r.reporterId, createdAt: r.createdAt };
}

const includeReporter = [{ model: User, as: 'reporter', attributes: ['id', 'fullName', 'email'] }];

exports.list = async (req, res) => {
  const where = req.user.role === 'admin' ? {} : { reporterId: req.user.id };
  const rows = await IssueReport.findAll({ where, include: includeReporter, order: [['createdAt', 'DESC']] });
  res.json({ reports: rows.map(shapeReport) });
};

exports.create = async (req, res) => {
  const { title, category, description } = req.body;
  if (!title?.trim() || !category?.trim()) return res.status(400).json({ message: 'Title and category are required.' });
  if (!description?.trim() || description.trim().length < 10) return res.status(400).json({ message: 'Description must contain at least 10 characters.' });
  const row = await IssueReport.create({ title: title.trim(), category: category.trim(), description: description.trim(), reporterId: req.user.id });
  const loaded = await IssueReport.findByPk(row.id, { include: includeReporter });
  res.status(201).json({ message: 'Issue report submitted.', report: shapeReport(loaded) });
};

exports.resolve = async (req, res) => {
  const row = await IssueReport.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Issue report not found.' });
  row.status = 'resolved'; row.resolvedBy = req.user.id; row.resolvedAt = new Date(); await row.save();
  res.json({ message: 'Issue marked as resolved.', report: shapeReport(row) });
};

exports.dismiss = async (req, res) => {
  const row = await IssueReport.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Issue report not found.' });
  row.status = 'dismissed'; row.resolvedBy = req.user.id; row.resolvedAt = new Date(); await row.save();
  res.json({ message: 'Issue report dismissed.', report: shapeReport(row) });
};
