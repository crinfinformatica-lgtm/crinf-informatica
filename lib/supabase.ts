
import { createClient } from '@supabase/supabase-js';

// Conexão oficial do projeto CRINF Informática
// Certifique-se de que não há espaços sobrando antes ou depois das aspas
const supabaseUrl = 'https://nmonycyhsbosimjicojj.supabase.co';
const supabaseAnonKey = 'sb_publishable_J1ncHu4WJ-KACiLxyDLA0Q_08DbGiJB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função auxiliar para enviar imagens para o Storage
export const uploadImage = async (file: File, bucket: string = 'crinf-images') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Erro no upload:", error);
    // Fallback: Retorna base64 se o storage não estiver configurado corretamente
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
};
