import asyncHandler from '../middleware/asyncHandler.js';
import Ticket from '../models/Ticket.js';
import { createCrudController } from './crudControllerFactory.js';

export const ticketCrud = createCrudController(Ticket, {
  modelName: 'Ticket',
  searchFields: ['label'],
  defaultSort: 'order',
});

// Atomically increments soldCount only if stock allows it, so two
// simultaneous checkouts can't both succeed and oversell a limited tier.
export const reserveTicket = asyncHandler(async (req, res) => {
  const { quantity = 1 } = req.body;

  const ticket = await Ticket.findOne({ _id: req.params.id, deletedAt: null });
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket tier not found.' });

  if (ticket.status !== 'available') {
    return res.status(409).json({ success: false, message: `This ticket tier is currently "${ticket.status}".` });
  }

  const updated = await Ticket.findOneAndUpdate(
    {
      _id: ticket._id,
      $or: [
        { totalStock: null },
        { $expr: { $lte: [{ $add: ['$soldCount', quantity] }, '$totalStock'] } },
      ],
    },
    { $inc: { soldCount: quantity } },
    { new: true }
  );

  if (!updated) {
    return res.status(409).json({ success: false, message: 'Not enough tickets remaining in this tier.' });
  }

  if (updated.totalStock != null && updated.soldCount >= updated.totalStock) {
    updated.status = 'sold-out';
    await updated.save();
  }

  res.json({ success: true, ticket: updated });
});
