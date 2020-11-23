// assert - a function to ensure sanity of variables and type safety
export function assert(
  condition: boolean,
  errorMessage = 'Assertion Error'
): asserts condition {
  if (!condition) {
    throw new Error(errorMessage)
  }
}

// toCamelCase - converts a string to lower camel case.
// e.g. "kebab-case-string", "Just a regular string") to "camelCaseStrings
export const toCamelCase = (value: string) =>
  (
    value.charAt(0).toLowerCase() +
    value.slice(1).replace(/([ -][a-z0-9])/g, v => v[1].toUpperCase())
  ).replace(/[^a-z0-9]+/gi, '')

// getFractionDigits - returns the number of fraction digits based on the value
// e.g. when n = "1", the digits are 0. When n = "1.33", the digits are 2.
export const getFractionDigits = (n: string) =>
  (n || '1').replace('.', '').length - 1

// minmax - bounds a number between a minimum and maxium value
export const minmax = (n: number, min = 0, max = 100, step?: number) => {
  const boundedN = Math.max(min, Math.min(max, n))
  return typeof step === 'undefined' ? boundedN : roundToStep(boundedN, step)
}

// roundToStep - rounds a number to a given stepping value
// e.g. roundToStep(0.3, 0.5) -> 0.5; (4, 10) -> 1 ; (60, 100) -> 100
export const roundToStep = (n: number, step: number = 1.0) => {
  const inv = 1.0 / step
  return Math.round(n * inv) / inv
}
