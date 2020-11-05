import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

describe("input", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:8833/events.html");
  });

  test("mouse input - vertical slider", async () => {
    const { x, y, width, height } = (await (await page.$('afix-range-slider'))!.boundingBox())!;
    
    expect(await page.$eval('afix-range-slider', (el: HTMLInputElement) => el.value)).toBe("100");

    await page.mouse.move(x + width / 2, y + 1);
    await page.mouse.down({ button: 'left' });
    await page.mouse.move(x + width / 2, y + 1 + height / 2);
    await page.mouse.up();

    expect(
      await page.$eval("afix-range-slider", (el: HTMLInputElement) => el.value)
    ).toBe("50");
  });

  test("mouse input - horizontal slider", async () => {
    await page.$eval('afix-range-slider', el => el.setAttribute('horizontal', ''))

    const { x, y, width, height } = (await (await page.$(
      "afix-range-slider"
    ))!.boundingBox())!;

    expect(
      await page.$eval("afix-range-slider", (el: HTMLInputElement) => el.value)
    ).toBe("100");

    await page.mouse.move(x + width - 1, y + 1);
    await page.mouse.down({ button: "left" });
    await page.mouse.move(x - 1 + width / 2, y + 1);
    await page.mouse.up();

    expect(
      await page.$eval("afix-range-slider", (el: HTMLInputElement) => el.value)
    ).toBe("50");
  });
});
