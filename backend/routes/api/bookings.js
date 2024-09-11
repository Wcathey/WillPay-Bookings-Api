const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');
const { Spot, Booking, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/handleValidationErrors'); 

const router = express.Router();



router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  const { startDate, endDate } = req.body;
  const spot = await Spot.findByPk(req.params.spotId);

  // 1. Error if spot doesn't exist
  if (!spot) {
    return res.status(404).json({ message: 'Spot couldn’t be found' });
  }

  // 2. Check if the current user owns the spot
  if (spot.ownerId === req.user.id) {
    return res.status(403).json({ message: 'You cannot book your own spot' });
  }

  // 3. Check if there are any existing bookings with conflicting dates
  const conflictingBooking = await Booking.findOne({
    where: {
      spotId: req.params.spotId,
      [Op.or]: [
        {
          startDate: { [Op.between]: [startDate, endDate] }
        },
        {
          endDate: { [Op.between]: [startDate, endDate] }
        }
      ]
    }
  });

  if (conflictingBooking) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates'
    });
  }

  // 4. Create the booking if no conflicts
  const newBooking = await Booking.create({
    spotId: req.params.spotId,
    userId: req.user.id,
    startDate,
    endDate
  });

  res.status(201).json(newBooking);
});