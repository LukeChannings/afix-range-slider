import { assert, bindAttributes, getFractionDigits, minmax, toCamelCase } from "./Component.utils";

describe('util', () => {
  describe('assert', () => {
    it('throws with false', () => {
      expect(() => assert(false)).toThrow();
    })

    it('does not throw with true', () => {
      expect(() => assert(true)).not.toThrow();
    })
  });

  describe('bindAttributes', () => {
    it("binds an element's instance property to an attribute value", () => {
      const element = document.createElement('div');
      element.setAttribute('value', '123');
      bindAttributes(element, ['value'])
      expect("value" in element && element["value"]).toBe('123');
    });

    it("sets an attribute value via an instance property", () => {
      const element = document.createElement("input");
      bindAttributes(element, ["value"]);
      element.value = "123"
      expect("value" in element && element["value"]).toBe("123");
    });

    it('defaults the value for an instance property', () => {
      const element = document.createElement("input");
      bindAttributes(element, ["value"], { value: '567' });
      expect("value" in element && element["value"]).toBe("567");
      expect(element.getAttribute('value')).toBe(null);
    });
  });

  describe('toCamelCase', () => {
    it('converts regular sentences', () => {
      expect(toCamelCase('Just a regu1ar    sentence.')).toBe('justARegu1arSentence')
    })

    it('converts snake case', () => {
      expect(toCamelCase('just-a-snake-case-name')).toBe('justASnakeCaseName')
    })

    it('handles an empty string', () => {
      expect(toCamelCase('')).toBe('');
    })
  });

  test('getFractionDigits', () => {
    expect(getFractionDigits('1')).toBe(0);
    expect(getFractionDigits("1.5")).toBe(1);
    expect(getFractionDigits("1.23456")).toBe(5);
    expect(getFractionDigits('')).toBe(0)
  });

  test('minmax', () => {
    expect(minmax(-5, 0, 100)).toBe(0);
    expect(minmax(1.5, 0, 1)).toBe(1);
    expect(minmax(0.5, 0, 1)).toBe(0.5);
    expect(minmax(0)).toBe(0)
  })
})
