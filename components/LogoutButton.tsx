import { Pressable, Text } from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

export function LogoutButton() {
    const router = useRouter();

    async function logout() {
        await supabase.auth.signOut();
        router.replace("/login");
    }

    return (
        <Pressable
            onPress={logout}
            className="bg-red-500 px-4 py-2 rounded-xl"
        >
            <Text className="text-white font-semibold">Logout</Text>
        </Pressable>
    );
}
