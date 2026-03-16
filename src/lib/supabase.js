import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variables Supabase manquantes dans .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload une image vers Supabase Storage
 * @param {File} file - Le fichier à uploader
 * @param {string} folder - Dossier dans le bucket (ex: 'products')
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadImage(file, folder = 'products') {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) throw new Error(`Upload échoué : ${error.message}`);

    const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

    return { url: publicUrl, path: data.path };
}

/**
 * Supprime une image du bucket Supabase
 * @param {string} path - Le chemin du fichier dans le bucket
 */
export async function deleteImage(path) {
    const { error } = await supabase.storage
        .from('product-images')
        .remove([path]);

    if (error) throw new Error(`Suppression échouée : ${error.message}`);
}
