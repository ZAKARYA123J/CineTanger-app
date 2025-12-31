import { View, Text, FlatList, Image, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getMovie } from "../service/api";
import { useFonts, Knewave_400Regular } from "@expo-google-fonts/knewave";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Film() {
  const [fontsLoaded] = useFonts({
    "Alkatra-Regular": require("../fonts/Alkatra-VariableFont_wght.ttf"),
    Knewave_400Regular,
  });
  const { data, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: getMovie,
  });

  if (!fontsLoaded) return null;
  if (isLoading) return <Text style={{ color: "#fff" }}>Loading...</Text>;
  if (error) return <Text style={{ color: "#fff" }}>Movie not found</Text>;

  const movies = data.data;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Feather name="list" size={24} color="#fff" />
          <Text style={styles.headerTitle}>CineTanger</Text>
          <Ionicons name="notifications" size={24} color="#fff" />
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.search}>
            <FontAwesome
              name="search"
              size={18}
              color="#57474b"
              style={{ marginRight: 12 }}
            />
            <TextInput
              placeholder="Find a movie, genre, actor..."
              placeholderTextColor="#57474b"
              style={styles.input}
            />
          </View>
        </View>
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.photo }} style={styles.image} />

              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>

              <Text style={styles.genre} numberOfLines={1}>
                {item.genre}
              </Text>
              <Text>{item.releaseDate}</Text>
              <Text>{item.duration}</Text>
            </View>
          )}
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
    width: "95%",
    alignSelf: "center",
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: "Knewave_400Regular",
    fontSize: 24,
    color: "#fff",
  },

  searchWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },

  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#271c1d",
    paddingHorizontal: 16,
    height: 50,
    width: "90%",
    borderRadius: 12,
  },

  input: {
    flex: 1,
    color: "#57474b",
    fontFamily: "Alkatra-Regular",
    fontSize: 16,
  },

  row: {
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
    width: "48%",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 6,
  },

  title: {
    fontFamily: "Knewave_400Regular",
    fontSize: 14,
    color: "#fff",
  },

  genre: {
    color: "#aaa",
    fontSize: 12,
  },
});
