import { fireEvent, render, screen } from "@testing-library/react-native";
import { SiteFooter } from "../src/components/site-footer";
import { SiteMenuButton } from "../src/components/site-menu";
import { CONTACT_EMAIL } from "../src/navigation/site-links";

jest.mock("react-native-reanimated", () => ({ useReducedMotion: () => false }));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe("site footer", () => {
  it("shows Contact and the address, and no signed-in links, when signed out", async () => {
    await render(<SiteFooter />);

    expect(screen.getByText("Take part")).toBeTruthy();
    expect(screen.getByText("Contact")).toBeTruthy();
    expect(screen.getByText(CONTACT_EMAIL)).toBeTruthy();
    expect(screen.queryByText("Support")).toBeNull();
  });

  it("hides groups with nothing published", async () => {
    await render(<SiteFooter />);

    expect(screen.queryByText("The possibilities")).toBeNull();
  });
});

describe("site menu", () => {
  it("announces collapsed, then opens with the same links", async () => {
    await render(<SiteMenuButton />);
    const button = screen.getByRole("button", { name: "Menu" });
    expect(button.props.accessibilityState).toMatchObject({ expanded: false });

    await fireEvent.press(button);

    expect(
      screen.getByRole("button", { name: "Menu" }).props.accessibilityState,
    ).toMatchObject({ expanded: true });
    expect(screen.getByText("Contact")).toBeTruthy();
    expect(screen.getByText(CONTACT_EMAIL)).toBeTruthy();
  });

  it("closes from the close button", async () => {
    await render(<SiteMenuButton />);
    await fireEvent.press(screen.getByRole("button", { name: "Menu" }));

    await fireEvent.press(screen.getAllByLabelText("Close menu").at(-1)!);

    expect(
      screen.getByRole("button", { name: "Menu" }).props.accessibilityState,
    ).toMatchObject({ expanded: false });
  });
});
