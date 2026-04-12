import supabase from "@/lib/supabase";

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  prevState?: string,
) {
  const newPath = `${path}/${Date.now()}-${file.name}`;

  if (prevState) {
    const { error: removeError } = await supabase.storage
      .from(bucket)
      .remove([prevState]);

    if (removeError) {
      return {
        status: "error",
        errors: {
          _form: [removeError.message],
        },
      };
    }
  }

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(newPath, file);

  if (uploadError) {
    return {
      status: "error",
      errors: {
        _form: [uploadError.message],
      },
    };
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  return {
    status: "success",
    data: {
      url: `${supabaseUrl}/storage/v1/object/public/${bucket}/${newPath}`,
      path: newPath,
    },
  };
}
