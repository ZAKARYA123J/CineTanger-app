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
    Alert
} from "react-native";
import { useFonts, Knewave_400Regular } from "@expo-google-fonts/knewave";
import { useState } from "react";
import { registerUser } from "../service/api";

export default function Register() {
    const [fontsLoaded] = useFonts({
        "Alkatra-Regular": require("@/src/fonts/Alkatra-VariableFont_wght.ttf"),
        Knewave_400Regular,
    });

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await registerUser({ name, email, password });
            Alert.alert("Success", "Account created successfully!");
            router.push("/(tabs)/filmScreen");
            console.log(registerUser);
        } catch (error: any) {
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
                {/* overlay أسود شفاف */}
                <View style={styles.overlay} />

                <View style={styles.content}>
                    <View style={styles.container}>
                        <Image source={require("@/assets/images/image.png")} style={styles.logo} />
                        <Text style={styles.title}>CineTanger</Text>

                        <TextInput
                            placeholder="Enter your name"
                            placeholderTextColor="gray"
                            style={styles.input}
                            value={name}
                            onChangeText={text => setName(text)}
                        />
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
                            onPress={handleRegister}
                            disabled={loading}
                            style={styles.button}

                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Loading..." : "Register"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "100%",
        alignItems: "center",
        marginBottom: 50,
    },
    title: {
        color: "#fff",
        fontSize: 28,
        fontFamily: "Knewave_400Regular",
        marginBottom: 30,
    },
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
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Knewave_400Regular",
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
});
