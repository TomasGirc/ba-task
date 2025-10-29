import { render, screen, fireEvent } from "@testing-library/react";
import LanguageToggle from "@/components/languageSelect";
import { useLanguage } from "@/providers/languageProviders";

jest.mock("@/providers/languageProviders", () => ({
  useLanguage: jest.fn(),
}));

describe("LanguageToggle", () => {
  it("renders initial language and toggles", () => {
    const setLanguage = jest.fn();
    (useLanguage as jest.Mock).mockReturnValue({ language: "en", setLanguage });

    render(<LanguageToggle />);
    expect(screen.getByText("EN")).toBeInTheDocument();

    fireEvent.click(screen.getByText("EN"));
    expect(setLanguage).toHaveBeenCalledWith("lt");
  });
});
