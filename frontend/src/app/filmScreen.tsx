import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getMovie } from "../service/api";
import { useFonts, Knewave_400Regular } from "@expo-google-fonts/knewave";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from "react";

interface Movie {
  id: number;
  title: string;
  genre: string;
  photo: string;
  releaseDate: string;
  duration: number;
}

export default function Film() {
  const [fontsLoaded] = useFonts({
    "Alkatra-Regular": require("../fonts/Alkatra-VariableFont_wght.ttf"),
    Knewave_400Regular,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: getMovie,
  });

  const [search, setSearch] = useState("");

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loadingText}>Loading Movies...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Movie not found</Text>
      </SafeAreaView>
    );
  }

  const movies = data.data;
  const filteredMovies = movies.filter((movie: Movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase()) ||
    movie.genre.toLowerCase().includes(search.toLowerCase())
  );

  const MovieCard = ({ item }: { item: Movie }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.photo }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
      <View style={styles.genreBadge}>
        <Text style={styles.genreText} numberOfLines={1}>{item.genre}</Text>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Feather name="calendar" size={12} color="#888" />
          <Text style={styles.infoText}>{item.releaseDate}</Text>
        </View>
        <View style={styles.infoItem}>
          <Feather name="clock" size={12} color="#888" />
          <Text style={styles.infoText}>{item.duration}m</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookBtn}>
        <FontAwesome6 name="ticket" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.bookText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Feather name="menu" size={24} color="#fff" />
          <Text style={styles.headerTitle}>CineTanger</Text>
          <Ionicons name="notifications" size={24} color="#fff" />
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.search}>
            <FontAwesome name="search" size={18} color="#888" />
            <TextInput
              placeholder="Search movies, genres..."
              placeholderTextColor="#666"
              style={styles.input}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => <MovieCard item={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="film" size={60} color="#444" />
              <Text style={styles.emptyText}>No movies found</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#121212",
  },

  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },

  loadingText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },

  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  headerTitle: {
    fontFamily: "Knewave_400Regular",
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
  },

  searchWrapper: {
    marginBottom: 10,
  },

  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 26,
    gap: 10,
  },

  input: {
    flex: 1,
    color: "#fff",
    fontFamily: "Alkatra-Regular",
    fontSize: 15,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    width: "48%",
    padding: 8,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 6,
  },

  title: {
    fontFamily: "Knewave_400Regular",
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },

  genreBadge: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#ff6b6b",
    alignSelf: "flex-start",
  },

  genreText: {
    color: "#ff6b6b",
    fontSize: 11,
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  infoText: {
    color: "#888",
    fontSize: 11,
    fontFamily: "Alkatra-Regular",
  },

  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d41132",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  bookText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Knewave_400Regular",
  },

  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },

  emptyText: {
    color: "#666",
    fontSize: 16,
    fontFamily: "Alkatra-Regular",
  },
});
