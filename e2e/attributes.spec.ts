/**
 * This spec tests all documented attributes for <afix-range-slider /> work as expected
 */

import { setup, allBrowsersRenderTheSame } from '.'
import AfixRangeSlider from '../src/Component'

describe('attributes', () => {
  describe('max', () => {
    it('defaults to 100', async () => {
      const slider = await setup()
      expect(await (await slider.getProperty('max')).jsonValue()).toBe('100')
    })

    it('can be specified', async () => {
      const slider = await setup({ max: '200' })
      expect(await (await slider.getProperty('max')).jsonValue()).toBe('200')
    })

    it('property is the same as attribute', async () => {
      const slider = await setup()
      await slider.evaluate((_: AfixRangeSlider) => (_.max = '20'))
      expect(await (await slider.getProperty('max')).jsonValue()).toBe('20')
      expect(await slider.getAttribute('max')).toBe('20')
    })

    it('can be set as an attribute', async () => {
      const slider = await setup()
      await slider.evaluate((_: AfixRangeSlider) => _.setAttribute('max', '20'))
      expect(await (await slider.getProperty('max')).jsonValue()).toBe('20')
      expect(await slider.getAttribute('max')).toBe('20')
    })

    it('is reflected in aria-valuemax', async () => {
      const slider = await setup({ max: '200' })
      expect(await slider.getAttribute('aria-valuemax')).toBe('200')

      await slider.evaluate((_: AfixRangeSlider) => (_.max = '150'))
      expect(await slider.getAttribute('aria-valuemax')).toBe('150')
    })
  })

  describe('min', () => {
    it('defaults to 0', async () => {
      const slider = await setup()
      expect(await (await slider.getProperty('min')).jsonValue()).toBe('0')
    })

    it('can be specified', async () => {
      const slider = await setup({ min: '60' })
      expect(await (await slider.getProperty('min')).jsonValue()).toBe('60')
    })

    it('property is the same as attribute', async () => {
      const slider = await setup()
      await slider.evaluate((_: AfixRangeSlider) => (_.min = '20'))
      expect(await (await slider.getProperty('min')).jsonValue()).toBe('20')
      expect(await slider.getAttribute('min')).toBe('20')
    })

    it('can be set as an attribute', async () => {
      const slider = await setup()
      await slider.evaluate((_: AfixRangeSlider) => _.setAttribute('min', '20'))
      expect(await (await slider.getProperty('min')).jsonValue()).toBe('20')
      expect(await slider.getAttribute('min')).toBe('20')
    })

    it('is reflected in aria-valuemin', async () => {
      const slider = await setup({ min: '20' })
      expect(await slider.getAttribute('aria-valuemin')).toBe('20')

      await slider.evaluate((_: AfixRangeSlider) => (_.min = '50'))
      expect(await slider.getAttribute('aria-valuemin')).toBe('50')
    })
  })

  describe('value', () => {
    it('defaults to half of max', async () => {
      let slider = await setup()
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('50')

      expect(await slider.screenshot()).toMatchImageSnapshot(
        allBrowsersRenderTheSame
      )

      slider = await setup({ max: '200' })
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('100')
    })

    it('can be specified', async () => {
      let slider = await setup({ value: '80' })
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('80')

      expect(await slider.screenshot()).toMatchImageSnapshot(
        allBrowsersRenderTheSame
      )

      await slider.evaluate((_: AfixRangeSlider) => (_.value = '70'))
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('70')

      expect(await slider.screenshot()).toMatchImageSnapshot(
        allBrowsersRenderTheSame
      )
    })

    it('cannot be lower than min (via property)', async () => {
      let slider = await setup({ value: '0', min: '25' })
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('25')
    })

    it('cannot be lower than min (via attribute)', async () => {
      const slider = await setup({ value: '0', min: '25' })
      await slider.evaluate((_: AfixRangeSlider) =>
        _.setAttribute('value', '0')
      )
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('25')
    })
    it('cannot be higher than max (via property)', async () => {
      let slider = await setup({ value: '100', max: '50' })
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('50')
    })

    it('cannot be lower than max (via attribute)', async () => {
      const slider = await setup({ max: '50' })
      await slider.evaluate((_: AfixRangeSlider) =>
        _.setAttribute('value', '100')
      )
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('50')
    })

    it('is reflected in aria-valuenow', async () => {
      let slider = await setup({ value: '44' })
      expect(await slider.getAttribute('aria-valuenow')).toBe('44')

      await slider.evaluate((_: AfixRangeSlider) => (_.value = '50'))

      expect(await slider.getAttribute('aria-valuenow')).toBe('50')
    })
  })

  describe('step', () => {
    it('rounds to the step value in constructor', async () => {
      let slider = await setup({ step: '0.5', value: '1.25' })
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('1.5')
    })

    it('rounds to the step value when set (via property)', async () => {
      let slider = await setup({ step: '0.5', value: '11' })

      await slider.evaluate((_: AfixRangeSlider) => (_.value = '11.1'))
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('11')
    })

    it('rounds to the step value when set (via attribute)', async () => {
      let slider = await setup({ step: '0.5' })

      await slider.evaluate((_: AfixRangeSlider) =>
        _.setAttribute('value', '11.1')
      )
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('11')
    })

    it('supports fractional steps (0.1)', async () => {
      let slider = await setup({
        step: '0.1',
        min: '0',
        max: '1',
        value: '0.5',
      })

      expect(await (await slider.getProperty('value')).jsonValue()).toBe('0.5')
    })

    it('supports fractional steps (0.01)', async () => {
      let slider = await setup({
        step: '0.01',
        min: '0',
        max: '1',
        value: '0.5',
      })

      expect(await (await slider.getProperty('value')).jsonValue()).toBe('0.5')
    })
  })

  describe('comparison-value', () => {
    it('defaults to null', async () => {
      let slider = await setup()
      expect(
        await (await slider.getProperty('comparisonValue')).jsonValue()
      ).toBeNull()
      expect(await slider.getAttribute('comparison-value')).toBeNull()
    })

    it('is not bounded by step', async () => {
      let slider = await setup({ step: '1', 'comparison-value': '1.5' })
      expect(
        await (await slider.getProperty('comparisonValue')).jsonValue()
      ).toBe('1.5')
    })

    it('cannot be lower than min', async () => {
      let slider = await setup({ min: '10' })
      await slider.evaluate((_: AfixRangeSlider) => (_.comparisonValue = '1'))
      expect(
        await (await slider.getProperty('comparisonValue')).jsonValue()
      ).toBe('10')
    })

    it('cannot be lower than max', async () => {
      let slider = await setup({ max: '90' })
      await slider.evaluate((_: AfixRangeSlider) => (_.comparisonValue = '100'))
      expect(
        await (await slider.getProperty('comparisonValue')).jsonValue()
      ).toBe('90')
    })
  })

  describe('vertical', () => {
    it('defaults to false (horizontal by default)', async () => {
      let slider = await setup()
      expect(
        await (await slider.getProperty('vertical')).jsonValue()
      ).toBeFalsy()
    })

    it('renders horizontal by default', async () => {
      let slider = await setup({ value: '25' })
      expect(await slider.screenshot()).toMatchImageSnapshot(
        allBrowsersRenderTheSame
      )
    })

    it('sets aria-orientation to horizontal by default', async () => {
      let slider = await setup()
      expect(await slider.getAttribute('aria-orientation')).toBe('horizontal')
    })

    it('renders vertical when set', async () => {
      let slider = await setup({ value: '25', vertical: '' })
      expect(await slider.screenshot()).toMatchImageSnapshot(
        allBrowsersRenderTheSame
      )
    })

    it('sets aria-orientation to vertical when set', async () => {
      let slider = await setup({ vertical: '' })
      expect(await slider.getAttribute('aria-orientation')).toBe('vertical')
    })
  })

  describe('line-style', () => {
    it('renders a bar by default', async () => {
      let slider = await setup({ style: 'color: purple' })
      expect(await slider.screenshot()).toMatchImageSnapshot(
        allBrowsersRenderTheSame
      )
    })

    it('renders a bar by default (vertical)', async () => {
      let slider = await setup({ style: 'color: purple', vertical: '' })
      expect(await slider.screenshot()).toMatchImageSnapshot(
        allBrowsersRenderTheSame
      )
    })

    it('renders a line instead of a bar when line-style is set', async () => {
      let slider = await setup({ 'line-style': '', style: 'color: purple' })
      expect(await slider.screenshot()).toMatchImageSnapshot(
        allBrowsersRenderTheSame
      )
    })

    it('renders a line instead of a bar when line-style is set (vertical)', async () => {
      let slider = await setup({
        'line-style': '',
        vertical: '',
        style: 'color: purple',
      })
      expect(await slider.screenshot()).toMatchImageSnapshot(
        allBrowsersRenderTheSame
      )
    })
  })

  describe('role', () => {
    it('is "slider"', async () => {
      let slider = await setup({ style: 'color: purple' })
      expect(await slider.getAttribute('role')).toBe('slider')
    })
  })
})
