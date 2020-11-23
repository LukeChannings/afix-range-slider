import {
  assert,
  getFractionDigits,
  minmax,
  roundToStep,
  toCamelCase,
} from './Component.utils'

describe('util', () => {
  describe('assert', () => {
    it('throws with false', () => {
      expect(() => assert(false)).toThrow()
    })

    it('does not throw with true', () => {
      expect(() => assert(true)).not.toThrow()
    })
  })

  describe('toCamelCase', () => {
    it('converts regular sentences', () => {
      expect(toCamelCase('Just a regu1ar    sentence.')).toBe(
        'justARegu1arSentence'
      )
    })

    it('converts snake case', () => {
      expect(toCamelCase('just-a-snake-case-name')).toBe('justASnakeCaseName')
    })

    it('handles an empty string', () => {
      expect(toCamelCase('')).toBe('')
    })
  })

  test('getFractionDigits', () => {
    expect(getFractionDigits('1')).toBe(0)
    expect(getFractionDigits('1.5')).toBe(1)
    expect(getFractionDigits('1.23456')).toBe(5)
    expect(getFractionDigits('')).toBe(0)
  })

  test('minmax', () => {
    expect(minmax(-5, 0, 100)).toBe(0)
    expect(minmax(1.5, 0, 1)).toBe(1)
    expect(minmax(0.5, 0, 1)).toBe(0.5)
    expect(minmax(0)).toBe(0)
  })

  test('roundToStep', () => {
    expect(roundToStep(0.3, 0.5)).toEqual(0.5);
    expect(roundToStep(4, 10)).toEqual(0);
    expect(roundToStep(60, 100)).toEqual(100);
    expect(roundToStep(0.5, 0.1)).toEqual(0.5)
    expect(roundToStep(0.5, 0.01)).toEqual(0.5)
  })
})
