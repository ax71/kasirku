import { getProfile } from "../services/get-profile";
import { useQuery } from "@tanstack/react-query";
import type { Profile } from "../types";

export const profileKeys = {
  all: ["profile"] as const,
};

export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: async () => {
      const data = await getProfile();
      return data as Profile | null;
    },
  });
};
