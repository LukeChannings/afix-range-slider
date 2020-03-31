const { min, max } = Math

const minmax = n => max(0, min(100, n))

const loadTemplate = async uri => {
  const response = await fetch(uri)

  if (response.ok) {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = await response.text()
    return wrapper.firstChild
  }

  throw new Error('Could not load HTML Template')
}

class RangeSlider extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' }).appendChild(
      RangeSlider.template.content.cloneNode(true)
     )

    this.sliderEl = this.shadowRoot.querySelector('.slider')
    this.inputEl = this.shadowRoot.querySelector('.input')
    this.trackEl = this.shadowRoot.querySelector('.track')
    this.valueLabelEl = this.shadowRoot.querySelector('.valueLabel')

    const {
      width,
      height
    } = this.sliderEl.getBoundingClientRect()

    this.deltaYMax = height
    this.deltaXMax = width

    this.aspect = width > height ? 'horizontal' : 'vertical'

    this.sliderEl.classList.add(`--${this.aspect}`)

    this.hasPointerCapture = false

    this.initializeInput()
  }

  initializeInput() {
    const min = this.getAttribute('min')
    const max = this.getAttribute('max')
    const value = this.getAttribute('value')

    this.inputEl.addEventListener('change', () => this.handleInputChange())
    this.sliderEl.addEventListener('wheel', e => this.handleScroll(e))

    this.inputEl.min = min
    this.inputEl.max = max

    this.setValue(value)

    this.initializeSlider()
  }

  initializeSlider() {
    this.sliderEl.addEventListener('touchstart', e => {
      e.preventDefault()
      e.stopPropagation()
    })

    this.sliderEl.addEventListener('pointerdown', e => {
      if (e.button === 2) return;
      this.sliderEl.setPointerCapture(e.pointerId);
      this.hasPointerCapture = true
      this.lastX = e.x
      this.lastY = e.y
    })

    document.body.addEventListener('pointermove', e => {
      if (this.hasPointerCapture) {

        const deltaX = this.lastX - e.x
        const deltaY = this.lastY - e.y

        this.lastX = e.x
        this.lastY = e.y

        const delta = (this.aspect === 'vertical' ? deltaY / this.deltaYMax : -deltaX / this.deltaXMax) * 100

        const newValue = minmax(Number(this.inputEl.value) + delta)

        this.setValue(newValue)
      }
    })

    this.sliderEl.addEventListener('lostpointercapture', e => {
      this.hasPointerCapture = false
      this.lastX = null
      this.lastY = null
    })
  }

  setValue(value) {
    this.inputEl.value = value
    this.setTrackPosition()
    this.handleInputChange()
  }

  handleInputChange() {
    const { value, max } = this.inputEl
    this.setTrackPosition(value / max * 100)
  }

  handleScroll(e) {
    const delta = (this.aspect === 'vertical' ? e.deltaY / this.deltaYMax : -e.deltaX / this.deltaXMax) * 100
    this.setValue(
      minmax(Number(this.inputEl.value) + delta)
    )
    e.preventDefault()
    e.stopPropagation()
  }

  setTrackPosition(value) {
    this.sliderEl.style.setProperty(
      '--rangeInputValue',
      this.inputEl.value + '%',
    )
  }
}

(async load => {
  RangeSlider.template = await loadTemplate('/range-slider/template.html')

  customElements.define('range-slider', RangeSlider)
})()
