"use client";

import { useEffect, useState } from "react";
import {
  UseFormRegister,
  Control,
  FieldErrors,
  useWatch,
} from "react-hook-form";
import validateIban from "@/utils/payerAccounts";
import { testIban } from "@/api/iban";
import { FormData } from "@/schema/formSchema";
import { useQueryClient } from "@tanstack/react-query";
import { Box, TextField, Typography } from "@mui/material";

interface AccountFieldProps {
  name: keyof FormData;
  label: string;
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export default function AccountField({
  name,
  label,
  control,
  register,
  errors,
}: AccountFieldProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<{
    message: string;
    valid: boolean;
  } | null>(null);
  const accountValue = String(useWatch({ name, control }) ?? "");

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!accountValue) {
        setStatus({ message: "", valid: false });
        return;
      }
      if (!validateIban(accountValue)) {
        setStatus({ message: "IBAN not valid", valid: false });
        return;
      }

      try {
        const response = await testIban(accountValue);
        setStatus({
          message: response.valid ? "Valid IBAN" : "IBAN not found",
          valid: response.valid,
        });
      } catch (err) {
        console.error(`Error validating ${name} IBAN:`, err);
        setStatus({ message: "Validation failed", valid: false });
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [accountValue, name, queryClient]);

  return (
    <Box
      sx={{
        mb: 2,
        position: "relative",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: status?.valid ? "success.main" : undefined,
          },
          "&:hover fieldset": {
            borderColor: status?.valid ? "success.dark" : undefined,
          },
          "&.Mui-focused fieldset": {
            borderColor: status?.valid ? "success.main" : undefined,
          },
          "& input": {
            pr: "120px", // 🧩 reserve space for the status message
          },
        },
        "& .MuiInputLabel-root": {
          color: status?.valid ? "success.main" : undefined,
        },
      }}
    >
      <TextField
        id={name}
        label={label}
        fullWidth
        error={!!errors[name]}
        helperText={errors[name]?.message?.toString()}
        {...register(name)}
      />

      {status?.message && (
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            color: status.valid ? "success.main" : "error.main",
            pointerEvents: "none",
            backgroundColor: (theme) => theme.palette.background.paper,
            px: 0.5,
            maxWidth: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "right",
          }}
        >
          {status.message}
        </Typography>
      )}
    </Box>
  );
}
