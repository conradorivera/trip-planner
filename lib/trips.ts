import { supabase } from "@/lib/supabase";

export async function getTrips(userId: string) {
    const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function createTrip(title: string, description?: string) {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    console.log('USER', user, title, description);

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('trips').insert({
        title,
        description,
        user_id: user.id,
    });

    if (error) throw error;
}