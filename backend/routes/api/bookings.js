const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');
const { Spot, Booking, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation'); 

const router = express.Router();



router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    // Find the spot
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    // Ensure the user is not the owner of the spot
    if (spot.ownerId === userId) {
        return res.status(403).json({
            message: "You cannot book your own spot."
        });
    }

    // Check if there's already a booking for the specified dates
    const existingBooking = await Booking.findOne({
        where: {
            spotId,
            [Op.or]: [
                {
                    startDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                {
                    endDate: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            ]
        }
    });

    if (existingBooking) {
        return res.status(403).json({
            message: "Booking already exists for the selected dates."
        });
    }

    // Create a new booking
    const booking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate
    });

    return res.status(201).json({
        booking
    });
});


// Get all of the current user's bookings
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
        where: { userId },
        include: {
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
        }
    });

    return res.json({ bookings });
});


// Get all bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    let bookings;
    if (spot.ownerId === userId) {
        // If the user is the owner, return detailed booking data
        bookings = await Booking.findAll({
            where: { spotId },
            include: { model: User, attributes: ['id', 'firstName', 'lastName'] }
        });
    } else {
        // Otherwise, return only basic booking data
        bookings = await Booking.findAll({
            where: { spotId },
            attributes: ['spotId', 'startDate', 'endDate']
        });
    }

    return res.json({ bookings });
});


// Edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (booking.userId !== userId) {
        return res.status(403).json({ message: "You do not have permission to edit this booking." });
    }

    if (new Date(booking.endDate) < new Date()) {
        return res.status(400).json({ message: "Cannot edit past bookings." });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
        where: {
            spotId: booking.spotId,
            [Op.or]: [
                {
                    startDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                {
                    endDate: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            ],
            id: { [Op.ne]: bookingId }
        }
    });

    if (conflictingBooking) {
        return res.status(403).json({ message: "Conflicting booking exists for the specified dates." });
    }

    // Update the booking
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    return res.json({ booking });
});

// Delete a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
    }

    const spot = await Spot.findByPk(booking.spotId);

    if (booking.userId !== userId && spot.ownerId !== userId) {
        return res.status(403).json({ message: "You do not have permission to delete this booking." });
    }

    if (new Date(booking.startDate) <= new Date()) {
        return res.status(400).json({ message: "Cannot delete a booking that has already started." });
    }

    await booking.destroy();

    return res.json({ message: "Booking successfully deleted." });
});

module.exports = router;