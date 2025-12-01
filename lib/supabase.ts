import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables!');
    console.error('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Disable for PWA compatibility
        flowType: 'pkce',
        storage: window.localStorage,
    },
});

// Helper function to get current user
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Error getting user:', error);
        return null;
    }
    return user;
};

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error getting profile:', error);
        return null;
    }
    return data;
};

// Upload ID card image to Supabase Storage
export const uploadIdCard = async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/id-card.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('id-cards')
        .upload(fileName, file, {
            upsert: true,
            cacheControl: '3600'
        });

    if (error) {
        console.error('Error uploading ID card:', error);
        return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('id-cards')
        .getPublicUrl(fileName);

    return publicUrl;
};

// Upload QR code image to Supabase Storage
export const uploadQRCode = async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/qr-code.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('id-cards')
        .upload(fileName, file, {
            upsert: true,
            cacheControl: '3600'
        });

    if (error) {
        console.error('Error uploading QR code:', error);
        return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('id-cards')
        .getPublicUrl(fileName);

    return publicUrl;
};

// Update user profile with ID card and QR code URLs
export const updateProfileImages = async (
    userId: string,
    idCardUrl?: string,
    qrCodeUrl?: string
) => {
    const updates: any = { updated_at: new Date().toISOString() };

    if (idCardUrl) updates.id_card_url = idCardUrl;
    if (qrCodeUrl) updates.qr_code_url = qrCodeUrl;

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error);
        return null;
    }

    return data;
};
