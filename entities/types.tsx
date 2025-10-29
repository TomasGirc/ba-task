import { en } from "@/locales/en";
import { lt } from "@/locales/lt";
import { FormData } from "@/schema/formSchema";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export type ibanValidationType = {
  iban: string;
  valid: boolean;
};

export interface Account {
  iban: string;
  name: string;
  balance: number;
}

export interface PayerFieldProps {
  name: keyof FormData;
  label: string;
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export type Translations = typeof en | typeof lt;

export type Language = "en" | "lt";
