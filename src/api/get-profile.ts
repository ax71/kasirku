import supabase from "@/lib/supabase";

export const getProfile = async () => {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  return data;
};
