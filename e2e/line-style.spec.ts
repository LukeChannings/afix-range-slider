import {
  MatchImageSnapshotOptions,
  toMatchImageSnapshot,
} from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot })

describe('afix-range-slider', () => {
  const screenshotOptions: MatchImageSnapshotOptions = {
    noColors: true,
    dumpDiffToConsole: ('inline' as unknown) as boolean,
    failureThreshold: 1,
    failureThresholdType: 'percent',
    allowSizeMismatch: true,
  }

  beforeEach(async () => {
    await page.goto('http://localhost:8833/line-style.html')
  })

  it('supports line-style option', async () => {
    const sliderEl = await page.$('afix-range-slider')

    expect(await page.$eval('afix-range-slider', el => el.hasAttribute('line-style'))).toBeTruthy()
    expect(await sliderEl!.screenshot()).toMatchImageSnapshot(screenshotOptions)
  })
})
