import { Knewave_400Regular, useFonts } from "@expo-google-fonts/knewave";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { loginUser } from "../service/api";
import { useAuthStore } from "../store/auth";

export default function Login() {
    const [fontsLoaded] = useFonts({
        "Alkatra-Regular": require("@/src/fonts/Alkatra-VariableFont_wght.ttf"),
        Knewave_400Regular,
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const setToken = useAuthStore((s: any) => s.setToken);

    if (!fontsLoaded) return null;

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await loginUser({ email, password });

            if (!res.token) {
                Alert.alert("Error", "No token received from backend");
                return;
            }

            await setToken(res.token);

            Alert.alert("Success", "Logged in successfully!");
            router.replace("/(tabs)/filmScreen");
        } catch (error: any) {
            Alert.alert("Login Error", error.message);
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
                        <Image
                            source={require("@/assets/images/image.png")}
                            style={styles.logo}
                        />

                        <Text style={styles.title}>CineTanger</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="email" size={22} color="gray" />
                            <TextInput
                                placeholder="Enter your email"
                                placeholderTextColor="gray"
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="lock" size={22} color="gray" />
                            <TextInput
                                placeholder="Enter your password"
                                placeholderTextColor="gray"
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Loading..." : "Login"}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.footerText}>
                            Don’t have an account ?
                            <Text
                                style={styles.link}
                                onPress={() => router.push("/register")}
                            >
                                {" "}Sign Up
                            </Text>
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1 },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.6)",
    },

    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        width: "100%",
        alignItems: "center",
        paddingBottom: 40,
    },

    logo: {
        width: 120,
        height: 120,
        marginBottom: 15,
    },

    title: {
        color: "#fff",
        fontSize: 28,
        fontFamily: "Knewave_400Regular",
        marginBottom: 30,
    },

    inputContainer: {
        width: 300,
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2d1619",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "gray",
        paddingHorizontal: 15,
        marginBottom: 15,
    },

    input: {
        flex: 1,
        color: "#fff",
        marginLeft: 10,
        fontFamily: "Knewave_400Regular",
        fontSize: 16,
    },

    button: {
        marginTop: 20,
        paddingVertical: 12,
        backgroundColor: "#d41132",
        borderRadius: 10,
        width: 300,
        alignItems: "center",
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Knewave_400Regular",
    },

    footerText: {
        marginTop: 15,
        color: "#fff",
        fontFamily: "Knewave_400Regular",
    },

    link: {
        color: "red",
    },
});
