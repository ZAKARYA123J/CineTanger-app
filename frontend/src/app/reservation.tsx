import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ReservationCard } from '../../components/reservation/ReservationCard';
import {
    getAllReservations,
    searchReservations,
    updateReservationStatus,
    Reservation,
} from '../../service/reservationStorage';
import { cancelReservation as cancelReservationAPI } from '../../service/api';

export default function ReservationsScreen() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'cancelled'>('all');
    const [cancellingCode, setCancellingCode] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadReservations();
        }, [])
    );

    const loadReservations = async () => {
        try {
            setIsLoading(true);
            const data = await getAllReservations();
            setReservations(data);
            setFilteredReservations(data);
        } catch (error) {
            console.error('Error loading reservations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadReservations();
        setIsRefreshing(false);
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (!query.trim()) {
            filterByTab(activeTab, reservations);
            return;
        }

        try {
            const results = await searchReservations(query);
            filterByTab(activeTab, results);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    const filterByTab = (tab: 'all' | 'active' | 'cancelled', data: Reservation[] = reservations) => {
        setActiveTab(tab);

        let filtered = data;

        if (tab === 'active') {
            filtered = data.filter(r => r.status === 'active');
        } else if (tab === 'cancelled') {
            filtered = data.filter(r => r.status === 'cancelled');
        }

        setFilteredReservations(filtered);
    };

    const handleReservationPress = (reservation: Reservation) => {
        router.push({
            pathname: '/reservationDetails',
            params: {
                confirmationCode: reservation.confirmationCode,
            },
        });
    };

    const cancelMutation = useMutation({
        mutationFn: cancelReservationAPI,
        onMutate: (confirmationCode) => {
            setCancellingCode(confirmationCode);
        },
        onSuccess: async (data, confirmationCode) => {
            await updateReservationStatus(confirmationCode, 'cancelled');
            await loadReservations();
            setCancellingCode(null);
            Alert.alert('Success', 'Reservation cancelled successfully');
        },
        onError: (error: any) => {
            setCancellingCode(null);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to cancel reservation'
            );
        },
    });

    const handleCancelReservation = (reservation: Reservation) => {
        Alert.alert(
            'Cancel Reservation',
            `Are you sure you want to cancel your reservation for "${reservation.movieTitle}"?\n\nCode: ${reservation.confirmationCode}`,
            [
                {
                    text: 'No, Keep it',
                    style: 'cancel',
                },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: () => {
                        cancelMutation.mutate(reservation.confirmationCode);
                    },
                },
            ]
        );
    };

    const clearSearch = () => {
        setSearchQuery('');
        filterByTab(activeTab, reservations);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Reservations</Text>
                <TouchableOpacity onPress={handleRefresh}>
                    <Feather name="refresh-cw" size={22} color="#2563EB" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Feather name="search" size={18} color="#888" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by movie or code..."
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={clearSearch}>
                            <Feather name="x" size={18} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'all' && styles.tabActive]}
                    onPress={() => filterByTab('all')}
                >
                    <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                        All ({reservations.length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'active' && styles.tabActive]}
                    onPress={() => filterByTab('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
                        Active ({reservations.filter(r => r.status === 'active').length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'cancelled' && styles.tabActive]}
                    onPress={() => filterByTab('cancelled')}
                >
                    <Text style={[styles.tabText, activeTab === 'cancelled' && styles.tabTextActive]}>
                        Cancelled ({reservations.filter(r => r.status === 'cancelled').length})
                    </Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={styles.loadingText}>Loading reservations...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredReservations}
                    keyExtractor={(item) => item.confirmationCode}
                    renderItem={({ item }) => (
                        <ReservationCard
                            reservation={item}
                            onPress={() => handleReservationPress(item)}
                            onCancel={() => handleCancelReservation(item)}
                            isLoading={cancellingCode === item.confirmationCode}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            tintColor="#2563EB"
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Feather name="ticket" size={60} color="#444" />
                            <Text style={styles.emptyTitle}>
                                {searchQuery
                                    ? 'No reservations found'
                                    : activeTab === 'active'
                                    ? 'No active reservations'
                                    : activeTab === 'cancelled'
                                    ? 'No cancelled reservations'
                                    : 'No reservations yet'}
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                {searchQuery
                                    ? 'Try a different search term'
                                    : 'Book a movie to see your reservations here'}
                            </Text>
                        </View>
                    }
                />
            )}
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchSection: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 25,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 15,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#1E1E1E',
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#2563EB',
    },
    tabText: {
        color: '#888',
        fontSize: 13,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#fff',
    },
    listContent: {
        padding: 20,
        paddingBottom: 30,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#888',
        fontSize: 14,
        marginTop: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginTop: 15,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
});