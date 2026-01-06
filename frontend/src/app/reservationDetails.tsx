import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Share,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { getReservationByCode, updateReservationStatus, Reservation } from '../service/reservationStorage';
import { cancelReservation as cancelReservationAPI } from '../service/api';

export default function ReservationDetailsScreen() {
    const { confirmationCode } = useLocalSearchParams<{ confirmationCode: string }>();
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadReservation();
    }, [confirmationCode]);

    const loadReservation = async () => {
        try {
            setIsLoading(true);
            const data = await getReservationByCode(confirmationCode);
            setReservation(data);
        } catch (error) {
            console.error('Error loading reservation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelMutation = useMutation({
        mutationFn: cancelReservationAPI,
        onSuccess: async () => {
            if (reservation) {
                await updateReservationStatus(reservation.confirmationCode, 'cancelled');
                await loadReservation();
                Alert.alert('Success', 'Reservation cancelled successfully');
            }
        },
        onError: (error: any) => {
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to cancel reservation'
            );
        },
    });

    const handleCancel = () => {
        if (!reservation) return;

        Alert.alert(
            'Cancel Reservation',
            'Are you sure you want to cancel this reservation?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: () => cancelMutation.mutate(reservation.confirmationCode),
                },
            ]
        );
    };

    const handleShare = async () => {
        if (!reservation) return;

        try {
            await Share.share({
                message: `🎬 CinéTanger Booking\n\nMovie: ${reservation.movieTitle}\nCode: ${reservation.confirmationCode}\nSeats: ${reservation.numberOfSeats}\nTime: ${reservation.time}\n\nSee you at the cinema!`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!reservation) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <Feather name="alert-circle" size={60} color="#d41132" />
                    <Text style={styles.errorText}>Reservation not found</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reservation Details</Text>
                <TouchableOpacity onPress={handleShare}>
                    <Feather name="share-2" size={20} color="#2563EB" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View
                    style={[
                        styles.statusBanner,
                        { backgroundColor: reservation.status === 'active' ? '#4CAF50' : '#d41132' },
                    ]}
                >
                    <Text style={styles.statusText}>
                        {reservation.status === 'active' ? '✓ Active Reservation' : '✗ Cancelled'}
                    </Text>
                </View>

                <View style={styles.codeSection}>
                    <Text style={styles.codeLabel}>Confirmation Code</Text>
                    <View style={styles.codeBox}>
                        <Text style={styles.codeText}>{reservation.confirmationCode}</Text>
                    </View>
                </View>

                <View style={styles.movieCard}>
                    <Image
                        source={{ uri: reservation.moviePhoto }}
                        style={styles.moviePoster}
                    />
                    <View style={styles.movieInfo}>
                        <Text style={styles.movieTitle}>{reservation.movieTitle}</Text>

                        <View style={styles.detailRow}>
                            <Feather name="calendar" size={16} color="#aaa" />
                            <Text style={styles.detailText}>{reservation.date}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Feather name="clock" size={16} color="#aaa" />
                            <Text style={styles.detailText}>{reservation.time}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Feather name="monitor" size={16} color="#aaa" />
                            <Text style={styles.detailText}>{reservation.hallName}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Feather name="users" size={16} color="#aaa" />
                            <Text style={styles.detailText}>
                                {reservation.numberOfSeats} {reservation.numberOfSeats === 1 ? 'Seat' : 'Seats'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.priceCard}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Total Amount</Text>
                        <Text style={styles.priceValue}>${reservation.totalPrice}</Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Feather name="info" size={20} color="#2563EB" />
                    <Text style={styles.infoText}>
                        Show this confirmation code at the cinema counter to collect your tickets
                    </Text>
                </View>

                {reservation.status === 'active' && (
                    <TouchableOpacity
                        style={[
                            styles.cancelButton,
                            cancelMutation.isPending && styles.cancelButtonDisabled,
                        ]}
                        onPress={handleCancel}
                        disabled={cancelMutation.isPending}
                    >
                        {cancelMutation.isPending ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Feather name="x-circle" size={20} color="#fff" />
                                <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </ScrollView>
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
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    content: {
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        color: '#888',
        fontSize: 16,
        marginTop: 10,
    },
    errorText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 15,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    statusBanner: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    codeSection: {
        alignItems: 'center',
        marginBottom: 25,
    },
    codeLabel: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 10,
    },
    codeBox: {
        backgroundColor: '#1A1A1A',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2563EB',
    },
    codeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2563EB',
        letterSpacing: 2,
    },
    movieCard: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 15,
        gap: 15,
        marginBottom: 20,
    },
    moviePoster: {
        width: 90,
        height: 130,
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
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    detailText: {
        color: '#aaa',
        fontSize: 14,
    },
    priceCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 16,
        color: '#aaa',
    },
    priceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#0f1729',
        borderRadius: 12,
        padding: 15,
        gap: 12,
        borderWidth: 1,
        borderColor: '#2563EB',
    },
    infoText: {
        flex: 1,
        color: '#aaa',
        fontSize: 13,
        lineHeight: 20,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d41132',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 25,
        gap: 8,
        marginTop: 20,
    },
    cancelButtonDisabled: {
        opacity: 0.6,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});