import { Pressable, Text } from 'react-native';

export function PrimaryButton({
                                  title,
                                  onPress,
                              }: {
    title: string;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            className="bg-black rounded-full py-3 px-5 items-center"
        >
            <Text className="text-white font-semibold">{title}</Text>
        </Pressable>
    );
}
