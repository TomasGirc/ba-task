import { z } from "zod";
import validateIban from "@/utils/payerAccounts";
import { formatNumber } from "@/utils/formatNumbers";
import { Translations } from "@/entities/types";

export const formSchema = (
  balance: number,
  language: string,
  translations: Translations
) => {
  const formattedBalance = formatNumber(balance, language);
  const amountSchema =
    balance < 0
      ? z.number().refine(() => false, {
          message: `${translations.error.cannotTransferNegativeBalance}: ${formattedBalance}`,
        })
      : z
          .number()
          .min(0.01, `${translations.error.minAmount}`)
          .max(balance, `${translations.error.maxAmount}`);

  return z.object({
    amount: amountSchema,
    payeeAccount: z
      .string()
      .min(1, `${translations.error.accountIsRequired}`)
      .refine((value) => validateIban(value), {
        message: `${translations.error.invalidIbanFormat}`,
      }),
    purpose: z
      .string()
      .min(3, `${translations.error.purposeTooShort}`)
      .max(135, `${translations.error.purposeTooLong}`),
    payerAccount: z
      .string()
      .min(1, `${translations.error.accountIsRequired}`)
      .refine((value) => validateIban(value), {
        message: `${translations.error.invalidIbanFormat}`,
      }),
    payee: z
      .string()
      .min(1, `${translations.error.payeeIsRequired}`)
      .max(70, `${translations.error.payeeTooLong}`),
  });
};

export type FormData = z.infer<ReturnType<typeof formSchema>>;
