import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Share,
    ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Knewave_400Regular } from "@expo-google-fonts/knewave";
export default function ConfirmationScreen() {
    const params = useLocalSearchParams<{
        confirmationCode: string;
        movieTitle: string;
        moviePhoto: string;
        hallName: string;
        time: string;
        numberOfSeats: string;
        totalPrice: string;
    }>();

    const handleShare = async () => {
        try {
            await Share.share({
                message: `🎬 CinéTanger Booking Confirmed!\n\nMovie: ${params.movieTitle}\nCode: ${params.confirmationCode}\nSeats: ${params.numberOfSeats}\nTime: ${params.time}\n\nSee you at the cinema!`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };


    const handleViewReservations = () => {
        router.push('/(tabs)/reservations');
    };

    const [fontsLoaded] = useFonts({
        "Alkatra-Regular": require("@/src/fonts/Alkatra-VariableFont_wght.ttf"),
        Knewave_400Regular,
    });
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Success Animation Area */}
                <View style={styles.successSection}>
                    <View style={styles.checkmarkContainer}>
                        <View style={styles.checkmarkCircle}>
                            <Feather name="check" size={60} color="#fff" />
                        </View>
                    </View>
                    <Text style={styles.successTitle}>Booking Confirmed!</Text>
                    <Text style={styles.successSubtitle}>
                        Your reservation has been successfully completed
                    </Text>
                </View>

                {/* Confirmation Code */}
                <View style={styles.codeSection}>
                    <Text style={styles.codeLabel}>Confirmation Code</Text>
                    <View style={styles.codeBox}>
                        <Text style={styles.codeText}>{params.confirmationCode}</Text>
                    </View>
                    <Text style={styles.codeHint}>
                        Show this code at the cinema counter to collect your tickets
                    </Text>
                </View>

                {/* Booking Details */}
                <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Booking Details</Text>

                    <View style={styles.movieCard}>
                        <Image
                            source={{ uri: params.moviePhoto }}
                            style={styles.moviePoster}
                        />
                        <View style={styles.movieInfo}>
                            <Text style={styles.movieTitle} numberOfLines={2}>
                                {params.movieTitle}
                            </Text>

                            <View style={styles.detailRow}>
                                <Feather name="calendar" size={16} color="#aaa" />
                                <Text style={styles.detailLabel}>Date</Text>
                                <Text style={styles.detailValue}>Today</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Feather name="clock" size={16} color="#aaa" />
                                <Text style={styles.detailLabel}>Time</Text>
                                <Text style={styles.detailValue}>{params.time}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Feather name="monitor" size={16} color="#aaa" />
                                <Text style={styles.detailLabel}>Cinema</Text>
                                <Text style={styles.detailValue}>CinéTanger</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Feather name="home" size={16} color="#aaa" />
                                <Text style={styles.detailLabel}>Hall</Text>
                                <Text style={styles.detailValue}>{params.hallName}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Selected Seats */}
                    <View style={styles.seatsCard}>
                        <Text style={styles.cardTitle}>Selected Seats</Text>
                        <View style={styles.seatsInfo}>
                            <View style={styles.seatsRow}>
                                <Feather name="users" size={20} color="#d41132" />
                                <Text style={styles.seatsNumber}>{params.numberOfSeats}</Text>
                                <Text style={styles.seatsLabel}>
                                    {parseInt(params.numberOfSeats) === 1 ? 'Seat' : 'Seats'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Payment Summary */}
                    <View style={styles.paymentCard}>
                        <Text style={styles.cardTitle}>Payment Summary</Text>

                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>
                                {params.numberOfSeats}x Adult Standard
                            </Text>
                            <Text style={styles.paymentValue}>
                                ${(parseFloat(params.totalPrice) - 2).toFixed(2)}
                            </Text>
                        </View>

                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Booking Fee</Text>
                            <Text style={styles.paymentValue}>$2.00</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.paymentRow}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalValue}>${params.totalPrice}</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                        <Feather name="share-2" size={20} color="#d41132" />
                        <Text style={styles.shareBtnText}>Share Booking</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryBtn} onPress={handleViewReservations}>
                        <Feather name="file-text" size={20} color="#fff" />
                        <Text style={styles.primaryBtnText}>View My Tickets</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/(tabs)/filmScreen")}>
                        <Text style={styles.secondaryBtnText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        padding: 20,
    },
    successSection: {
        alignItems: 'center',
        marginVertical: 30,
    },
    checkmarkContainer: {
        marginBottom: 20,
    },
    checkmarkCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    successTitle: {
        fontSize: 28,
        fontFamily: "Knewave_400Regular",
        color: '#fff',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 14,
        color: '#aaa',
        textAlign: 'center',
        fontFamily: "Knewave_400Regular",
        paddingHorizontal: 20,
    },
    codeSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    codeLabel: {
        fontSize: 14,
        color: '#aaa',
        fontFamily: "Knewave_400Regular",
        marginBottom: 10,
    },
    codeBox: {
        backgroundColor: '#1A1A1A',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#d41132',
        fontFamily: "Knewave_400Regular",
        marginBottom: 10,
    },
    codeText: {
        fontSize: 32,
        color: '#d41132',
        fontFamily: "Knewave_400Regular",
        letterSpacing: 2,
    },
    codeHint: {
        fontSize: 12,
        color: '#888',
        fontFamily: "Knewave_400Regular",
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    detailsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: "Knewave_400Regular",
        color: '#fff',
        marginBottom: 15,
    },
    movieCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        gap: 15,
        marginBottom: 15,
    },
    moviePoster: {
        width: 80,
        height: 110,
        borderRadius: 8,
    },
    movieInfo: {
        flex: 1,
    },
    movieTitle: {
        fontSize: 16,
        fontFamily: "Knewave_400Regular",
        color: '#fff',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    detailLabel: {
        color: '#888',
        fontFamily: "Knewave_400Regular",
        fontSize: 13,
        flex: 1,
    },
    detailValue: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    seatsCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        fontFamily: "Knewave_400Regular",
        marginBottom: 12,
    },
    seatsInfo: {
        alignItems: 'center',
    },
    seatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#1A1A1A',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#d41132',
        fontFamily: "Knewave_400Regular",
    },
    seatsNumber: {
        fontSize: 24,
        fontFamily: "Knewave_400Regular",
        color: '#d41132',
    },
    seatsLabel: {
        fontSize: 14,
        color: '#aaa',
        fontFamily: "Knewave_400Regular",
    },
    paymentCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 15,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    paymentLabel: {
        color: '#aaa',
        fontSize: 14,
        fontFamily: "Knewave_400Regular",
    },
    paymentValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: "Knewave_400Regular",
    },
    divider: {
        height: 1,
        backgroundColor: '#2A2A2A',
        marginVertical: 10,
    },
    totalLabel: {
        color: '#fff',
        fontFamily: "Knewave_400Regular",
        fontSize: 16,
    },
    totalValue: {
        fontFamily: "Knewave_400Regular",
        color: '#d41132',
        fontSize: 20,
    },
    actionsSection: {
        gap: 12,
        marginTop: 10,
    },
    shareBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        paddingVertical: 14,
        borderRadius: 25,
        gap: 8,
        borderWidth: 2,
        borderColor: '#d41132',
    },
    shareBtnText: {
        color: '#d41132',
        fontSize: 16,
        fontWeight: '600',
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d41132',
        paddingVertical: 14,
        borderRadius: 25,
        gap: 8,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryBtn: {
        alignItems: 'center',
        paddingVertical: 14,
    },
    secondaryBtnText: {
        color: '#888',
        fontSize: 14,
        fontWeight: '600',
    },
});