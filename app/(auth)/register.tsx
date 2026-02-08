import { View, TextInput, Button, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function signIn() {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) Alert.alert(error.message);
    }

    return (
        <View style={{ padding: 20 }}>
            <TextInput placeholder="Email" onChangeText={setEmail} />
            <TextInput
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={signIn} />
        </View>
    );
}