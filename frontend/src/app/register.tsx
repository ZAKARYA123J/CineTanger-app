import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function register() {
    return (
        <SafeAreaView>
            <View>
                <Text>Hello</Text>
                <TouchableOpacity onPress={() => router.push("/filmScreen")}>
                    <Text>add</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}