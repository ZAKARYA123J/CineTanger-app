import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Share } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "../service/api";
import { useFonts, Knewave_400Regular } from "@expo-google-fonts/knewave";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function MovieDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const movieId = Number(id);

    const { data, isLoading, error } = useQuery({
        queryKey: ["movie", movieId],
        queryFn: () => getMovieById(movieId),
        enabled: !!movieId,
    });

    const [fontsLoaded] = useFonts({
        "Alkatra-Regular": require("../fonts/Alkatra-VariableFont_wght.ttf"),
        Knewave_400Regular,
    });

    const handleShare = async () => {
        try {
            const movieUrl = `myapp://movie/${movieId}`; // Deep link
            await Share.share({
                message: `Check out this movie: ${data?.title}\nWatch it here: ${movieUrl}`,
                url: movieUrl,
                title: data?.title,
            });
        } catch (error) {
            console.log("Error sharing movie:", error);
        }
    };

    if (isLoading) return <LoadingScreen />;
    if (error || !data) return <ErrorScreen message="Error loading movie" />;

    const movie = data;
    const showtimes = movie.showtimes || [];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.headerContainer}>
                {movie.photo && (
                    <>
                        <Image source={{ uri: movie.photo }} style={styles.posterImage} resizeMode="cover" />
                        <LinearGradient colors={['transparent', 'rgba(18,18,18,0.8)', '#121212']} style={styles.gradient} />
                    </>
                )}
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                    <Feather name="share-2" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Movie Info */}
            <View style={styles.movieInfoCard}>
                <Text style={styles.title}>{movie.title || "Unknown Title"}</Text>

                {movie.genre && (
                    <View style={styles.genreContainer}>
                        <View style={styles.genreBadge}>
                            <Feather name="film" size={14} color="#d41132" />
                            <Text style={styles.genreText}>{movie.genre}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Feather name="calendar" size={18} color="#d41132" />
                        <Text style={styles.metaText}>{movie.releaseDate || "N/A"}</Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                        <Feather name="clock" size={18} color="#d41132" />
                        <Text style={styles.metaText}>{movie.duration || "N/A"} min</Text>
                    </View>
                </View>

                {movie.description && (
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>
                            <Feather name="align-left" size={20} color="#fff" /> Synopsis
                        </Text>
                        <Text style={styles.description}>{movie.description}</Text>
                    </View>
                )}

                {/* Cast */}
                {movie.artist && (
                    <View style={styles.castSection}>
                        <Text style={styles.sectionTitle}>
                            <Feather name="users" size={20} color="#fff" /> Cast
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castList}>
                            {movie.artist.split(',').map((photo: string, index: number) => (
                                <View key={index} style={styles.castItem}>
                                    <View style={styles.castPhotoContainer}>
                                        <Image source={{ uri: photo.trim() }} style={styles.castPhoto} />
                                        <View style={styles.castGlow} />
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Showtimes */}
                <View style={styles.showtimesSection}>
                    <Text style={styles.sectionTitle}>
                        <Feather name="map-pin" size={20} color="#fff" /> Available Theaters
                    </Text>

                    {showtimes.length > 0 ? (
                        showtimes.map((showtime: any) => {
                            const availableSeats = showtime.totalSeats - showtime.bookedSeats;
                            const fillPercentage = (showtime.bookedSeats / showtime.totalSeats) * 100;

                            return (
                                <View key={showtime.id} style={styles.showtimeCard}>
                                    <View style={styles.theaterHeader}>
                                        <View style={styles.theaterIconContainer}>
                                            <Feather name="map-pin" size={20} color="#d41132" />
                                        </View>
                                        <View style={styles.theaterInfo}>
                                            <Text style={styles.theaterName}>{showtime.theater?.title || "Unknown Theater"}</Text>
                                            {showtime.theater?.name && (
                                                <Text style={styles.theaterLocation}>
                                                    <Feather name="navigation" size={12} color="#888" /> {showtime.theater.name}
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.showtimeContent}>
                                        <View style={styles.timeBox}>
                                            <Feather name="clock" size={16} color="#4ade80" />
                                            <Text style={styles.timeText}>
                                                {new Date(showtime.startTime).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false
                                                })}
                                            </Text>
                                        </View>

                                        <View style={styles.seatsProgressContainer}>
                                            <View style={styles.seatsProgressBar}>
                                                <View style={[styles.seatsProgressFill, { width: `${fillPercentage}%` }]} />
                                            </View>
                                            <Text style={styles.seatsText}>
                                                {availableSeats} / {showtime.totalSeats} seats available
                                            </Text>
                                        </View>

                                        <View style={styles.bookingContainer}>
                                            <View style={styles.priceContainer}>
                                                <Text style={styles.priceLabel}>Price</Text>
                                                <Text style={styles.price}>{showtime.price} DH</Text>
                                            </View>

                                            <TouchableOpacity
                                                style={[styles.bookBtn, availableSeats === 0 && styles.bookBtnDisabled]}
                                                disabled={availableSeats === 0}
                                            >
                                                <Text style={styles.bookText}>
                                                    {availableSeats === 0 ? "Sold Out" : "Book Now"}
                                                </Text>
                                                {availableSeats > 0 && <Feather name="arrow-right" size={18} color="#fff" />}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Feather name="calendar" size={60} color="#444" />
                            <Text style={styles.emptyText}>No showtimes available</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

// Loading Component
const LoadingScreen = () => (
    <View style={styles.centered}><Feather name="film" size={50} color="#d41132" /><Text style={styles.loadingText}>Loading...</Text></View>
);

// Error Component
const ErrorScreen = ({ message }: { message: string }) => (
    <View style={styles.centered}><Feather name="alert-circle" size={50} color="#d41132" /><Text style={styles.errorText}>{message}</Text></View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0a0a0a" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 15 },
    loadingText: { color: "#fff", fontSize: 16, fontFamily: "Knewave_400Regular" },
    errorText: { color: "#fff", fontSize: 16, fontFamily: "Knewave_400Regular" },

    headerContainer: { position: "relative", height: 450 },
    posterImage: { width: "100%", height: "100%" },
    gradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: 200 },
    backBtn: { position: "absolute", top: 50, left: 20, backgroundColor: "rgba(0,0,0,0.7)", padding: 12, borderRadius: 25 },
    shareBtn: { position: "absolute", top: 50, right: 20, backgroundColor: "rgba(0,0,0,0.7)", padding: 12, borderRadius: 25 },

    movieInfoCard: { backgroundColor: "#121212", borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, paddingHorizontal: 20, paddingTop: 25, paddingBottom: 30 },
    title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 12, fontFamily: "Knewave_400Regular" },

    genreContainer: { marginBottom: 15 },
    genreBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(212, 17, 50, 0.15)", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#d41132", alignSelf: "flex-start" },
    genreText: { color: "#d41132", fontWeight: "bold", fontSize: 13 },

    metaContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#1a1a1a", padding: 15, borderRadius: 15, marginBottom: 20 },
    metaItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
    metaDivider: { width: 1, height: 20, backgroundColor: "#333", marginHorizontal: 10 },
    metaText: { color: "#fff", fontSize: 14, fontWeight: "600" },

    descriptionContainer: { marginBottom: 25 },
    sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 15, flexDirection: "row", alignItems: "center", gap: 8 },
    description: { color: "#aaa", lineHeight: 24, fontSize: 14, fontFamily: "Alkatra-Regular" },

    castSection: { marginBottom: 25 },
    castList: { gap: 15, paddingRight: 20 },
    castItem: { alignItems: "center" },
    castPhotoContainer: { position: "relative" },
    castPhoto: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: "#d41132" },
    castGlow: { position: "absolute", width: 90, height: 90, borderRadius: 45, backgroundColor: "#d41132", opacity: 0.2, top: 0, left: 0 },

    showtimesSection: { marginTop: 10 },
    showtimeCard: { backgroundColor: "#1a1a1a", borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: "#2a2a2a", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    theaterHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#2a2a2a" },
    theaterIconContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: "rgba(212, 17, 50, 0.15)", justifyContent: "center", alignItems: "center", marginRight: 12 },
    theaterInfo: { flex: 1 },
    theaterName: { color: "#fff", fontSize: 17, fontWeight: "bold", marginBottom: 4 },
    theaterLocation: { color: "#888", fontSize: 13, flexDirection: "row", alignItems: "center", gap: 4 },

    showtimeContent: { gap: 15 },
    timeBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(74, 222, 128, 0.1)", paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "rgba(74, 222, 128, 0.3)" },
    timeText: { color: "#4ade80", fontSize: 16, fontWeight: "700" },

    seatsProgressContainer: { gap: 8 },
    seatsProgressBar: { height: 8, backgroundColor: "#2a2a2a", borderRadius: 10, overflow: "hidden" },
    seatsProgressFill: { height: "100%", backgroundColor: "#d41132", borderRadius: 10 },
    seatsText: { color: "#aaa", fontSize: 13 },

    bookingContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 15 },
    priceContainer: { gap: 4 },
    priceLabel: { color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 },
    price: { color: "#4ade80", fontSize: 24, fontWeight: "bold" },
    bookBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#d41132", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 15, shadowColor: "#d41132", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
    bookBtnDisabled: { backgroundColor: "#555", shadowOpacity: 0 },
    bookText: { color: "#fff", fontWeight: "bold", fontSize: 15, fontFamily: "Knewave_400Regular" },

    emptyContainer: { justifyContent: "center", alignItems: "center", paddingVertical: 60, gap: 15 },
    emptyText: { color: "#666", fontSize: 16, fontFamily: "Alkatra-Regular" },
});
