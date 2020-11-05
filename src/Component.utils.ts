import { toMatchImageSnapshot } from "jest-image-snapshot";
import AfixRangeSlider from "./Component";

// assert - a function to ensure sanity of variables and type safety
export function assert(
  condition: boolean,
  errorMessage = "Assertion Error"
): asserts condition {
  if (!condition) {
    throw new Error(errorMessage);
  }
}

// bindAttributes - ensures that the target's instance value and the attribute value are the same
export const bindAttributes = (
  target: HTMLElement,
  names: string[],
  defaults: Record<string, string> = {}
) => {
  for (const name of names) {
    Object.defineProperty(target, toCamelCase(name), {
      get() {
        const value = target.getAttribute(name);
        return value === null ? defaults[name] : value;
      },
      set(value) {
        target.setAttribute(name, value);
      },
    });
  }
};

// toCamelCase - converts a string to lower camel case.
// e.g. "kebab-case-string", "Just a regular string") to "camelCaseStrings
export const toCamelCase = (value: string) =>
  (
    value.charAt(0).toLowerCase() +
    value.slice(1).replace(/([ -][a-z0-9])/g, (v) => v[1].toUpperCase())
  ).replace(/[^a-z0-9]+/gi, "");

// getFractionDigits - returns the number of fraction digits based on the value
// e.g. when n = "1", the digits are 0. When n = "1.33", the digits are 2.
export const getFractionDigits = (n: string) =>
  (n || "1").replace(".", "").length - 1;

// minmax - bounds a number between a minimum and maxium value
export const minmax = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, n));
