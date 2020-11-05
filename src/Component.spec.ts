import pkg from "../package.json";
import { AfixRangeSlider } from "./Component";
import { assert } from "./Component.utils";

describe("afix-range-slider", () => {
  it("registers a component named the same as that package's name", () => {
    expect(customElements.get(pkg.name)).toBe(AfixRangeSlider);
  });

  describe("keyboard events", () => {
    it("handles ArrowRight", () => {
      const slider = new AfixRangeSlider();
      slider.value = "50";
      slider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
        })
      );
      expect(slider.value).toBe("51");
    });

    it("handles shift-ArrowRight", () => {
      const slider = new AfixRangeSlider();
      slider.value = "50";
      slider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          shiftKey: true,
        })
      );
      expect(slider.value).toBe("60");
    });

    it("handles ArrowLeft", () => {
      const slider = new AfixRangeSlider();
      slider.value = "50";
      slider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowLeft",
        })
      );
      expect(slider.value).toBe("49");
    });

    it("handles shift-ArrowLeft", () => {
      const slider = new AfixRangeSlider();
      slider.value = "50";
      slider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowLeft",
          shiftKey: true,
        })
      );
      expect(slider.value).toBe("40");
    });

    it("handles Home", () => {
      const slider = new AfixRangeSlider();
      slider.value = "50";
      slider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Home",
          shiftKey: true,
        })
      );
      expect(slider.value).toBe("0");
    });

    it("handles End", () => {
      const slider = new AfixRangeSlider();
      slider.value = "50";
      slider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "End",
          shiftKey: true,
        })
      );
      expect(slider.value).toBe("100");
    });
  });
});
