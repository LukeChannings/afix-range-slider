import { allBrowsersRenderTheSame, setup } from '.'

describe('appearance', () => {
  test('width & height', async () => {
    const slider = await setup({ style: 'width: 200px; height: 10px' })

    const boundingBox = (await slider.boundingBox())!

    expect(boundingBox.width).toBe(200)
    expect(boundingBox.height).toBe(10)
  })

  test('color', async () => {
    const slider = await setup({ style: 'color: red' })

    expect(await slider.screenshot()).toMatchImageSnapshot(
      allBrowsersRenderTheSame
    )
  })

  test('background-color', async () => {
    const slider = await setup({
      'line-style': '',
      style: 'background-color: pink',
    })

    expect(await slider.screenshot()).toMatchImageSnapshot(
      allBrowsersRenderTheSame
    )
  })

  test('background-image', async () => {
    const slider = await setup({
      value: '0',
      style: 'background-image: linear-gradient(90deg, red, green)',
    })

    expect(await slider.screenshot()).toMatchImageSnapshot(
      allBrowsersRenderTheSame
    )
  })

  test('border', async () => {
    const slider = await setup({
      'line-style': '',
      style: 'border: 2px solid red; color: red',
    })

    expect(await slider.screenshot()).toMatchImageSnapshot(
      allBrowsersRenderTheSame
    )
  })

  test('border-radius', async () => {
    const slider = await setup({
      'line-style': '',
      style: 'border-radius: 1rem; color: red',
    })

    expect(await slider.screenshot()).toMatchImageSnapshot(
      allBrowsersRenderTheSame
    )
  })

  test('--ars-comparison-value-color', async () => {
    const slider = await setup({
      'line-style': '',
      style: '--ars-comparison-value-color: green',
      'comparison-value': '50',
      value: '100',
    })

    expect(await slider.screenshot()).toMatchImageSnapshot(
      allBrowsersRenderTheSame
    )
  })
})
