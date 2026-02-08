import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {PrimaryButton} from "@/components/PrimaryButton";

export default function AddLink() {
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const router = useRouter();

    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');

    async function saveLink() {
        if (!url) {
            Alert.alert('Please enter a URL');
            return;
        }

        const platform = url.includes('instagram')
            ? 'instagram'
            : url.includes('tiktok')
                ? 'tiktok'
                : 'web';

        const { error } = await supabase.from('trip_links').insert({
            trip_id: tripId,
            url,
            description,
            platform,
        });

        if (error) {
            Alert.alert(error.message);
            return;
        }

        router.back();
    }

    return (
        <View className="p-5" style={{ backgroundColor: '#fff' }}>
            <Text className="text-2xl font-bold mb-4">Add link</Text>
            <Text className="text-gray-400 mb-2">
                Instagram, TikTok, Maps, articles…
            </Text>
            <TextInput
                autoFocus
                keyboardType="url"
                autoCapitalize="none"
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3"
                value={url}
                onChangeText={setUrl}
            />

            <TextInput
                className="border border-gray-200 rounded-xl p-3 h-24 mb-4"
                placeholder="Why is this saved?"
                multiline
                value={description}
                onChangeText={setDescription}
            />

            <PrimaryButton title="Save link" onPress={saveLink} />
        </View>
    );
}
