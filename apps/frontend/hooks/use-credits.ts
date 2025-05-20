import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface CreditsData {
  available: number;
  pending: number;
  total: number;
}

export function useCredits() {
  const queryClient = useQueryClient();
  const query = useQuery<CreditsData>({
    queryKey: ["user-credits"],
    queryFn: async () => {
      const res = await fetch("/api/user-credits");
      if (!res.ok) throw new Error("Failed to fetch credits");
      return res.json();
    }
  });

  const invalidateCredits = () => queryClient.invalidateQueries({ queryKey: ["user-credits"] });
  
  return { ...query, invalidateCredits };
}
