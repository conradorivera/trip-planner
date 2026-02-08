import {FlatList, Linking, Platform, Pressable, Text, View} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useState} from 'react';
import {supabase} from '@/lib/supabase';
import {useFocusEffect} from '@react-navigation/native';
import {Card} from "@/components/Card";
import {PlatformIcon} from "@/components/PlatformIcon";
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming} from 'react-native-reanimated';
import DraggableFlatList, {RenderItemParams,} from "react-native-draggable-flatlist";
import {FontAwesome} from "@expo/vector-icons";

export default function TripDetail() {
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const router = useRouter();

    const [trip, setTrip] = useState<any>(null);
    const [links, setLinks] = useState<any[]>([]);

    async function loadData() {
        const { data: tripData } = await supabase
            .from('trips')
            .select('*')
            .eq('id', tripId)
            .single();

        const { data: linksData } = await supabase
            .from("trip_links")
            .select("*")
            .eq("trip_id", tripId)
            .order("order_index", { ascending: true });

        setTrip(tripData);
        setLinks(linksData || []);
    }

    function SwipeableRow({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
        const translateX = useSharedValue(0);
        const deleteThreshold = -100;
        const buttonWidth = 80;

        const panGesture = Gesture.Pan()
            .onUpdate((event) => {
                translateX.value = Math.max(event.translationX, deleteThreshold);
            })
            .onEnd((event) => {
                const shouldDelete = event.translationX < deleteThreshold;
                if (shouldDelete) {
                    translateX.value = withTiming(-buttonWidth, { duration: 200 });
                    runOnJS(onDelete)();
                } else {
                    translateX.value = withSpring(0);
                }
            });

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ translateX: translateX.value }],
        }));

        const deleteButtonStyle = useAnimatedStyle(() => ({
            opacity: Math.abs(translateX.value) > 20 ? 1 : 0,
        }));

        return (
            <View className="relative">
                <Animated.View
                    style={[deleteButtonStyle]}
                    className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 justify-center items-center rounded-2xl"
                >
                    <Pressable onPress={onDelete} className="flex-1 justify-center items-center">
                        <Text className="text-white font-semibold">Delete</Text>
                    </Pressable>
                </Animated.View>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[animatedStyle]}>
                        {children}
                    </Animated.View>
                </GestureDetector>
            </View>
        );
    }

    async function deleteLink(id: string) {
        await supabase.from('trip_links').delete().eq('id', id);
        loadData();
    }

    async function saveNewOrder(updatedLinks: any[]) {
        const updates = updatedLinks.map((link, index) => ({
            id: link.id,
            order_index: index,
        }));

        const { error } = await supabase
            .from("trip_links")
            .upsert(updates);

        if (error) {
            console.error("Order update failed:", error.message);
        }
    }


    useFocusEffect(() => {
        loadData();
    });

    if (!trip) return <Text>Loading...</Text>;

    return (
        <View className="flex-1 p-4" style={{ backgroundColor: '#fff' }}>
            <Text className="text-3xl font-bold">{trip.title}</Text>
            {trip.description && (
                <Text className="text-gray-500 mt-2">
                    {trip.description}
                </Text>
            )}

            <View className="mt-4">
                <Pressable
                    onPress={() => router.push(`/modals/add-link?tripId=${tripId}`)}
                    className="absolute bottom-6 right-6 bg-black dark:bg-white p-4 rounded-full shadow-lg"
                >
                    <Text className="text-white dark:text-black text-xl">＋</Text>
                </Pressable>
            </View>

            { Platform.OS !== "web" &&
                <DraggableFlatList
                    data={links}
                    keyExtractor={(item) => item.id}
                    onDragEnd={({ data }) => {
                        setLinks(data);
                        saveNewOrder(data);
                    }}
                    renderItem={({ item, drag, isActive }: RenderItemParams<any>) => (
                        <Pressable
                            onLongPress={drag}
                            disabled={isActive}
                            className="mb-3"
                        >
                            <Card>
                                <View className="flex-row items-center gap-3">
                                    <FontAwesome name="bars" size={18} color="gray" />
                                    <View className="flex-1">
                                        <Text numberOfLines={1} className="font-semibold">
                                            {item.url}
                                        </Text>
                                        {item.description && (
                                            <Text className="text-gray-500 mt-1">
                                                {item.description}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </Card>
                        </Pressable>
                    )}
                />
            }
            { Platform.OS === "web" &&
                <FlatList
                    className="mt-6"
                    data={links}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={
                        <Text className="text-gray-400 text-center mt-10">
                            No links yet 🔗
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <SwipeableRow onDelete={() => deleteLink(item.id)}>
                            <Pressable
                                onPress={() => Linking.openURL(item.url)}
                                className="active:scale-[0.98]"
                            >
                                <Card>
                                    <View className="flex-row items-center gap-3">
                                        <PlatformIcon platform={item.platform} />
                                        <View className="flex-1">
                                            <Text
                                                numberOfLines={1}
                                                className="font-semibold text-black dark:text-white"
                                            >
                                                {item.url}
                                            </Text>
                                            {item.description && (
                                                <Text className="text-gray-500 dark:text-gray-400 mt-1">
                                                    {item.description}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </Card>
                            </Pressable>
                        </SwipeableRow>
                    )}
                />
            }
        </View>
    );
}
