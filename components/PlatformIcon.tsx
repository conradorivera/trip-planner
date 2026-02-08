import { FontAwesome } from '@expo/vector-icons';

export function PlatformIcon({ platform }: { platform: string }) {
    const icon =
        platform === 'instagram'
            ? 'instagram'
            : platform === 'tiktok'
                ? 'music'
                : 'link';

    return <FontAwesome name={icon} size={18} />;
}