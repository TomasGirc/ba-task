"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { en } from "../locales/en";
import { lt } from "../locales/lt";
import { Translations } from "@/entities/types";

type LanguageContextType = {
  language: string;
  translations: Translations;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const getInitialLanguage = () => {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem("language") || "en";
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  const initialLang = getInitialLanguage();

  const { data: language = initialLang } = useQuery({
    queryKey: ["language"],
    queryFn: () => initialLang,
    initialData: initialLang,
  });

  const { data: translations = language === "en" ? en : lt } = useQuery({
    queryKey: ["translations", language],
    queryFn: () => (language === "en" ? en : lt),
    initialData: language === "en" ? en : lt,
  });

  const setLanguage = (newLang: string) => {
    localStorage.setItem("language", newLang);
    queryClient.setQueryData(["language"], newLang);
  };

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
