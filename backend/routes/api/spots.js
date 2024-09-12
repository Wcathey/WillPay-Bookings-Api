const express = require('express');
const router = express.Router();
const { Spot, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth'); // Ensure user is authenticated

// POST /api/spots/:spotId/bookings - Create a booking for a spot
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
  try {
    const spotId = req.params.spotId;
    const { startDate, endDate } = req.body;

    // Ensure that the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404,
      });
    }

    // Check if the current user is trying to book their own spot (unauthorized)
    if (spot.ownerId === req.user.id) {
      return res.status(403).json({
        message: "You cannot book your own spot",
        statusCode: 403,
      });
    }

    // Check if there is an overlapping booking
    const existingBooking = await Booking.findOne({
      where: {
        spotId: spotId,
        startDate: {
          [Op.lte]: endDate, // Booking exists with start date before the end date of new booking
        },
        endDate: {
          [Op.gte]: startDate, // Booking exists with end date after the start date of new booking
        },
      },
    });

    if (existingBooking) {
      return res.status(403).json({
        message: "Booking conflict: spot is already booked for the specified dates",
        statusCode: 403,
      });
    }

    // Create the new booking
    const newBooking = await Booking.create({
      userId: req.user.id, // Current authenticated user
      spotId: spotId,
      startDate: startDate,
      endDate: endDate,
    });

    return res.status(201).json(newBooking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;