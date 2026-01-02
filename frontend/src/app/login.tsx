import { router } from "expo-router";
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    TextInput,
    StatusBar,
    Image,
    Alert,
} from "react-native";
import { useFonts, Knewave_400Regular } from "@expo-google-fonts/knewave";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../service/api";

export default function Login() {
    const [fontsLoaded] = useFonts({
        "Alkatra-Regular": require("@/src/fonts/Alkatra-VariableFont_wght.ttf"),
        Knewave_400Regular,
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await loginUser({ email, password });

            console.log("Login response received:", res);
            console.log("Token value:", res.token);

            if (!res.token) {
                Alert.alert("Error", "No token in response: " + JSON.stringify(res));
                return;
            }

            await AsyncStorage.setItem("@user_token", res.token);
            Alert.alert("Success", "Logged in successfully!");
            router.push("/(tabs)/filmScreen");

        } catch (error: any) {
            console.log("Login Error:", error.message);
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={require("@/assets/images/image-login.jpg")}
                style={styles.bg}
                resizeMode="cover"
            >
                <View style={styles.overlay} />
                <View style={styles.content}>
                    <View style={styles.container}>
                        <Image source={require("@/assets/images/image.png")} style={styles.logo} />
                        <Text style={styles.title}>Login</Text>
                        <TextInput
                            placeholder="Enter your email"
                            placeholderTextColor="gray"
                            style={styles.input}
                            value={email}
                            onChangeText={text => setEmail(text)}
                        />
                        <TextInput
                            placeholder="Enter your password"
                            placeholderTextColor="gray"
                            style={styles.input}
                            value={password}
                            secureTextEntry
                            onChangeText={text => setPassword(text)}
                        />
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Loading..." : "Login"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1 },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
    content: { flex: 1, justifyContent: "center", alignItems: "center" },
    container: { width: "100%", alignItems: "center", marginBottom: 50 },
    title: { color: "#fff", fontSize: 28, fontFamily: "Knewave_400Regular", marginBottom: 30 },
    input: {
        width: 300,
        height: 50,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 15,
        backgroundColor: "#2d1619",
        paddingHorizontal: 15,
        color: "#fff",
        fontFamily: "Knewave_400Regular",
        fontSize: 16,
        marginBottom: 15,
    },
    button: {
        marginTop: 20,
        padding: 12,
        backgroundColor: "#d41132",
        borderRadius: 10,
        width: 300,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontSize: 16, fontFamily: "Knewave_400Regular" },
    logo: { width: 120, height: 120, marginBottom: 20 },
});
