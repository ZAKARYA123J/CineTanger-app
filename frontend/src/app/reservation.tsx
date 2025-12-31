import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getShowtimesByMovieId } from '../service/api';

// Mock showtime data (fallback if API fails)
const MOCK_SHOWTIMES = [
    {
        id: 1,
        date: '2024-12-28',
        dayName: 'Sat',
        dayNumber: '28',
        halls: [
            {
                id: 1,
                name: 'Hall 1',
                type: 'IMAX Laser',
                isPremium: true,
                times: [
                    { id: 1, time: '14:30', language: 'English', price: 18.50, availableSeats: 45 },
                    { id: 2, time: '17:45', language: 'French', price: 18.50, availableSeats: 32 },
                ],
            },
            {
                id: 2,
                name: 'Hall 4',
                type: 'VIP Lounge',
                isPremium: true,
                times: [
                    { id: 3, time: '16:00', language: 'English', price: 25.00, availableSeats: 12 },
                    { id: 4, time: '19:30', language: 'English', price: 25.00, availableSeats: 0 },
                ],
            },
        ],
    },
    {
        id: 2,
        date: '2024-12-29',
        dayName: 'Sun',
        dayNumber: '29',
        halls: [
            {
                id: 1,
                name: 'Hall 1',
                type: 'IMAX Laser',
                isPremium: true,
                times: [
                    { id: 5, time: '15:00', language: 'English', price: 18.50, availableSeats: 58 },
                ],
            },
        ],
    },
];

