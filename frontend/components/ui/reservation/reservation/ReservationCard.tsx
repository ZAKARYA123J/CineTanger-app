import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ReservationCardProps {
    reservation: {
        id: number;
        confirmationCode: string;
        movieTitle: string;
        moviePhoto: string;
        hallName: string;
        time: string;
        date: string;
        numberOfSeats: number;
        totalPrice: string;
        status: 'active' | 'cancelled';
        createdAt: string;
    };
    onPress?: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
    reservation,
    onPress,
    onCancel,
    isLoading = false,
}) => {
    const getStatusColor = () => {
        switch (reservation.status) {
            case 'active':
                return '#4CAF50';
            case 'cancelled':
                return '#d41132';
            default:
                return '#888';
        }
    };

    const getStatusText = () => {
        switch (reservation.status) {
            case 'active':
                return 'Active';
            case 'cancelled':
                return 'Cancelled';
            default:
                return 'Unknown';
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.card,
                reservation.status === 'cancelled' && styles.cardCancelled,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <Image
                    source={{ uri: reservation.moviePhoto }}
                    style={styles.poster}
                />
                <View style={styles.info}>
                    <Text style={styles.movieTitle} numberOfLines={2}>
                        {reservation.movieTitle}
                    </Text>

                    <View style={styles.detailRow}>
                        <Feather name="calendar" size={14} color="#aaa" />
                        <Text style={styles.detailText}>{reservation.date}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Feather name="clock" size={14} color="#aaa" />
                        <Text style={styles.detailText}>{reservation.time}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Feather name="monitor" size={14} color="#aaa" />
                        <Text style={styles.detailText}>{reservation.hallName}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.footer}>
                <View style={styles.codeSection}>
                    <Text style={styles.codeLabel}>Code</Text>
                    <View style={styles.codeBadge}>
                        <Text style={styles.codeText}>{reservation.confirmationCode}</Text>
                    </View>
                </View>

                <View style={styles.seatsSection}>
                    <Feather name="users" size={16} color="#2563EB" />
                    <Text style={styles.seatsText}>
                        {reservation.numberOfSeats} {reservation.numberOfSeats === 1 ? 'Seat' : 'Seats'}
                    </Text>
                </View>

                <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Total</Text>
                    <Text style={styles.priceText}>${reservation.totalPrice}</Text>
                </View>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>

            {reservation.status === 'active' && onCancel && (
                <TouchableOpacity
                    style={[
                        styles.cancelBtn,
                        isLoading && styles.cancelBtnLoading,
                    ]}
                    onPress={(e) => {
                        e.stopPropagation();
                        if (!isLoading) {
                            onCancel();
                        }
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#d41132" />
                    ) : (
                        <Feather name="x-circle" size={20} color="#d41132" />
                    )}
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    cardCancelled: {
        opacity: 0.6,
    },
    header: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    poster: {
        width: 70,
        height: 100,
        borderRadius: 8,
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    detailText: {
        color: '#aaa',
        fontSize: 13,
    },
    divider: {
        height: 1,
        backgroundColor: '#2A2A2A',
        marginVertical: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    codeSection: {
        flex: 1,
    },
    codeLabel: {
        fontSize: 11,
        color: '#888',
        marginBottom: 4,
    },
    codeBadge: {
        backgroundColor: '#0f1729',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#2563EB',
        alignSelf: 'flex-start',
    },
    codeText: {
        color: '#2563EB',
        fontSize: 12,
        fontWeight: '700',
    },
    seatsSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    seatsText: {
        color: '#2563EB',
        fontSize: 13,
        fontWeight: '600',
    },
    priceSection: {
        alignItems: 'flex-end',
    },
    priceLabel: {
        fontSize: 11,
        color: '#888',
        marginBottom: 2,
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    statusBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    cancelBtn: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        padding: 8,
        backgroundColor: '#2A2A2A',
        borderRadius: 20,
    },
    cancelBtnLoading: {
        opacity: 0.6,
    },
});