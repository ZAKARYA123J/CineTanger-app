import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getUserReservations } from '../../service/api';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useFonts, Knewave_400Regular } from '@expo-google-fonts/knewave';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReservationsScreen() {
  const [fontsLoaded] = useFonts({
    Knewave_400Regular,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-reservations'],
    queryFn: () => getUserReservations(),
  });

  const reservations = data?.data || [];

  const renderTicket = ({ item }: { item: any }) => {
    const movie = item.showtime.Movie;
    const theater = item.showtime.Theater;
    const showtimeDate = new Date(item.showtime.startTime);

    return (
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.movieTitleTicket}>{movie.title}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>CONFIRMED</Text>
          </View>
        </View>

        <View style={styles.ticketContent}>
          <Image
            source={{ uri: movie.photo }}
            style={styles.moviePoster}
          />

          <View style={styles.ticketDetails}>
            <View style={styles.detailRow}>
              <Feather name="calendar" size={14} color="#888" />
              <Text style={styles.detailText}>
                {format(showtimeDate, 'PPP')}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Feather name="clock" size={14} color="#888" />
              <Text style={styles.detailText}>
                {format(showtimeDate, 'p')}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Feather name="map-pin" size={14} color="#888" />
              <Text style={styles.detailText} numberOfLines={1}>
                {theater.name}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Feather name="users" size={14} color="#888" />
              <Text style={styles.detailText}>
                {item.numberOfSeats} {item.numberOfSeats === 1 ? 'Seat' : 'Seats'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.ticketFooter}>
          <View>
            <Text style={styles.label}>Confirmation Code</Text>
            <Text style={styles.code}>{item.confirmationCode}</Text>
          </View>
          <View>
            <Text style={styles.label}>Total Paid</Text>
            <Text style={styles.price}>{item.totalPrice} DH</Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading && !reservations.length) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#d41132" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY TICKETS</Text>
      </View>

      {reservations.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="film" size={60} color="#333" />
          <Text style={styles.emptyTitle}>No tickets yet</Text>
          <Text style={styles.emptySubtitle}>
            Your future bookings will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={reservations}
          renderItem={renderTicket}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor="#d41132"
            />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Knewave_400Regular',
    letterSpacing: 1,
  },
  listContent: {
    padding: 20,
    gap: 20,
  },
  ticketCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#222',
  },
  movieTitleTicket: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Knewave_400Regular',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: "Knewave_400Regular",
  },
  ticketContent: {
    flexDirection: 'row',
    fontFamily: "Knewave_400Regular",
    padding: 15,
    gap: 15,
  },
  moviePoster: {
    width: 70,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  ticketDetails: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: "Knewave_400Regular",
    color: '#ccc',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#222',
  },
  label: {
    color: '#666',
    fontSize: 11,
    fontFamily: "Knewave_400Regular",
    marginBottom: 4,
  },
  code: {
    color: '#d41132',
    fontSize: 16,
    fontFamily: "Knewave_400Regular",
    letterSpacing: 1,
  },
  price: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Knewave_400Regular",
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    opacity: 0.7,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtitle: {
    color: '#666',
    fontSize: 14,
  },
});