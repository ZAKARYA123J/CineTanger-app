import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"
import { useQuery } from "@tanstack/react-query";
import { getMovie } from "../service/api";
import { useFonts, Knewave_400Regular } from "@expo-google-fonts/knewave";

export default function Film() {
  const [fontsLoaded] = useFonts({
    "Alkatra-Regular": require("../fonts/Alkatra-VariableFont_wght.ttf"),
    Knewave_400Regular,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["Movie"],
    queryFn: getMovie
  });

  if (!fontsLoaded) return null;
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Movie not found</Text>;

  const movies = data.data;

  return (
    <SafeAreaView style={{ backgroundColor: "#121212", flex: 1 }}>
      <View style={{ flex: 1, width: "95%", alignItems: "center" }}>
        <View style={styles.serach}>
          <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center", fontFamily: "Alkatra-Regular", fontSize: 40 }}>
            search
          </Text>
        </View>
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 20 }}>
              <Image source={{ uri: item.photo }} style={{ width: 200, height: 120, marginTop: 5 }} />
              <Text style={{ fontFamily: "Knewave_400Regular", fontSize: 20, color: "#fff" }}>{item.title}</Text>
              <Text>Genre: {item.genre}</Text>
              <Text>Duration: {item.duration} min</Text>
              <Text>Release: {item.releaseDate}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  serach: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    width: "90%",
  }
});
