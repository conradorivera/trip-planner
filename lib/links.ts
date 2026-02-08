import { supabase } from "@/lib/supabase";

export async function addLink(
    tripId: string,
    url: string,
    description?: string
) {
    const platform = url.includes('instagram')
        ? 'instagram'
        : 'web';

    const { error } = await supabase.from('trip_links').insert({
        trip_id: tripId,
        url,
        description,
        platform,
    });

    if (error) throw error;
}
