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
import { useMutation, useQuery } from '@tanstack/react-query';
import { createReservation, checkSeatAvailability } from '../service/api';
import { enqueueReservationRequest, PendingReservationRequest } from '../service/reservationStorage';

export default function SeatSelectionScreen() {
    const params = useLocalSearchParams<{
        movieId: string;
        movieTitle: string;
        moviePhoto: string;
        showtimeId: string;
        hallName: string;
        time: string;
        price: string;
        availableSeats: string;
    }>();

    const [numberOfSeats, setNumberOfSeats] = useState(1);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    // Real-time availability check for selected showtime
    const { data: availabilityData } = useQuery({
        queryKey: ['availability', params.showtimeId],
        queryFn: () => checkSeatAvailability(parseInt(params.showtimeId), 1),
        refetchInterval: 5000, // Check every 5 seconds
        enabled: true,
    });

    // Update max seats based on real-time data
    const currentAvailableSeats = availabilityData?.data?.availableSeats || parseInt(params.availableSeats);
    const maxSeats = Math.min(currentAvailableSeats, 10);
    const totalPrice = parseFloat(params.price) * numberOfSeats;

    // Mutation for creating reservation
    const reservationMutation = useMutation({
        mutationFn: createReservation,
        onSuccess: (data) => {
            router.push({
                pathname: '/confirmation',
                params: {
                    confirmationCode: data.data.confirmationCode,
                    movieId: params.movieId,
                    movieTitle: params.movieTitle,
                    moviePhoto: params.moviePhoto,
                    hallName: params.hallName,
                    time: params.time,
                    date: new Date().toISOString().split('T')[0],
                    numberOfSeats: numberOfSeats.toString(),
                    totalPrice: (totalPrice + 2).toFixed(2),
                    showtimeId: params.showtimeId,
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

    // Check seat availability before booking
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

    // Confirm booking
    const handleConfirmBooking = async () => {
        let online = true;
        try {
            const dynamicImport: any = (Function('return import'))();
            const mod: any = await dynamicImport('@react-native-community/' + 'netinfo');
            const state = await mod.default.fetch();
            online = Boolean(state.isConnected && state.isInternetReachable !== false);
        } catch {}

        if (!online) {
            const req: PendingReservationRequest = {
                showtimeId: parseInt(params.showtimeId),
                numberOfSeats,
                movieId: params.movieId,
                movieTitle: params.movieTitle,
                moviePhoto: params.moviePhoto,
                hallName: params.hallName,
                time: params.time,
                date: new Date().toISOString().split('T')[0],
                price: params.price,
            };
            try {
                await enqueueReservationRequest(req);
                Alert.alert('Mode hors ligne', 'Réservation ajoutée à la file d’attente');
                router.back();
            } catch (e: any) {
                Alert.alert('Erreur', e?.message || 'Impossible d’ajouter à la file');
            }
            return;
        }

        reservationMutation.mutate({
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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SELECT SEATS</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                {/* Movie Info */}
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
                                <Feather name="clock" size={14} color="#aaa" />
                                <Text style={styles.infoText}>{params.time}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Feather name="monitor" size={14} color="#aaa" />
                                <Text style={styles.infoText}>{params.hallName}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Seat Counter */}
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

                {/* Price Breakdown */}
                <View style={styles.priceSection}>
                    <Text style={styles.sectionTitle}>Price Details</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>
                            {numberOfSeats}x Adult Standard
                        </Text>
                        <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Booking Fee</Text>
                        <Text style={styles.priceValue}>$2.00</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.priceRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>
                            ${(totalPrice + 2).toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.bottomLabel}>Total to pay</Text>
                    <Text style={styles.bottomPrice}>
                        ${(totalPrice + 2).toFixed(2)}
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
        backgroundColor: '#2563EB',
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
        color: '#2563EB',
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
        backgroundColor: '#2563EB',
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
