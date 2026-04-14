import supabase from "@/lib/supabase";

/**
 * Menghapus file dari Supabase Storage berdasarkan URL
 * @param url URL lengkap dari file yang ingin dihapus
 */
export async function deleteFile(url: string) {
  try {
    if (!url) return { status: "success" };

    const getPathFromUrl = (url: string) => {
      const parts = url.split("/storage/v1/object/public/images/");
      if (parts.length <= 1) return null;
      return decodeURIComponent(parts[1]);
    };

    const path = getPathFromUrl(url);

    if (!path) {
      console.warn("Could not extract path from URL:", url);
      return { status: "error", message: "Invalid URL format" };
    }

    const { data, error } = await supabase.storage
      .from("images")
      .remove([path]);

    if (error) throw error;

    return { status: "success", data };
  } catch (error: any) {
    console.error("Delete File Error:", error.message);
    return { status: "error", message: error.message };
  }
}
