import AsyncStorage from '@react-native-async-storage/async-storage';

const RESERVATIONS_KEY = '@cinetanger_reservations';

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

// Save a new reservation to local storage
export const saveReservation = async (reservation: Reservation): Promise<void> => {
    try {
        // Get existing reservations
        const existing = await getAllReservations();
        
        // Add new reservation at the beginning
        const updated = [reservation, ...existing];
        
        // Save to AsyncStorage
        await AsyncStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Error saving reservation:', error);
        throw error;
    }
};

//Get all reservations from local storage
 
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

//Get active reservations only

export const getActiveReservations = async (): Promise<Reservation[]> => {
    try {
        const all = await getAllReservations();
        return all.filter(r => r.status === 'active');
    } catch (error) {
        console.error('Error getting active reservations:', error);
        return [];
    }
};

//Get reservation by confirmation code
 
export const getReservationByCode = async (code: string): Promise<Reservation | null> => {
    try {
        const all = await getAllReservations();
        return all.find(r => r.confirmationCode === code) || null;
    } catch (error) {
        console.error('Error finding reservation:', error);
        return null;
    }
};

//Update reservation status (e.g., cancel)
 
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

// Delete a reservation permanently
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

//Clear all reservations (for testing/debugging)

export const clearAllReservations = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(RESERVATIONS_KEY);
    } catch (error) {
        console.error('Error clearing reservations:', error);
        throw error;
    }
};

// Search reservations by movie title or confirmation code
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