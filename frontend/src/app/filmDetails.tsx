import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "../service/api";

export default function MovieDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(movieId),
  });
  console.log(data);
  if (isLoading) return <Text style={{ color: "#fff" }}>Loading...</Text>;
  if (error || !data)
    return <Text style={{ color: "#fff" }}>Movie not found</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: data.photo }} style={styles.image} />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{data.name}</Text>

        <View style={styles.badge}>
          <Text style={styles.genre}>{data.genre}</Text>
        </View>

        <View style={styles.row}>
          <Feather name="calendar" size={14} color="#aaa" />
          <Text style={styles.text}>{data.releaseDate}</Text>
        </View>

        <View style={styles.row}>
          <Feather name="clock" size={14} color="#aaa" />
          <Text style={styles.text}>{data.duration} min</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() =>
            router.push({
              pathname: "/reservation",
              params: {
                movieId: movieId.toString(),
                movieTitle: data.title,
                moviePhoto: data.photo,
                movieGenre: data.genre,
                movieDuration: data.duration.toString(),
              },
            })
          }
        >
          <Text style={styles.bookText}>🎟 Book Ticket</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },

  text: {
    color: "#aaa",
  },

  bookBtn: {
    marginTop: 20,
    backgroundColor: "#d41132",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
  },

  bookText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
