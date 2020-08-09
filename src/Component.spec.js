import pkg from "../package.json";
import Component from "./Component.js";

describe("Component", () => {
  it("registers a component named the same as that package's name", () => {
    expect(customElements.get(pkg.name)).toBe(Component);
  });
});
