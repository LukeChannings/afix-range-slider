const { min, max, round } = Math

const template = html`
  <template>
    <div class="slider">
      <input class="input" type="range" />
      <div class="track"></div>
    </div>
    <style>
    .slider {
      --rangeInputColor: rgba(0, 0, 0, 0.8);
      --rangeInputTrackColor: currentColor;
      --rangeInputTrackImage: var(--rangeTrackImage);

      --rangeInputWidth: var(--rangeWidth, var(--rangeDefaultLength));
      --rangeInputHeight: var(--rangeHeight, var(--rangeDefaultHeight));

      background-color: var(--rangeInputColor);
      background-image: var(--rangeBackgroundImage);
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
      outline-color: -webkit-focus-ring-color;
      outline-style: auto;
      outline-width: 5px;
    }

    .track {
      position: relative;
      width: 100%;
      height: 100%;
      /*
      * Safari's painting optimisation ends up leaving line artefacts behind sometimes.
      * Expanding the track's box by 2px in all directions helps prevent artefacts.
      */
      box-shadow: 2px 2px transparent;
    }

    .track.\-\-bar {
      background-color: var(--rangeInputTrackColor);
      background-image: var(--rangeInputTrackImage);
    }

    .track.\-\-line::after {
      position: absolute;
      content: "";
      display: block;
      background: var(--rangeTrackLineColor, #fff);
    }

    .\-\-vertical .track.\-\-line::after {
      width: 100%;
      height: 2px;
      left: 0;
      top: -1px;
    }

    .\-\-horizontal .track.\-\-line::after {
      top: 0;
      right: -1px;
      height: 100%;
      width: 2px;
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

    this.min = Number(this.getAttribute('min'))
    this.max = Number(this.getAttribute('max'))

    this.setValue(Number(this.getAttribute('value')))

    const horizontal = this.getAttribute('horizontal') !== null

    this.sliderEl.style.setProperty('--rangeDefaultLength', horizontal ? '12rem' : '3.75rem')
    this.sliderEl.style.setProperty('--rangeDefaultHeight', horizontal ? '3.75rem': '10rem')

    const { width, height } = this.sliderEl.getBoundingClientRect()

    this.deltaYMax = height
    this.deltaXMax = width

    this.aspect = width > height ? 'horizontal' : 'vertical'

    this.sliderEl.classList.add(`--${this.aspect}`)

    this.initializeInput()
    this.initializeSlider()
  }

  initializeInput() {

    this.inputEl.min = this.min
    this.inputEl.max = this.max

    this.inputEl.addEventListener('change', () => this.setValue(this.inputEl.value), { passive: true })

    this.sliderEl.addEventListener('wheel', e => {
      const delta = (this.aspect === 'vertical' ? e.deltaY / this.deltaYMax : -e.deltaX / this.deltaXMax) * this.max
      this.setValue(this.value + delta)
      e.preventDefault()
    })
  }

  initializeSlider() {
    const positionIndicatorStyle = this.getAttribute('position-indicator') ?? 'bar'

    if (positionIndicatorStyle === 'line') {
      this.trackEl.classList.add('--line')
    } else {
      this.trackEl.classList.add('--bar')
    }

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

        const delta = (this.aspect === 'vertical' ? deltaY / this.deltaYMax : -deltaX / this.deltaXMax) * this.max

        this.setValue(this.value + delta)
      }
    }, { passive: true })

    this.sliderEl.addEventListener('lostpointercapture', e => {
      this.hasPointerCapture = false
      this.lastX = null
      this.lastY = null
    }, { passive: true })
  }

  setValue(value) {
    const boundedValue = max(this.min, min(this.max, value))
    const roundedValue = round(boundedValue)

    if (this.value === boundedValue) { return }

    this.inputEl.value = roundedValue
    this.sliderEl.style.setProperty('--rangeInputValue', (boundedValue / this.max * 100) + '%')
    this.value = boundedValue
    this.setAttribute('value', boundedValue)
    this.dispatchEvent(new CustomEvent('change', { detail: { value: boundedValue } }))
  }
}

function html(htmlString) {
  const _ = document.createElement('div')
  _.innerHTML = htmlString.raw.join('')
  return _.firstElementChild
}

customElements.define('range-slider', RangeSlider)
