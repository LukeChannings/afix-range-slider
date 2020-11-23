// This module contains utilities that are shared by all tests

import type { MatchImageSnapshotOptions } from 'jest-image-snapshot'
import type { ElementHandle } from 'playwright'
import { toCamelCase } from '../src/Component.utils'

page.on('console', msg => {
  console.log(msg.text())
})

export const setup = async (
  attributes: Record<string, string> = {}
): Promise<ElementHandle<HTMLElement>> => {
  await page.goto(__TEST_SERVER__)

  await page.$eval(
    'body',
    (bodyEl, attr) => {
      bodyEl.innerHTML = `<afix-range-slider ${attr}></afix-range-slider>`
    },
    Object.entries(attributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')
  )

  const slider = await page.$('afix-range-slider')
  if (!slider) {
    throw new Error("couldn't select afix-range-slider!")
  }
  return slider as ElementHandle<HTMLElement>
}

type MatchSnapshotOptions = MatchImageSnapshotOptions & {
  dumpInlineDiffToConsole?: boolean
}

export const allBrowsersRenderTheSame: MatchSnapshotOptions = {
  allowSizeMismatch: true,
  failureThresholdType: 'percent',
  failureThreshold: 0.01,
  dumpInlineDiffToConsole: true,
  customSnapshotIdentifier: ({ currentTestName, counter }) =>
    `${toCamelCase(currentTestName)}-${counter}`,
}

export const screenshotOptions: MatchSnapshotOptions = {
  allowSizeMismatch: true,
  customSnapshotIdentifier: ({ currentTestName, counter }) =>
    `${toCamelCase(currentTestName)}-${counter}-${browserName}`,
  failureThresholdType: 'percent',
  failureThreshold: 0.01,
  dumpInlineDiffToConsole: true,
}

export const wheelEvent = async (
  handle: ElementHandle<HTMLElement>,
  x = 0,
  y = 0,
  z = 0
): Promise<void> => {
  await handle.evaluate(
    (_, [x, y, z]) =>
      _.dispatchEvent(
        new WheelEvent('wheel', {
          deltaMode: 0,
          deltaX: x,
          deltaY: y,
          deltaZ: z,
        })
      ),
    [x, y, z]
  )

  await new Promise(res => setTimeout(res, 100))
}
