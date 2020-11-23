import { setup } from '.'

describe('keyboard events', () => {
  describe('incrementing', () => {
    ;['ArrowRight', 'ArrowUp'].map(event => {
      test(`${event} increments value by 1 (step 1)`, async () => {
        let slider = await setup({ value: '50' })
        await slider.focus()
        await page.keyboard.press(event)
        expect(await (await slider.getProperty('value')).jsonValue()).toBe('51')
      })

      test(`${event} increments value by .1 (step 0.1)`, async () => {
        let slider = await setup({
          min: '0',
          max: '1',
          step: '0.1',
          value: '0.5',
        })
        await slider.focus()
        await page.keyboard.press(event)
        expect(await (await slider.getProperty('value')).jsonValue()).toBe(
          '0.6'
        )
      })

      test(`Shift+${event} increments value by 10 (step 1)`, async () => {
        const slider = await setup({ value: '50' })
        await slider.focus()
        await page.keyboard.press(`Shift+${event}`)
        expect(await (await slider.getProperty('value')).jsonValue()).toBe('60')
      })

      test(`Shift+${event} increments value by 1 (step 0.1)`, async () => {
        const slider = await setup({
          min: '0',
          max: '1',
          step: '0.1',
          value: '0.5',
        })
        await slider.focus()
        await page.keyboard.press(`Shift+${event}`)
        expect(await (await slider.getProperty('value')).jsonValue()).toBe('1')
      })
    })

    test(`PageUp increments value by 10 (step 1)`, async () => {
      const slider = await setup({ value: '50' })
      await slider.focus()
      await page.keyboard.press(`PageUp`)
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('60')
    })

    test(`PageUp increments value by 1 (step 0.1)`, async () => {
      const slider = await setup({
        min: '0',
        max: '1',
        step: '0.1',
        value: '0.5',
      })
      await slider.focus()
      await page.keyboard.press(`PageUp`)
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('1')
    })
  })

  describe('decrementing', () => {
    ;['ArrowLeft', 'ArrowDown'].map(event => {
      test(`${event} decrements value by 1 (step 1)`, async () => {
        let slider = await setup({ value: '50' })
        await slider.focus()
        await page.keyboard.press(event)
        expect(await (await slider.getProperty('value')).jsonValue()).toBe('49')
      })

      test(`${event} decrements value by .1 (step 0.1)`, async () => {
        let slider = await setup({
          min: '0',
          max: '1',
          step: '0.1',
          value: '0.5',
        })
        await slider.focus()
        await page.keyboard.press(event)
        expect(await (await slider.getProperty('value')).jsonValue()).toBe(
          '0.4'
        )
      })

      test(`Shift+${event} decrements value by 10 (step 1)`, async () => {
        const slider = await setup({ value: '50' })
        await slider.focus()
        await page.keyboard.press(`Shift+${event}`)
        expect(await (await slider.getProperty('value')).jsonValue()).toBe('40')
      })

      test(`Shift+${event} decrements value by 1 (step 0.1)`, async () => {
        const slider = await setup({
          min: '0',
          max: '1',
          step: '0.1',
          value: '0.5',
        })
        await slider.focus()
        await page.keyboard.press(`Shift+${event}`)
        expect(await (await slider.getProperty('value')).jsonValue()).toBe('0')
      })
    })

    test(`PageDown decrements value by 10 (step 1)`, async () => {
      const slider = await setup({ value: '50' })
      await slider.focus()
      await page.keyboard.press(`PageDown`)
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('40')
    })

    test(`PageDown decrements value by 1 (step 0.1)`, async () => {
      const slider = await setup({
        min: '0',
        max: '1',
        step: '0.1',
        value: '0.5',
      })
      await slider.focus()
      await page.keyboard.press(`PageDown`)
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('0')
    })
  })

  describe('min / max', () => {
    test('Home sets value to minimum', async () => {
      let slider = await setup({ value: '50', min: '10' })
      await slider.focus()
      await page.keyboard.press('Home')
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('10')
    })

    test('End sets value to maximum', async () => {
      let slider = await setup({ value: '50', max: '90' })
      await slider.focus()
      await page.keyboard.press('End')
      expect(await (await slider.getProperty('value')).jsonValue()).toBe('90')
    })
  })
})
