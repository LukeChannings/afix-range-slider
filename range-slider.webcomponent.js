const { min, max, round } = Math

const template = html`
  <template>
    <div class="slider">
      <input class="input" type="range" />
      <div class="track value"></div>
      <div class="track shadow-value --bar"></div>
    </div>
    <style>
      .slider {
        --rangeInputTrackColor: currentColor;
        --rangeInputTrackImage: var(--rangeTrackImage);

        --rangeInputWidth: var(--rangeWidth, var(--rangeDefaultLength, '100%'));
        --rangeInputHeight: var(--rangeHeight, var(--rangeDefaultHeight, '100%'));

        background-color: var(--rangeBackgroundColor, rgba(0, 0, 0, 0.8));
        background-image: var(--rangeBackgroundImage, none);
        overflow: hidden;
        border: var(--rangeBorder, none);
        width: var(--rangeInputWidth);
        height: var(--rangeInputHeight);
        margin: 0;
        position: relative;
        transition: transform ease-in-out 200ms;
      }

      .--vertical {
        cursor: ns-resize;
        border-radius: calc(var(--rangeInputWidth) / 6);
      }

      .--horizontal {
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
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        /*
        * Safari's painting optimisation ends up leaving line artefacts behind sometimes.
        * Expanding the track's box by 2px in all directions helps prevent artefacts.
        */
        box-shadow: 2px 2px transparent;
      }

      .track.--bar {
        background-color: var(--rangeInputTrackColor);
        background-image: var(--rangeInputTrackImage);
      }

      .track.--line::after {
        position: absolute;
        content: '';
        display: block;
        background: var(--rangeTrackLineColor, #fff);
      }

      .--vertical .track.--line::after {
        width: 100%;
        height: 2px;
        left: 0;
        top: -1px;
      }

      .--horizontal .track.--line::after {
        top: 0;
        right: -1px;
        height: 100%;
        width: 2px;
      }

      .--vertical .track.value {
        transform: translateY(calc(100% - var(--rangeValue)));
      }
      .--vertical .track.shadow-value {
        transform: translateY(calc(100% - var(--rangeShadowValue)));
      }
      .--horizontal .track.value {
        transform: translateX(calc(-100% + var(--rangeValue)));
      }
      .--horizontal .track.shadow-value {
        transform: translateX(calc(-100% + var(--rangeShadowValue)));
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
    super()

    this.attachShadow({ mode: 'open' }).appendChild(
      template.content.cloneNode(true),
    )

    this.sliderEl = this.shadowRoot.querySelector('.slider')
    this.inputEl = this.shadowRoot.querySelector('.input')
    this.trackEl = this.shadowRoot.querySelector('.track')
    this.valueLabelEl = this.shadowRoot.querySelector('.valueLabel')

    this.min = Number(this.getAttribute('min'))
    this.max = Number(this.getAttribute('max'))
    this.step = Number(this.getAttribute('step') || '1')

    this.setValue(Number(this.getAttribute('value')))
    this.setShadowValue(Number(this.getAttribute('shadow-value') || '0'))

    const horizontal = this.getAttribute('horizontal') !== null

    if (!this.style.width) {
      this.sliderEl.style.setProperty(
        '--rangeDefaultLength',
        horizontal ? '12rem' : '3.75rem',
      )
    } else {
      this.sliderEl.style.setProperty( '--rangeDefaultLength', '100%')
    }

    if (!this.style.height) {
      this.sliderEl.style.setProperty(
        '--rangeDefaultHeight',
        horizontal ? '3.75rem' : '10rem',
      )
    } else {
      this.sliderEl.style.setProperty( '--rangeDefaultHeight', '100%')
    }

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

    this.inputEl.addEventListener(
      'change',
      () => this.setValue(this.inputEl.value),
      { passive: true },
    )

    this.sliderEl.addEventListener('wheel', e => {
      e.preventDefault()
      let delta

      if (this.aspect === 'vertical') {
        delta = (e.deltaY * this.step) / this.deltaYMax
      } else {
        delta = (-e.deltaX * this.step) / this.deltaXMax
      }

      this.setValue(this.value + delta * (this.max - this.min))
    })
  }

  initializeSlider() {
    const positionIndicatorStyle =
      this.getAttribute('position-indicator') || 'bar'

    if (positionIndicatorStyle === 'line') {
      this.trackEl.classList.add('--line')
    } else {
      this.trackEl.classList.add('--bar')
    }

    this.hasPointerCapture = false

    this.sliderEl.addEventListener('touchstart', e => e.preventDefault())

    this.sliderEl.addEventListener(
      'pointerdown',
      e => {
        if (e.button === 2) return
        this.sliderEl.setPointerCapture(e.pointerId)
        this.hasPointerCapture = true
        this.lastX = e.x
        this.lastY = e.y
      },
      { passive: true },
    )

    window.addEventListener(
      'pointermove',
      e => {
        if (this.hasPointerCapture) {
          const deltaX = this.lastX - e.x
          const deltaY = this.lastY - e.y

          this.lastX = e.x
          this.lastY = e.y

          let delta

          if (this.aspect === 'vertical') {
            delta = deltaY / this.deltaYMax
          } else {
            delta = -deltaX / this.deltaXMax
          }

          this.setValue(this.value + delta * (this.max - this.min))
        }
      },
      { passive: true },
    )

    this.sliderEl.addEventListener(
      'lostpointercapture',
      e => {
        this.hasPointerCapture = false
        this.lastX = null
        this.lastY = null
      },
      { passive: true },
    )
  }

  setValue(value) {
    const boundedValue = max(this.min, min(this.max, value))
    const roundedValue = round(boundedValue)

    if (this.value === boundedValue) {
      return
    }

    this.inputEl.value = roundedValue
    this.sliderEl.style.setProperty(
      '--rangeValue',
      ((boundedValue - this.min) / (this.max - this.min)) * 100 + '%',
    )
    this.value = boundedValue
    this.setAttribute('value', boundedValue)
    const fractionDigits =
      this.step % 1 > 0 ? String(this.step).replace(/^.+?\./, '').length : 0
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: Number(boundedValue.toFixed(fractionDigits)),
          boundedValue,
          roundedValue,
        },
      }),
    )
  }

  setShadowValue(shadowValue) {
    this.shadowValue = shadowValue
    this.sliderEl.style.setProperty(
      '--rangeShadowValue',
      ((shadowValue - this.min) / (this.max - this.min)) * 100 + '%',
    )
  }

  static get observedAttributes() {
    return ['value', 'shadow-value', 'min', 'max', 'step']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'value':
        this.setValue(Number(newValue))
        break
      case 'shadow-value':
        this.setShadowValue(newValue)
        break
    }
  }
}

function html(htmlString) {
  const _ = document.createElement('div')
  _.innerHTML = htmlString.raw.join('')
  return _.firstElementChild
}

customElements.define('range-slider', RangeSlider)
