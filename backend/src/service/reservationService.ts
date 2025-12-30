import { sequelize } from "../config/Database.js";
import showtime from "../models/showtime.js";

export async function bookSeat(showtimeId: number, numberOfSeats: number) {
    const transaction = await sequelize.transaction();

    try {
        const show = await showtime.findByPk(showtimeId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!show) throw new Error("Showtime not found");

        const currentBooked = Number(show.get('bookedSeats'));
        const totalSeats = Number(show.get('totalSeats'));

        if (currentBooked + numberOfSeats > totalSeats) {
            throw new Error("Not enough seats available");
        }

        // <-- hna katdir atomic increment
        await show.increment('bookedSeats', { by: numberOfSeats, transaction });

        await transaction.commit();
        return { success: true, bookedSeats: currentBooked + numberOfSeats };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