export default function ReservationScreen() {
    const params = useLocalSearchParams<{
        movieId: string;
        movieTitle: string;
        moviePhoto: string;
        movieGenre: string;
        movieDuration: string;
    }>();

    const [selectedDate, setSelectedDate] = useState(1);
    const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
    const [validationError, setValidationError] = useState<string>('');

    // Real-time seat availability check (refetch every 10 seconds)
    const { data: showtimesData, isLoading, refetch } = useQuery({
        queryKey: ['showtimes', params.movieId],
        queryFn: () => getShowtimesByMovieId(params.movieId),
        refetchInterval: 10000, // Refresh every 10 seconds
        refetchIntervalInBackground: false,
        enabled: !!params.movieId,
    });

    // Use API data if available, otherwise use mock data
    const showtimes = showtimesData?.data || MOCK_SHOWTIMES;
    const selectedDateData = showtimes.find((d: any) => d.id === selectedDate);

    // Monitor seat availability changes
    useEffect(() => {
        if (selectedShowtime && showtimesData) {
            const currentShowtime = selectedDateData?.halls
                .flatMap(hall => hall.times)
                .find(time => time.id === selectedShowtime.id);

            if (currentShowtime) {
                if (currentShowtime.availableSeats !== selectedShowtime.availableSeats) {
                    if (currentShowtime.availableSeats === 0) {
                        Alert.alert(
                            'Showtime Sold Out',
                            'The selected showtime is now sold out. Please select another time.'
                        );
                        setSelectedShowtime(null);
                    } else if (currentShowtime.availableSeats < selectedShowtime.availableSeats) {
                        Alert.alert(
                            'Seats Updated',
                            `Only ${currentShowtime.availableSeats} seats remaining for this showtime.`
                        );
                        setSelectedShowtime(currentShowtime);
                    }
                }
            }
        }
    }, [showtimesData]);

    // Validation function
    const validateSelection = (): boolean => {
        setValidationError('');

        if (!selectedDate) {
            setValidationError('Please select a date');
            Alert.alert('Validation Error', 'Please select a date to continue');
            return false;
        }

        if (!selectedShowtime) {
            setValidationError('Please select a showtime');
            Alert.alert('Validation Error', 'Please select a showtime to continue');
            return false;
        }

        if (selectedShowtime.availableSeats === 0) {
            setValidationError('This showtime is sold out');
            Alert.alert('Sold Out', 'This showtime is sold out. Please select another time.');
            return false;
        }

        if (selectedShowtime.availableSeats < 1) {
            setValidationError('No seats available');
            Alert.alert('No Seats', 'No seats are available for this showtime.');
            return false;
        }

        return true;
    };

    const handleSelectSeats = (showtime: any, hall: any) => {
        setSelectedShowtime(showtime);
        setValidationError('');

        if (!validateSelection()) {
            return;
        }

        router.push({
            pathname: '/seatSelection',
            params: {
                movieId: params.movieId,
                movieTitle: params.movieTitle,
                moviePhoto: params.moviePhoto,
                showtimeId: showtime.id.toString(),
                hallName: hall.name,
                time: showtime.time,
                price: showtime.price.toString(),
                availableSeats: showtime.availableSeats.toString(),
            },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {params.movieTitle}
                </Text>
                <TouchableOpacity onPress={() => refetch()}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#2563EB" />
                    ) : (
                        <Feather name="refresh-cw" size={20} color="#2563EB" />
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Real-time Update Indicator */}
                {isLoading && (
                    <View style={styles.updateIndicator}>
                        <ActivityIndicator size="small" color="#2563EB" />
                        <Text style={styles.updateText}>Updating availability...</Text>
                    </View>
                )}

                {/* Movie Info */}
                <View style={styles.movieInfo}>
                    <Image
                        source={{ uri: params.moviePhoto }}
                        style={styles.moviePoster}
                    />
                    <View style={styles.movieDetails}>
                        <Text style={styles.movieTitle} numberOfLines={2}>
                            {params.movieTitle}
                        </Text>
                        <View style={styles.genreBadge}>
                            <Text style={styles.genreText}>{params.movieGenre}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Feather name="clock" size={14} color="#aaa" />
                            <Text style={styles.infoText}>{params.movieDuration}m</Text>
                        </View>
                    </View>
                </View>

                {/* Date Selector */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Date</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.dateScroll}
                    >
                        {showtimes.map((date: any) => (
                            <TouchableOpacity
                                key={date.id}
                                style={[
                                    styles.dateCard,
                                    selectedDate === date.id && styles.dateCardSelected,
                                ]}
                                onPress={() => setSelectedDate(date.id)}
                            >
                                <Text
                                    style={[
                                        styles.dayName,
                                        selectedDate === date.id && styles.textSelected,
                                    ]}
                                >
                                    {date.dayName}
                                </Text>
                                <Text
                                    style={[
                                        styles.dayNumber,
                                        selectedDate === date.id && styles.textSelected,
                                    ]}
                                >
                                    {date.dayNumber}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Showtimes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Showtime</Text>

                    {selectedDateData?.halls.map((hall: any) => (
                        <View key={hall.id} style={styles.hallSection}>
                            <View style={styles.hallHeader}>
                                <View>
                                    <Text style={styles.hallName}>{hall.name}</Text>
                                    <Text style={styles.hallType}>{hall.type}</Text>
                                </View>
                                {hall.isPremium && (
                                    <View style={styles.premiumBadge}>
                                        <Text style={styles.premiumText}>Premium</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.timesGrid}>
                                {hall.times.map((showtime: any) => (
                                    <TouchableOpacity
                                        key={showtime.id}
                                        style={[
                                            styles.timeCard,
                                            showtime.availableSeats === 0 && styles.timeCardSoldOut,
                                            selectedShowtime?.id === showtime.id && styles.timeCardSelected,
                                        ]}
                                        onPress={() =>
                                            showtime.availableSeats > 0 && handleSelectSeats(showtime, hall)
                                        }
                                        disabled={showtime.availableSeats === 0}
                                    >
                                        <Text
                                            style={[
                                                styles.timeText,
                                                showtime.availableSeats === 0 && styles.textSoldOut,
                                            ]}
                                        >
                                            {showtime.time}
                                        </Text>
                                        <Text style={styles.languageText}>{showtime.language}</Text>
                                        {showtime.availableSeats === 0 ? (
                                            <View style={styles.soldOutBadge}>
                                                <Text style={styles.soldOutText}>SOLD OUT</Text>
                                            </View>
                                        ) : (
                                            <View style={styles.seatInfo}>
                                                <Feather name="users" size={12} color="#4CAF50" />
                                                <Text style={styles.seatText}>
                                                    {showtime.availableSeats} seats
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* Error Message Banner */}
            {validationError && (
                <View style={styles.errorBanner}>
                    <Feather name="alert-circle" size={18} color="#fff" />
                    <Text style={styles.errorText}>{validationError}</Text>
                </View>
            )}

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.totalLabel}>Total Price</Text>
                    <Text style={styles.totalPrice}>
                        {selectedShowtime ? `$${selectedShowtime.price.toFixed(2)}` : '--'}{' '}
                        <Text style={styles.perPerson}>/person</Text>
                    </Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.selectSeatsBtn,
                        !selectedShowtime && styles.selectSeatsBtnDisabled,
                    ]}
                    disabled={!selectedShowtime}
                    onPress={() => {
                        if (!validateSelection()) {
                            return;
                        }

                        const hall = selectedDateData?.halls.find(h =>
                            h.times.some(t => t.id === selectedShowtime.id)
                        );

                        if (hall && selectedShowtime) {
                            handleSelectSeats(selectedShowtime, hall);
                        }
                    }}
                >
                    <Text style={styles.selectSeatsText}>Select Seats</Text>
                    <Feather name="arrow-right" size={20} color="#fff" />
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
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    updateIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A2942',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        gap: 8,
        alignSelf: 'center',
        marginBottom: 15,
        marginTop: 10,
    },
    updateText: {
        color: '#2563EB',
        fontSize: 12,
        fontWeight: '600',
    },
    movieInfo: {
        flexDirection: 'row',
        padding: 20,
        gap: 15,
    },
    moviePoster: {
        width: 100,
        height: 140,
        borderRadius: 12,
    },
    movieDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    movieTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    genreBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#d41132',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    genreText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
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
    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 15,
    },
    dateScroll: {
        gap: 10,
    },
    dateCard: {
        backgroundColor: '#1E1E1E',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        minWidth: 70,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    dateCardSelected: {
        backgroundColor: '#2563EB',
        borderColor: '#3B82F6',
    },
    dayName: {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
    },
    dayNumber: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    textSelected: {
        color: '#fff',
    },
    hallSection: {
        marginBottom: 20,
    },
    hallHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    hallName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    hallType: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    premiumBadge: {
        backgroundColor: '#FFB800',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    premiumText: {
        color: '#000',
        fontSize: 11,
        fontWeight: '700',
    },
    timesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    timeCard: {
        backgroundColor: '#1E1E1E',
        padding: 12,
        borderRadius: 12,
        minWidth: 110,
        borderWidth: 2,
        borderColor: '#2A2A2A',
    },
    timeCardSelected: {
        borderColor: '#2563EB',
        backgroundColor: '#1a2942',
    },
    timeCardSoldOut: {
        backgroundColor: '#1A1A1A',
        opacity: 0.5,
    },
    timeText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    textSoldOut: {
        color: '#666',
    },
    languageText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 6,
    },
    seatInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    seatText: {
        fontSize: 11,
        color: '#4CAF50',
    },
    soldOutBadge: {
        backgroundColor: '#d41132',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    soldOutText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    errorBanner: {
        backgroundColor: '#d41132',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 10,
    },
    errorText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
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
    totalLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
    },
    totalPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    perPerson: {
        fontSize: 14,
        color: '#888',
    },
    selectSeatsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 25,
        gap: 8,
    },
    selectSeatsBtnDisabled: {
        backgroundColor: '#333',
        opacity: 0.5,
    },
    selectSeatsText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});