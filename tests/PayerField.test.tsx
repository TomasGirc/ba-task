import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { useForm } from "react-hook-form";
import PayerField from "@/components/forms/PayerField";
import { useLanguage } from "@/providers/languageProviders";
import { testIban } from "@/api/iban";
import validateIban from "@/utils/payerAccounts";
import * as reactHookForm from "react-hook-form";

jest.mock("@/providers/languageProviders", () => ({
  useLanguage: jest.fn(),
}));

jest.mock("@/api/iban", () => ({
  testIban: jest.fn(),
}));

jest.mock("@/utils/payerAccounts", () => ({
  __esModule: true,
  default: jest.fn(),
  payerAccounts: [{ iban: "VALID_IBAN", balance: 100 }],
}));

const setQueryDataMock = jest.fn();
let useQueryMockReturn: any = { data: null };

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: () => ({ setQueryData: setQueryDataMock }),
  useQuery: () => useQueryMockReturn,
}));

jest.mock("react-hook-form", () => {
  const original = jest.requireActual("react-hook-form");
  return {
    ...original,
    useWatch: jest.fn().mockReturnValue(""),
  };
});

describe("PayerField", () => {
  beforeEach(() => {
    (useLanguage as jest.Mock).mockReturnValue({
      language: "en",
      translations: {
        form: { balance: "Balance" },
        error: { validationFailed: "Validation failed" },
      },
    });

    (validateIban as jest.Mock).mockReturnValue(true);
    (testIban as jest.Mock).mockResolvedValue({ valid: true });

    setQueryDataMock.mockClear();
    useQueryMockReturn = { data: null };
  });

  function renderWithForm() {
    const Wrapper = () => {
      const { control, register, formState } = useForm<{
        payerAccount: string;
      }>({ defaultValues: { payerAccount: "" } });

      return (
        <PayerField
          name="payerAccount"
          label="Payer Account"
          control={control}
          register={register}
          errors={formState.errors}
        />
      );
    };

    return render(<Wrapper />);
  }

  it("renders label and text field", () => {
    renderWithForm();
    expect(screen.getByLabelText("Payer Account")).toBeInTheDocument();
  });

  it("shows valid IBAN status message after API call", async () => {
    (reactHookForm.useWatch as jest.Mock).mockReturnValue("VALID_IBAN");

    jest.useFakeTimers();
    renderWithForm();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("Valid IBAN"))
      ).toBeInTheDocument();
    });

    expect(setQueryDataMock).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("shows error if IBAN is invalid", async () => {
    (validateIban as jest.Mock).mockReturnValue(false);
    (reactHookForm.useWatch as jest.Mock).mockReturnValue("INVALID_IBAN");

    jest.useFakeTimers();
    renderWithForm();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("IBAN not valid"))
      ).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it("displays selected account balance", async () => {
    useQueryMockReturn = { data: { iban: "VALID_IBAN", balance: 200 } };
    (reactHookForm.useWatch as jest.Mock).mockReturnValue("VALID_IBAN");

    renderWithForm();

    await waitFor(() => {
      expect(screen.getByText(/Balance/)).toBeInTheDocument();
      expect(screen.getByText(/200/)).toBeInTheDocument();
    });
  });

  it("shows red color for negative balance", async () => {
    useQueryMockReturn = { data: { iban: "VALID_IBAN", balance: -50 } };
    (reactHookForm.useWatch as jest.Mock).mockReturnValue("VALID_IBAN");

    renderWithForm();

    await waitFor(() => {
      const balanceEl = screen.getByText(/-50/);
      expect(balanceEl).toBeInTheDocument();
      expect(balanceEl).toHaveStyle("color: #d32f2f");
    });
  });
});
