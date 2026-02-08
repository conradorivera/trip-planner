import { View } from 'react-native';

export function Card({ children }: { children: React.ReactNode }) {
    return (
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-3">
            {children}
        </View>
    );
}