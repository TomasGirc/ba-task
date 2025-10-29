import { ibanApiUrl } from "@/constants/requestInfo";
import { ibanValidationType } from "@/entities/types";

export const testIban = async (iban: string): Promise<ibanValidationType> => {
  const response = await fetch(ibanApiUrl + iban, {
    method: "GET",
  });
  return await response.json();
};
