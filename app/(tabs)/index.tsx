import { View, Text, Button, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { createTrip } from '@/lib/trips';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { useAuth } from "@/lib/AuthProvider";
import {LogoutButton} from "@/components/LogoutButton";

export default function Trips() {
  const [trips, setTrips] = useState<any[]>([]);
  const { session, loading } = useAuth();
  const router = useRouter();

  async function loadTrips() {
    const { data } = await supabase.from('trips').select('*');
    setTrips(data || []);
  }

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/(auth)/login");
    } else {
      loadTrips();
    }
  }, [loading, session]);

  if (loading) {
    return (
        <View className="flex-1 justify-center items-center">
          <Text>Loading...</Text>
        </View>
    );
  }

  if (!session) return null;

  return (
      <View style={{ padding: 20 }}>
        <Text className="text-xl font-bold">My Trips</Text>
        <LogoutButton />
        {trips.length === 0 && (
          <Text className="text-gray-400 mt-10 text-center">
            No trips yet ✈️
          </Text>
        )}



        {trips.map(trip => (
            <Pressable
                key={trip.id}
                onPress={() => router.push(`/trip/${trip.id}`)}
            >
              <Card>
                <Text className="text-lg font-semibold">{trip.title}</Text>
                {trip.description && (
                    <Text className="text-gray-500 mt-1">
                      {trip.description}
                    </Text>
                )}
              </Card>
            </Pressable>
        ))}
      </View>
  );
}