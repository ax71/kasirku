import { getProfile } from "../services/get-profile";
import { useQuery } from "@tanstack/react-query";

export const profileKeys = {
  all: ["profile"] as const,
};

export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: getProfile,
  });
};
