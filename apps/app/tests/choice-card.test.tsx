import { fireEvent, render, screen } from "@testing-library/react-native";
import { ChoiceCard } from "../src/components/choice-card";

describe("ChoiceCard", () => {
  it("shows the choice and its description", async () => {
    await render(
      <ChoiceCard
        title="Procrastination"
        description="I put things off."
        selected={false}
        onPress={() => {}}
      />,
    );

    expect(screen.getByText("Procrastination")).toBeTruthy();
    expect(screen.getByText("I put things off.")).toBeTruthy();
  });

  it("reports a press to the parent", async () => {
    const onPress = jest.fn();
    await render(
      <ChoiceCard
        title="Procrastination"
        description="I put things off."
        selected={false}
        onPress={onPress}
      />,
    );

    fireEvent.press(screen.getByRole("checkbox"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
