import { useEffect, useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useWatch } from "react-hook-form";
import validateIban, { payerAccounts } from "@/utils/payerAccounts";
import { Account, PayerFieldProps } from "@/entities/types";
import { Box, TextField, Typography } from "@mui/material";
import { testIban } from "@/api/iban";
import { formatNumber } from "@/utils/formatNumbers";
import { useLanguage } from "@/providers/languageProviders";

export default function PayerField({
  name,
  label,
  control,
  register,
  errors,
}: PayerFieldProps) {
  const queryClient = useQueryClient();
  const { language, translations } = useLanguage();
  const [status, setStatus] = useState<{
    message: string;
    valid: boolean;
  } | null>(null);

  const accountValue = useWatch({
    control,
    name,
  }) as string | undefined;

  const { data: selectedAccount } = useQuery<Account | null>({
    queryKey: ["selectedPayerAccount"],
    queryFn: () => null,
    initialData: null,
  });

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

        if (!errors[name] && accountValue) {
          const account =
            payerAccounts.find((acc) => acc.iban === accountValue) || null;
          if (account !== selectedAccount) {
            queryClient.setQueryData(["selectedPayerAccount"], account);
          }
        } else {
          if (selectedAccount !== null) {
            queryClient.setQueryData(["selectedPayerAccount"], null);
          }
        }
      } catch (error) {
        setStatus({
          message: `${translations.error.validationFailed}`,
          valid: false,
        });
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [accountValue, errors, name, queryClient, selectedAccount, translations]);

  return (
    <>
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
      {selectedAccount && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            mb: 1,
            borderRadius: 1,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="medium"
            color="text.secondary"
          >
            {translations.form.balance}:
          </Typography>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color={selectedAccount.balance < 0 ? "error.main" : "primary.main"}
          >
            {formatNumber(selectedAccount.balance, language)}
          </Typography>
        </Box>
      )}
    </>
  );
}
