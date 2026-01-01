import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { createReservation, checkSeatAvailability } from '../service/api';

export default function SeatSelectionScreen() {
    const params = useLocalSearchParams<{
        movieId: string;
        movieTitle: string;
        moviePhoto: string;
        showtimeId: string;
        pricePerSeat: string;
        availableSeats: string;
    }>();

    const [numberOfSeats, setNumberOfSeats] = useState(1);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    const pricePerSeat = parseFloat(params.pricePerSeat) || 0;
    const maxSeats = Math.min(parseInt(params.availableSeats) || 10, 10);
    const subtotal = pricePerSeat * numberOfSeats;
    const bookingFee = 2.00;
    const totalPrice = subtotal + bookingFee;

    const reservationMutation = useMutation({
        mutationFn: createReservation,
        onSuccess: (data) => {
            router.push({
                pathname: '/confirmation',
                params: {
                    confirmationCode: data.data.confirmationCode,
                    movieTitle: params.movieTitle,
                    moviePhoto: params.moviePhoto,
                    numberOfSeats: numberOfSeats.toString(),
                    totalPrice: totalPrice.toFixed(2),
                },
            });
        },
        onError: (error: any) => {
            Alert.alert(
                'Booking Failed',
                error.response?.data?.message || 'Failed to create reservation. Please try again.'
            );
        },
    });

    const handleCheckAvailability = async () => {
        setIsCheckingAvailability(true);

        try {
            const response = await checkSeatAvailability(
                parseInt(params.showtimeId),
                numberOfSeats
            );

            if (response.data.isAvailable) {
                handleConfirmBooking();
            } else {
                Alert.alert(
                    'Not Enough Seats',
                    `Only ${response.data.availableSeats} seats available. Please select fewer seats.`
                );
            }
        } catch (error: any) {
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to check availability'
            );
        } finally {
            setIsCheckingAvailability(false);
        }
    };

    const handleConfirmBooking = () => {
        const userId = 1;

        reservationMutation.mutate({
            userId,
            showtimeId: parseInt(params.showtimeId),
            numberOfSeats,
        });
    };

    const handleIncrement = () => {
        if (numberOfSeats < maxSeats) {
            setNumberOfSeats(numberOfSeats + 1);
        }
    };

    const handleDecrement = () => {
        if (numberOfSeats > 1) {
            setNumberOfSeats(numberOfSeats - 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SELECT SEATS</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.movieSection}>
                    <Image
                        source={{ uri: params.moviePhoto }}
                        style={styles.moviePoster}
                    />
                    <View style={styles.movieInfo}>
                        <Text style={styles.movieTitle} numberOfLines={2}>
                            {params.movieTitle}
                        </Text>
                        <View style={styles.sessionInfo}>
                            <View style={styles.infoRow}>
                                <Feather name="ticket" size={14} color="#aaa" />
                                <Text style={styles.infoText}>{pricePerSeat.toFixed(2)} DH per seat</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.seatSection}>
                    <Text style={styles.sectionTitle}>Number of Seats</Text>

                    <View style={styles.seatCounter}>
                        <TouchableOpacity
                            style={[
                                styles.counterBtn,
                                numberOfSeats === 1 && styles.counterBtnDisabled,
                            ]}
                            onPress={handleDecrement}
                            disabled={numberOfSeats === 1}
                        >
                            <Feather name="minus" size={24} color={numberOfSeats === 1 ? '#555' : '#fff'} />
                        </TouchableOpacity>

                        <View style={styles.seatDisplay}>
                            <Text style={styles.seatNumber}>{numberOfSeats}</Text>
                            <Text style={styles.seatLabel}>
                                {numberOfSeats === 1 ? 'Seat' : 'Seats'}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.counterBtn,
                                numberOfSeats === maxSeats && styles.counterBtnDisabled,
                            ]}
                            onPress={handleIncrement}
                            disabled={numberOfSeats === maxSeats}
                        >
                            <Feather name="plus" size={24} color={numberOfSeats === maxSeats ? '#555' : '#fff'} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.availabilityText}>
                        {maxSeats} seats available
                    </Text>
                </View>

                <View style={styles.priceSection}>
                    <Text style={styles.sectionTitle}>Price Details</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>
                            {numberOfSeats}x Adult Standard
                        </Text>
                        <Text style={styles.priceValue}>{subtotal.toFixed(2)} DH</Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Booking Fee</Text>
                        <Text style={styles.priceValue}>{bookingFee.toFixed(2)} DH</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.priceRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>
                            {totalPrice.toFixed(2)} DH
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.bottomLabel}>Total to pay</Text>
                    <Text style={styles.bottomPrice}>
                        {totalPrice.toFixed(2)} DH
                    </Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.confirmBtn,
                        (reservationMutation.isPending || isCheckingAvailability) && styles.confirmBtnDisabled,
                    ]}
                    onPress={handleCheckAvailability}
                    disabled={reservationMutation.isPending || isCheckingAvailability}
                >
                    {reservationMutation.isPending || isCheckingAvailability ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Feather name="check-circle" size={20} color="#fff" />
                            <Text style={styles.confirmText}>Confirm Booking</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    movieSection: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 30,
        backgroundColor: '#1A1A1A',
        padding: 15,
        borderRadius: 12,
    },
    moviePoster: {
        width: 80,
        height: 110,
        borderRadius: 8,
    },
    movieInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    sessionInfo: {
        gap: 6,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoText: {
        color: '#aaa',
        fontSize: 13,
    },
    seatSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 15,
    },
    seatCounter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
        marginBottom: 10,
    },
    counterBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#d41132',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterBtnDisabled: {
        backgroundColor: '#2A2A2A',
    },
    seatDisplay: {
        alignItems: 'center',
        minWidth: 80,
    },
    seatNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    seatLabel: {
        fontSize: 14,
        color: '#888',
    },
    availabilityText: {
        textAlign: 'center',
        color: '#4CAF50',
        fontSize: 13,
    },
    priceSection: {
        backgroundColor: '#1A1A1A',
        padding: 20,
        borderRadius: 12,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    priceLabel: {
        color: '#aaa',
        fontSize: 14,
    },
    priceValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#2A2A2A',
        marginVertical: 10,
    },
    totalLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    totalValue: {
        color: '#d41132',
        fontSize: 20,
        fontWeight: 'bold',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#1A1A1A',
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
    },
    bottomLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
    },
    bottomPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    confirmBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d41132',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 25,
        gap: 8,
    },
    confirmBtnDisabled: {
        backgroundColor: '#333',
        opacity: 0.5,
    },
    confirmText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});