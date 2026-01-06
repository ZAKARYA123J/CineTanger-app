import AsyncStorage from '@react-native-async-storage/async-storage';

const RESERVATIONS_KEY = '@cinetanger_reservations';
const RESERVATION_QUEUE_KEY = '@cinetanger_reservation_queue';

export interface Reservation {
    id: number;
    confirmationCode: string;
    movieId: string;
    movieTitle: string;
    moviePhoto: string;
    hallName: string;
    time: string;
    date: string;
    numberOfSeats: number;
    totalPrice: string;
    status: 'active' | 'cancelled';
    createdAt: string;
    showtimeId: string;
}

export interface PendingReservationRequest {
    showtimeId: number;
    numberOfSeats: number;
    movieId: string;
    movieTitle: string;
    moviePhoto: string;
    hallName: string;
    time: string;
    date: string;
    price: string;
}

export const saveReservation = async (reservation: Reservation): Promise<void> => {
    try {
        const existing = await getAllReservations();
        const updated = [reservation, ...existing];
        await AsyncStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Error saving reservation:', error);
        throw error;
    }
};

export const getAllReservations = async (): Promise<Reservation[]> => {
    try {
        const data = await AsyncStorage.getItem(RESERVATIONS_KEY);
        if (!data) {
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting reservations:', error);
        return [];
    }
};

export const getActiveReservations = async (): Promise<Reservation[]> => {
    try {
        const all = await getAllReservations();
        return all.filter(r => r.status === 'active');
    } catch (error) {
        console.error('Error getting active reservations:', error);
        return [];
    }
};

export const getReservationByCode = async (code: string): Promise<Reservation | null> => {
    try {
        const all = await getAllReservations();
        return all.find(r => r.confirmationCode === code) || null;
    } catch (error) {
        console.error('Error finding reservation:', error);
        return null;
    }
};

export const updateReservationStatus = async (
    confirmationCode: string,
    status: 'active' | 'cancelled'
): Promise<void> => {
    try {
        const all = await getAllReservations();
        const updated = all.map(r =>
            r.confirmationCode === confirmationCode
                ? { ...r, status }
                : r
        );
        await AsyncStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Error updating reservation:', error);
        throw error;
    }
};

export const deleteReservation = async (confirmationCode: string): Promise<void> => {
    try {
        const all = await getAllReservations();
        const filtered = all.filter(r => r.confirmationCode !== confirmationCode);
        await AsyncStorage.setItem(RESERVATIONS_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error deleting reservation:', error);
        throw error;
    }
};

export const clearAllReservations = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(RESERVATIONS_KEY);
    } catch (error) {
        console.error('Error clearing reservations:', error);
        throw error;
    }
};

export const searchReservations = async (query: string): Promise<Reservation[]> => {
    try {
        const all = await getAllReservations();
        const lowercaseQuery = query.toLowerCase().trim();
        
        if (!lowercaseQuery) {
            return all;
        }
        
        return all.filter(r =>
            r.movieTitle.toLowerCase().includes(lowercaseQuery) ||
            r.confirmationCode.toLowerCase().includes(lowercaseQuery)
        );
    } catch (error) {
        console.error('Error searching reservations:', error);
        return [];
    }
};

export const getReservationQueue = async (): Promise<PendingReservationRequest[]> => {
    try {
        const data = await AsyncStorage.getItem(RESERVATION_QUEUE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting reservation queue:', error);
        return [];
    }
};

export const enqueueReservationRequest = async (req: PendingReservationRequest): Promise<void> => {
    try {
        const queue = await getReservationQueue();
        const updated = [...queue, req];
        await AsyncStorage.setItem(RESERVATION_QUEUE_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Error enqueuing reservation:', error);
        throw error;
    }
};

export const clearReservationQueue = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(RESERVATION_QUEUE_KEY);
    } catch (error) {
        console.error('Error clearing reservation queue:', error);
        throw error;
    }
};

export const processReservationQueue = async (
    createReservationFn: (payload: { showtimeId: number; numberOfSeats: number }) => Promise<any>
): Promise<void> => {
    try {
        const queue = await getReservationQueue();
        if (!queue.length) return;

        const remaining: PendingReservationRequest[] = [];
        for (const item of queue) {
            try {
                const res = await createReservationFn({
                    showtimeId: item.showtimeId,
                    numberOfSeats: item.numberOfSeats,
                });
                const confirmationCode =
                    res?.data?.confirmationCode ?? res?.data?.data?.confirmationCode ?? res?.confirmationCode ?? '';
                const totalPrice = (parseFloat(item.price) * item.numberOfSeats).toFixed(2);
                const reservation: Reservation = {
                    id: Date.now(),
                    confirmationCode,
                    movieId: item.movieId,
                    movieTitle: item.movieTitle,
                    moviePhoto: item.moviePhoto,
                    hallName: item.hallName,
                    time: item.time,
                    date: item.date,
                    numberOfSeats: item.numberOfSeats,
                    totalPrice,
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    showtimeId: String(item.showtimeId),
                };
                await saveReservation(reservation);
            } catch {
                remaining.push(item);
            }
        }
        await AsyncStorage.setItem(RESERVATION_QUEUE_KEY, JSON.stringify(remaining));
    } catch (error) {
        console.error('Error processing reservation queue:', error);
        throw error;
    }
};
