import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "../service/api";
import { useFonts, Knewave_400Regular } from "@expo-google-fonts/knewave";

export default function MovieDetails() {
    const [fontsLoaded] = useFonts({
        "Alkatra-Regular": require("../fonts/Alkatra-VariableFont_wght.ttf"),
        Knewave_400Regular,
    });
    const { id } = useLocalSearchParams<{ id: string }>();
    const movieId = Number(id);

    const { data, isLoading, error } = useQuery({
        queryKey: ["movie", movieId],
        queryFn: () => getMovieById(movieId),
        enabled: !!movieId,
    });

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error loading movie</Text>
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No movie data available</Text>
            </View>
        );
    }

    const movieInfo = data;
    const showtimes = data.showtimes || [];

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>

            {movieInfo.photo && (
                <Image
                    source={{ uri: movieInfo.photo }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}
            <View style={{ width: "95%", flex: 1 }}>

                <View style={styles.content}>
                    <Text style={styles.title}>{movieInfo.title || "Unknown Title"}</Text>

                    {movieInfo.genre && (
                        <View style={styles.badge}>
                            <Text style={styles.genre}>{movieInfo.genre}</Text>
                        </View>
                    )}

                    <View style={styles.row}>
                        <Feather name="calendar" size={16} color="#aaa" />
                        <Text style={styles.text}>{movieInfo.releaseDate || "N/A"}</Text>
                    </View>

                    <View style={styles.row}>
                        <Feather name="clock" size={16} color="#aaa" />
                        <Text style={styles.text}>{movieInfo.duration || "N/A"} minutes</Text>
                    </View>
                    <View>
                        <Text style={styles.description}>{movieInfo.description}</Text>
                    </View>
                    {movieInfo.artist && (
                        <View style={styles.castSection}>
                            <Text style={styles.castTitle}>Cast</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.castList}
                            >
                                {movieInfo.artist.split(',').map((photo: string, index: number) => (
                                    <View key={index} style={styles.castItem}>
                                        <Image
                                            source={{ uri: photo.trim() }}
                                            style={styles.castPhoto}
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                    <View style={styles.showtimesSection}>
                        <Text style={styles.sectionTitle}>Showtimes by Theater</Text>

                        {showtimes.length > 0 ? (
                            showtimes.map((showtime: any) => {
                                const availableSeats = showtime.totalSeats - showtime.bookedSeats;

                                return (
                                    <View key={showtime.id} style={styles.showtimeCard}>
                                        <View style={styles.theaterInfo}>
                                            <Feather name="map-pin" size={20} color="#d41132" />
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.theaterName}>
                                                    {showtime.theater?.title || "Unknown Theater"}
                                                </Text>
                                                {showtime.theater?.name && (
                                                    <Text style={styles.theaterLocation}>
                                                        {showtime.theater.name}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <View style={styles.showtimeDetails}>
                                            <View style={styles.timeRow}>
                                                <Feather name="clock" size={16} color="#4ade80" />
                                                <Text style={styles.timeText}>
                                                    {new Date(showtime.startTime).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false
                                                    })}
                                                </Text>
                                            </View>

                                            <View style={styles.priceRow}>
                                                <Text style={styles.price}>{showtime.price} DH</Text>
                                                <Text style={styles.seatsAvailable}>
                                                    {availableSeats} seats available
                                                </Text>
                                            </View>

                                            <TouchableOpacity
                                                style={[
                                                    styles.selectBtn,
                                                    availableSeats === 0 && styles.selectBtnDisabled
                                                ]}
                                                disabled={availableSeats === 0}
                                            >
                                                <Text style={styles.selectText}>
                                                    {availableSeats === 0 ? "Sold Out" : "Select Seats"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Feather name="calendar" size={50} color="#444" />
                                <Text style={styles.emptyText}>No showtimes available</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    artist: {
        width: "80%",
        height: 200,
    },
    loadingText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        marginTop: 100,
    },
    castSection: {
        marginTop: 15,
        marginBottom: 15,
    },

    castTitle: {
        fontFamily: "Knewave_400Regular",
        fontSize: 18,
        color: "#fff",
        marginBottom: 12,
    },

    castList: {
        gap: 12,
        paddingRight: 20,
    },

    castItem: {
        alignItems: "center",
    },

    castPhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "#d41132",
        backgroundColor: "#1a1a1a",
    },
    errorText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        marginTop: 100,
    },

    image: {
        width: "100%",
        height: 350,
    },

    backBtn: {
        position: "absolute",
        top: 50,
        left: 20,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 10,
        borderRadius: 20,
        zIndex: 10,
    },

    content: {
        padding: 20,
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
    },

    badge: {
        alignSelf: "flex-start",
        backgroundColor: "#d41132",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 10,
    },

    genre: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },

    text: {
        color: "#aaa",
        lineHeight: 20,
    },

    showtimesSection: {
        marginTop: 30,
        alignItems: "center",
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 15,
    },

    showtimeCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        width: "100%"
    },

    theaterInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#2a2a2a",
    },

    theaterName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

    theaterLocation: {
        color: "#888",
        fontSize: 13,
        marginTop: 2,
    },

    showtimeDetails: {
        gap: 8,
    },

    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    timeText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },

    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    price: {
        color: "#4ade80",
        fontSize: 18,
        fontWeight: "bold",
    },

    seatsAvailable: {
        color: "#aaa",
        fontSize: 12,
    },

    selectBtn: {
        backgroundColor: "#d41132",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 4,
    },

    selectBtnDisabled: {
        backgroundColor: "#555",
    },

    selectText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },

    emptyContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },

    emptyText: {
        color: "#666",
        fontSize: 16,
        marginTop: 10,
    },
    description: {
        fontFamily: "Knewave_400Regular",
        color: "white",
        width: "100%"
    }
});