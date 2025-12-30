import { View, Text, FlatList, Image } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getMovie } from "../service/api";

export default function Film() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["Movie"],
    queryFn: getMovie
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Movie not found</Text>;

  const movies = data.data;

  return (
    <View>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>Genre: {item.genre}</Text>
            <Text>Duration: {item.duration} min</Text>
            <Text>Release: {item.releaseDate}</Text>
            <Image
              source={{ uri: item.photo }}
              style={{ width: 200, height: 120, marginTop: 5 }}
            />
          </View>
        )}
      />
    </View>
  );
}
