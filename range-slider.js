const { min, max, round } = Math

const minmax = n => max(0, min(100, n))

const RangeInput = rangeEl => {
  const inputEl = rangeEl.querySelector('.rangeSlider__input')
  const valueEl = rangeEl.querySelector('.rangeSlider__value')

  const deltaYMax = rangeEl.getBoundingClientRect().height
  let lastY = null

  const setValue = value => {
    rangeEl.style.setProperty('--rangeInputValue', `${value}%`)
    rangeEl.dataset.icon = (() => {
      if (value < 9) return '0'
      if (value < 19) return '10'
      if (value < 29) return '20'
      if (value < 39) return '30'
      if (value < 49) return '40'
      if (value < 59) return '50'
      if (value < 69) return '60'
      if (value < 79) return '70'
      if (value < 89) return '80'
      if (value < 99) return '90'
      if (value >= 99) return '100'
    })()
    inputEl.value = value
    if (valueEl) {
      valueEl.innerHTML = round(value)
    }
  }

  setValue(inputEl.value)

  rangeEl.addEventListener('wheel', e => {
    setValue(minmax(Number(inputEl.value) + e.deltaY / deltaYMax * 100))
    e.preventDefault()
    e.stopPropagation()
  })

  rangeEl.addEventListener('touchstart', e => {
    e.preventDefault()
  })

  rangeEl.addEventListener('pointerleave', e => {
    e.stopPropagation()
    e.preventDefault()
    lastY = null
  })

  rangeEl.addEventListener('pointerdown', e => {
    lastY = e.y
    rangeEl.style.transform = 'scale(1.05)'
    e.stopPropagation()
    e.preventDefault()
  })

  rangeEl.addEventListener('pointerup', () => {
    lastY = null
    rangeEl.style.transform = ''
  })

  rangeEl.addEventListener('pointermove', e => {
    if (lastY !== null) {
      const deltaY = lastY - e.y
      lastY = e.y
      setValue(minmax(Number(inputEl.value) + deltaY / deltaYMax * 100))
      e.stopPropagation()
      e.preventDefault()
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  Array.from(document.querySelectorAll('.rangeSlider')).forEach(RangeInput)
})
