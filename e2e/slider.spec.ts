describe('afix-range-slider', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:8833/slider.html')
  })

  it('supports setting width and height via CSS', async () => {
    await page.$eval('afix-range-slider', el => {
      el.style.width = '1234px'
      el.style.height = '432px'
    })

    const value = await (await page.$('afix-range-slider'))?.boundingBox()

    expect(value?.width).toBeCloseTo(1234)
    expect(value?.height).toBeCloseTo(432)
  })

  it('instance value is reflected in value attribute', async () => {
    await page.$eval('afix-range-slider', el => {
      ;(el as HTMLInputElement).value = '25'
    })

    const value = await (await page.$('afix-range-slider'))?.getAttribute(
      'value'
    )

    expect(value).toBe('25')
  })

  it('instance value attribute reflects attribute', async () => {
    await page.$eval('afix-range-slider', el => {
      el.setAttribute('value', '75')
    })
    const value = await page.$eval(
      'afix-range-slider',
      el => (el as HTMLInputElement).value
    )
    expect(value).toBe('75')
  })

  it('handles tabindex override', async () => {
    await page.$eval('body', el => {
      el.innerHTML = `<afix-range-slider tabindex="-1"></afix-range-slider>`
    })

    expect(
      await page.$eval('afix-range-slider', el => {
        return el.tabIndex === -1
      })
    ).toBeTruthy()
  })
})
