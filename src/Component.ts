import { template } from './Component.template'
import {
  assert,
  minmax,
  getFractionDigits,
  roundToStep,
} from './Component.utils'

export interface AfixRangeSliderChange {
  value: string
  rawValue: number
}

interface State {
  width: number
  height: number
  min: number
  max: number
  value: number
}

export class AfixRangeSlider extends HTMLElement {
  shadowRoot!: ShadowRoot & HTMLElement
  inputEl: HTMLInputElement
  inputSlotEl: HTMLSlotElement | null

  static observedAttributes = [
    'value',
    'step',
    'min',
    'max',
    'comparison-value',
    'vertical',
  ]

  constructor() {
    super()

    this.min = this.getAttribute('min') ?? '0'
    const max = (this.max = this.getAttribute('max') ?? '100')
    this.step = this.getAttribute('step') ?? '1'
    this.value = this.getAttribute('value') ?? String(+max / 2)

    this.attachShadow({ mode: 'open' }).appendChild(
      template.content.cloneNode(true)
    )

    this.inputEl = this.configureInput(this.shadowRoot.querySelector('input'))

    this.inputSlotEl = this.shadowRoot.querySelector('slot[name=input]')
    this.inputSlotEl?.addEventListener('slotchange', () => {
      const assigned = this.inputSlotEl?.assignedElements()
      assert(!!assigned && assigned.length !== 0)
      this.inputEl = this.configureInput(assigned[0], this.inputEl)
    })

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0
    }

    this.updateAccessibilityModel({
      min: this.min,
      max: this.max,
      value: this.value,
      vertical: this.getAttribute('vertical'),
    })

    this.addEventListener('wheel', this.handleWheel)
    this.addEventListener('pointerdown', this.handlePointer)
    this.addEventListener('touchstart', e => e.preventDefault())
    this.addEventListener('keydown', this.handleKeyboard)
  }

  get value() {
    return this.getAttribute('value')!
  }

  set value(newValue: string) {
    const finalValue = String(
      minmax(+this.max, +this.min, +newValue, +this.step)
    )

    this.setAttribute('value', finalValue)
    this.style.setProperty('--value', finalValue + '%')
  }

  get step() {
    return this.getAttribute('step')!
  }

  set step(newStep: string) {
    this.setAttribute('step', newStep)
  }

  get min() {
    return this.getAttribute('min')!
  }

  set min(newMin: string) {
    this.setAttribute('min', newMin)
  }

  get max() {
    return this.getAttribute('max')!
  }

  set max(newMax: string) {
    this.setAttribute('max', newMax)
  }

  get comparisonValue() {
    return this.getAttribute('comparison-value')!
  }

  set comparisonValue(newComparisonValue: string) {
    this.setAttribute(
      'comparison-value',
      String(minmax(+this.max, +this.min, +newComparisonValue))
    )
  }

  get vertical() {
    return this.hasAttribute('vertical')
  }

  set vertical(newverticalValue: boolean) {
    if (newverticalValue) {
      this.setAttribute('vertical', '')
    } else {
      this.removeAttribute('vertical')
    }
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    if (
      name === 'value' &&
      (+newValue < +this.min ||
        +newValue > +this.max ||
        (
          roundToStep(+newValue, +this.step) !== +this.value))
    ) {
      this.value = newValue
    }

    this.updateAccessibilityModel({ [name]: newValue })
  }

  /**
   * the range slider has an input element supporting it (for accessibility).
   * In addition, if a custom input is passed via a slot (so that RangeSlider can be used in a <form>),
   * we need to re-configure the input when we get a slotchange event.
   */
  private configureInput(
    newInput: Element | null,
    oldInput?: HTMLInputElement
  ): HTMLInputElement {
    assert(newInput instanceof HTMLInputElement)

    if (oldInput) {
      oldInput.removeEventListener('change', this.emitChangeEvent)
      oldInput.remove()
    }

    newInput.addEventListener('change', this.emitChangeEvent, {
      passive: true,
    })

    if (this.value) newInput.value = this.value
    if (this.min) newInput.min = this.min
    if (this.max) newInput.max = this.max
    if (this.step) newInput.step = this.step

    return newInput
  }

  private emitChangeEvent() {
    this.dispatchEvent(
      new MessageEvent<AfixRangeSliderChange>('change', {
        data: {
          value: (+this.value).toFixed(getFractionDigits(this.step)),
          rawValue: +this.value,
        },
        bubbles: true,
      })
    )
  }

  private getState(): State {
    const { width, height } = this.getBoundingClientRect()
    return {
      width,
      height,
      min: +this.min,
      max: +this.max,
      value: +this.value,
    }
  }

  private handleWheel(e: WheelEvent) {
    e.preventDefault()

    this.handleMove(e.deltaX, e.deltaY, this.getState())
  }

  private handlePointer(startEvent: PointerEvent) {
    const state = this.getState()
    const handlePointerMove = (e: PointerEvent) => {
      this.handleMove(
        startEvent.clientX - e.clientX,
        startEvent.clientY - e.clientY,
        state
      )
    }

    startEvent.preventDefault()
    this.setPointerCapture(startEvent.pointerId)

    this.addEventListener(
      'lostpointercapture',
      () => window.removeEventListener('pointermove', handlePointerMove),
      { passive: true, once: true }
    )

    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    })
  }

  private handleKeyboard(e: KeyboardEvent) {
    e.preventDefault()

    const delta =
      (e.shiftKey || /^Page(Up|Down)$/.test(e.key) ? 10 : 1) * +this.step

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
      case 'PageDown':
        this.value = String(minmax(+this.value - delta, +this.min, +this.max, +this.step))
        break
      case 'ArrowRight':
      case 'ArrowUp':
      case 'PageUp':
        this.value = String(minmax(+this.value + delta, +this.min, +this.max, +this.step))
        break
      case 'Home':
        this.value = this.min
        break
      case 'End':
        this.value = this.max
        break
    }
  }

  private handleMove(
    dx: number,
    dy: number,
    { height, width, min, max, value }: State
  ) {
    assert(
      typeof dx === 'number' && typeof dy === 'number',
      'handleMove was called without dx or dy!'
    )
    const [length, delta] = height > width ? [height, dy] : [width, -dx]

    const newPixelPosition = (length / max) * value + delta

    const newValue = minmax(
      (newPixelPosition / length) * max,
      min,
      max
    ).toFixed(+this.step)
    this.value = newValue

    this.inputEl.value = newValue

    this.emitChangeEvent()
  }

  // implements the slider role
  // https://www.w3.org/TR/wai-aria-1.1/#slider
  private updateAccessibilityModel({
    min,
    max,
    value,
    vertical,
  }: {
    min?: string | number
    max?: string | number
    value?: string | number
    vertical?: string | null
  }) {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'slider')
    }

    if (typeof min !== 'undefined') {
      this.setAttribute('aria-valuemin', String(min))
    }

    if (typeof max !== 'undefined') {
      this.setAttribute('aria-valuemax', String(max))
    }

    if (typeof value !== 'undefined') {
      this.setAttribute('aria-valuenow', String(value))
    }

    if (typeof vertical !== 'undefined') {
      this.setAttribute(
        'aria-orientation',
        vertical === '' ? 'vertical' : 'horizontal'
      )
    }
  }
}

customElements.define('afix-range-slider', AfixRangeSlider)

export default AfixRangeSlider
