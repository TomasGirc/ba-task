import { useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useWatch } from "react-hook-form";
import { payerAccounts } from "@/utils/payerAccounts";
import { Account, PayerFieldProps } from "@/entities/types";
import { Box, TextField, Typography, MenuItem } from "@mui/material";
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
  const { language } = useLanguage();

  const defaultAccount = payerAccounts[0];
  const defaultIban = defaultAccount?.iban ?? "";

  const accountValue = (useWatch({ control, name }) as string) ?? defaultIban;

  const { data: selectedAccount } = useQuery<Account | null>({
    queryKey: ["selectedPayerAccount"],
    queryFn: async () => defaultAccount ?? null,
    initialData: defaultAccount ?? null,
  });

  useEffect(() => {
    const account =
      payerAccounts.find((acc) => acc.iban === accountValue) || null;
    queryClient.setQueryData(["selectedPayerAccount"], account);
  }, [accountValue, queryClient]);

  return (
    <Box sx={{ mb: 2, position: "relative" }}>
      <TextField
        id={name}
        select
        label={label}
        fullWidth
        error={!!errors[name]}
        helperText={errors[name]?.message?.toString()}
        value={accountValue}
        {...register(name)}
      >
        {payerAccounts.map((account) => (
          <MenuItem key={account.id} value={account.iban}>
            {account.iban}
          </MenuItem>
        ))}
      </TextField>

      {selectedAccount && (
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: selectedAccount.balance >= 0 ? "success.main" : "error.main",
            backgroundColor: (theme) => theme.palette.background.paper,
            px: 0.5,
            maxWidth: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "right",
          }}
        >
          {formatNumber(selectedAccount.balance, language)}
        </Typography>
      )}
    </Box>
  );
}
