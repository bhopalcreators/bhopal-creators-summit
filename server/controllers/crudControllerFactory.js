import asyncHandler from '../middleware/asyncHandler.js';
import AuditLog from '../models/AuditLog.js';

/**
 * Builds a full set of REST handlers for a given Mongoose model.
 * Every model that opts into soft-delete gets a `deletedAt` filter applied
 * automatically; models without that field just ignore the extra clause.
 *
 * options:
 *   modelName   - string used in audit logs (e.g. "Sponsor")
 *   searchFields - array of string field names included in ?search= queries
 *   defaultSort  - mongoose sort string, default "order"
 *   populate     - fields to populate on read
 */
export function createCrudController(Model, options = {}) {
  const { modelName = Model.modelName, searchFields = [], defaultSort = 'order', populate = [] } = options;

  const list = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50, search, isActive, year, category, ...rest } = req.query;

    const filter = { deletedAt: null, ...rest };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (year) filter.year = Number(year);
    if (category) filter.category = category;

    if (search && searchFields.length) {
      filter.$or = searchFields.map((f) => ({ [f]: { $regex: search, $options: 'i' } }));
    }

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 200);

    let query = Model.find(filter)
      .sort(defaultSort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    populate.forEach((p) => {
      query = query.populate(p);
    });

    const [items, total] = await Promise.all([query, Model.countDocuments(filter)]);

    res.json({
      success: true,
      count: items.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      items,
    });
  });

  const getOne = asyncHandler(async (req, res) => {
    let query = Model.findOne({ _id: req.params.id, deletedAt: null });
    populate.forEach((p) => {
      query = query.populate(p);
    });
    const item = await query;
    if (!item) return res.status(404).json({ success: false, message: `${modelName} not found.` });
    res.json({ success: true, item });
  });

  const create = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);

    await AuditLog.create({
      user: req.user._id,
      action: 'create',
      resource: modelName,
      resourceId: item._id,
      after: item,
      ip: req.ip,
    });

    res.status(201).json({ success: true, item });
  });

  const update = asyncHandler(async (req, res) => {
    const before = await Model.findById(req.params.id);
    if (!before) return res.status(404).json({ success: false, message: `${modelName} not found.` });

    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await AuditLog.create({
      user: req.user._id,
      action: 'update',
      resource: modelName,
      resourceId: item._id,
      before,
      after: item,
      ip: req.ip,
    });

    res.json({ success: true, item });
  });

  // Soft delete if the schema supports it, hard delete otherwise
  const remove = asyncHandler(async (req, res) => {
    const hasSoftDelete = !!Model.schema.path('deletedAt');
    const before = await Model.findById(req.params.id);
    if (!before) return res.status(404).json({ success: false, message: `${modelName} not found.` });

    if (hasSoftDelete) {
      await Model.findByIdAndUpdate(req.params.id, { deletedAt: new Date(), isActive: false });
    } else {
      await Model.findByIdAndDelete(req.params.id);
    }

    await AuditLog.create({
      user: req.user._id,
      action: 'delete',
      resource: modelName,
      resourceId: before._id,
      before,
      ip: req.ip,
    });

    res.json({ success: true, message: `${modelName} deleted.` });
  });

  // Bulk reorder: [{ id, order }, ...]
  const reorder = asyncHandler(async (req, res) => {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Body must include an "items" array of { id, order }.' });
    }

    await Promise.all(
      items.map(({ id, order }) => Model.findByIdAndUpdate(id, { order }))
    );

    res.json({ success: true, message: 'Order updated.' });
  });

  return { list, getOne, create, update, remove, reorder };
}
