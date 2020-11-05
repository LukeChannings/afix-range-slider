import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

describe("value label test", () => {
  const screenshotOptions = {
    noColors: true,
    customSnapshotIdentifier: ({
      defaultIdentifier,
    }: {
      defaultIdentifier: string;
    }) => `${browserName}-${defaultIdentifier}`,
  };

  beforeEach(async () => {
    await page.goto("http://localhost:8833/value-label.html");
  });

  it("updates the label for the range input", async () => {
    const { x, y, width, height } = (await (await page.$(
      "afix-range-slider"
    ))!.boundingBox())!;

    expect(
      await page.$eval("afix-range-slider", (el: HTMLInputElement) => el.value)
    ).toBe("60");

    await page.mouse.move(x + width / 2, y + 1);
    await page.mouse.down({ button: "left" });
    await page.mouse.move(x + width / 2, y + 1 + height / 2);
    await page.mouse.up();

    expect(
      await page.$eval("afix-range-slider", (el: HTMLInputElement) => el.value)
    ).toBe("0");

    expect(await page.$eval("#value", (el: HTMLInputElement) => el.innerHTML)).toBe(
      "0"
    );
  });
});
