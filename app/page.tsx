"use client";

import { useLanguage } from "@/providers/languageProviders";
import TransferForm from "@/components/forms/TransferForm";

export default function Home() {
  const { translations } = useLanguage();

  return (
    <>
      <h1>{translations.form.title}</h1>

      <TransferForm />
    </>
  );
}
