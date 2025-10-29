"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormData } from "@/schema/formSchema";
import PayerField from "./PayerField";
import AccountField from "./AccountField";
import { useQuery } from "@tanstack/react-query";
import { Account } from "@/entities/types";
import { Box, TextField, Button } from "@mui/material";
import { useLanguage } from "@/providers/languageProviders";

export default function TransferForm() {
  const { translations, language } = useLanguage();
  const { data: selectedAccount } = useQuery<Account | null>({
    queryKey: ["selectedPayerAccount"],
    queryFn: () => null,
    initialData: null,
  });

  const balance = selectedAccount?.balance || 0;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema(balance, language, translations)),
    mode: "onChange",
  });

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    setSubmitted(true);
    reset(data);
  };

  const hasChangesAfterSubmit =
    submitted && Object.keys(dirtyFields).length > 0;

  if (hasChangesAfterSubmit) {
    setSubmitted(false);
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: 400 }}
    >
      <PayerField
        name="payerAccount"
        label={translations.form.payerAccount + " *"}
        control={control}
        register={register}
        errors={errors}
      />

      <TextField
        label={translations.form.payee + " *"}
        error={!!errors.payee}
        helperText={errors.payee?.message}
        {...register("payee")}
      />

      <AccountField
        name="payeeAccount"
        label={translations.form.payeeAccount + " *"}
        control={control}
        register={register}
        errors={errors}
      />

      <TextField
        label={translations.form.amount}
        type="number"
        error={!!errors.amount}
        helperText={errors.amount?.message}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            inputProps: { min: 0 },
            onKeyDown: (e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            },
          },
        }}
        {...register("amount", {
          setValueAs: (v) => (v === "" ? 0 : parseFloat(v)),
        })}
      />

      <TextField
        label={translations.form.purpose + " *"}
        error={!!errors.purpose}
        helperText={errors.purpose?.message}
        {...register("purpose")}
      />

      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: submitted ? "success.main" : "primary.main",
          "&:hover": {
            backgroundColor: submitted ? "success.dark" : "primary.dark",
          },
        }}
      >
        {submitted ? translations.form.submitted : translations.form.submit}{" "}
        {submitted && "✓"}
      </Button>
    </Box>
  );
}
