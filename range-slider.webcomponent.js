const { min, max, round } = Math

const template = html`
  <template>
    <div class="slider">
      <input type="range" class="input" min="0" max="100" value="50" />
      <div class="track"></div>
    </div>
    <style>
    .slider {
      --rangeInputColor: rgba(0, 0, 0, 0.8);
      --rangeInputTrackColor: currentColor;
      --rangeInputWidth: var(--width, 3.75rem);
      --rangeInputHeight: var(--height, calc(2.666666667 * var(--rangeInputWidth)));
      --rangeInputIconSize: var(--rangeInputIconSize, calc(var(--rangeInputWidth) / 3));
      --rangeValueTextColor: #fff;

      background-color: var(--rangeInputColor);
      overflow: hidden;
      width: var(--rangeInputWidth);
      height: var(--rangeInputHeight);
      margin: 0;
      position: relative;
      transition: transform ease-in-out 200ms;
    }

    .\-\-vertical {
      cursor: ns-resize;
      border-radius: calc(var(--rangeInputWidth) / 6);
    }

    .\-\-horizontal {
      cursor: ew-resize;
      border-radius: calc(var(--rangeInputHeight) / 6);
    }

    .slider:focus-within {
      transform: scale(1.05);
    }

    .slider:focus-within {
      outline-color: -webkit-focus-ring-color;
      outline-style: auto;
      outline-width: 5px;
    }

    .track {
      width: 100%;
      height: 100%;
      background-color: var(--rangeInputTrackColor);
      /*
      * Safari's painting optimisation ends up leaving line artefacts behind sometimes.
      * Expanding the track's box by 2px in all directions helps prevent artefacts.
      */
      box-shadow: 2px 2px transparent;
    }

    .\-\-vertical .track {
      transform: translateY(calc(100% - var(--rangeInputValue)));
    }

    .\-\-horizontal .track {
      transform: translateX(calc(-100% + var(--rangeInputValue)));
    }

    .input {
      clip: rect(1px, 1px, 1px, 1px);
      clip-path: inset(50%);
      height: 1px;
      width: 1px;
      margin: -1px;
      overflow: hidden;
      position: absolute;
    }
    </style>
  </template>
`

class RangeSlider extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

    this.sliderEl = this.shadowRoot.querySelector('.slider')
    this.inputEl = this.shadowRoot.querySelector('.input')
    this.trackEl = this.shadowRoot.querySelector('.track')
    this.valueLabelEl = this.shadowRoot.querySelector('.valueLabel')

    const { width, height } = this.sliderEl.getBoundingClientRect()

    this.deltaYMax = height
    this.deltaXMax = width

    this.aspect = width > height ? 'horizontal' : 'vertical'

    this.sliderEl.classList.add(`--${this.aspect}`)

    this.initializeInput()
    this.initializeSlider()
  }

  initializeInput() {
    const min = this.getAttribute('min')
    const max = this.getAttribute('max')
    const value = this.getAttribute('value')

    this.inputEl.addEventListener('change', () => this.setValue(this.inputEl.value), { passive: true })

    this.sliderEl.addEventListener('wheel', e => {
      const delta = (this.aspect === 'vertical' ? e.deltaY / this.deltaYMax : -e.deltaX / this.deltaXMax) * 100
      this.setValue(Number(this.inputEl.value) + delta)
      e.preventDefault()
    })

    this.inputEl.min = min
    this.inputEl.max = max

    this.setValue(value)
  }

  initializeSlider() {
    this.hasPointerCapture = false

    this.sliderEl.addEventListener('touchstart', e => e.preventDefault())

    this.sliderEl.addEventListener('pointerdown', e => {
      if (e.button === 2) return;
      this.sliderEl.setPointerCapture(e.pointerId);
      this.hasPointerCapture = true
      this.lastX = e.x
      this.lastY = e.y
    }, { passive: true })

    window.addEventListener('pointermove', e => {
      if (this.hasPointerCapture) {

        const deltaX = this.lastX - e.x
        const deltaY = this.lastY - e.y

        this.lastX = e.x
        this.lastY = e.y

        const delta = (this.aspect === 'vertical' ? deltaY / this.deltaYMax : -deltaX / this.deltaXMax) * 100

        this.setValue(Number(this.inputEl.value) + delta)
      }
    }, { passive: true })

    this.sliderEl.addEventListener('lostpointercapture', e => {
      this.hasPointerCapture = false
      this.lastX = null
      this.lastY = null
    }, { passive: true })
  }

  setValue(value) {
    const boundedValue = minmax(value)
    const roundedValue = round(boundedValue)

    if (this.currentValue === roundedValue) { return }

    this.inputEl.value = roundedValue
    this.sliderEl.style.setProperty('--rangeInputValue', boundedValue + '%')
    this.value = roundedValue
    this.setAttribute('value', roundedValue)
    this.dispatchEvent(new CustomEvent('change', { detail: { value: roundedValue } }))
    this.currentValue = this.inputEl.value
  }
}

function minmax(n) {
  return max(0, min(100, n))
}

function html(htmlString) {
  const _ = document.createElement('div')
  _.innerHTML = htmlString.raw.join('')
  return _.firstElementChild
}

customElements.define('range-slider', RangeSlider)
