// // app/(auth)/login.tsx
// import { View, TextInput, Button, Alert } from 'react-native';
// import { supabase } from '@/lib/supabase';
// import { useState } from 'react';
//
// export default function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//
//     async function signIn() {
//         const { error } = await supabase.auth.signInWithPassword({
//             email,
//             password,
//         });
//
//         if (error) Alert.alert(error.message);
//
//         const { data } = await supabase.auth.getSession();
//         console.log('SESSION', data.session);
//     }
//
//     return (
//         <View style={{ padding: 20, backgroundColor: '#fff' }}>
//             <TextInput placeholder="Email" onChangeText={setEmail} />
//             <TextInput
//                 placeholder="Password"
//                 secureTextEntry
//                 onChangeText={setPassword}
//             />
//             <Button title="Login" onPress={signIn} />
//         </View>
//     );
// }


import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            return;
        }

        router.replace("/"); // go to Trips
    }

    return (
        <View className="flex-1 justify-center px-6 bg-white">
            <Text className="text-3xl font-bold mb-6">Login</Text>

            <TextInput
                placeholder="Email"
                className="border p-3 rounded-xl mb-3"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                className="border p-3 rounded-xl mb-6"
                value={password}
                onChangeText={setPassword}
            />

            <Pressable
                onPress={handleLogin}
                className="bg-black py-3 rounded-xl"
            >
                <Text className="text-white text-center font-semibold">
                    Sign In
                </Text>
            </Pressable>
        </View>
    );
}
