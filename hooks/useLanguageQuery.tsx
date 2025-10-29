import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { en } from "../locales/en";
import { lt } from "../locales/lt";

const LANGUAGE_KEY = "language";

export function useLanguageQuery() {
  const queryClient = useQueryClient();

  const { data: language = "en" } = useQuery({
    queryKey: [LANGUAGE_KEY],
    queryFn: () => localStorage.getItem(LANGUAGE_KEY) || "en",
  });

  const { data: translations = en } = useQuery({
    queryKey: [LANGUAGE_KEY, language],
    queryFn: () => (language === "en" ? en : lt),
  });

  const { mutate: setLanguage } = useMutation({
    mutationFn: (newLanguage: string) => {
      localStorage.setItem(LANGUAGE_KEY, newLanguage);
      return newLanguage;
    },
    onSuccess: (newLanguage) => {
      queryClient.invalidateQueries({ queryKey: [LANGUAGE_KEY] });
    },
  });

  return {
    language,
    translations,
    setLanguage,
  };
}
