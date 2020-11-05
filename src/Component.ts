import { template } from "./Component.template";
import {
  bindAttributes,
  assert,
  minmax,
  getFractionDigits,
} from "./Component.utils";

export interface AfixRangeSliderChange {
  value: string;
  rawValue: number;
}

interface State {
  width: number;
  height: number;
  min: number;
  max: number;
  value: number;
}

export class AfixRangeSlider extends HTMLElement {
  shadowRoot!: ShadowRoot & HTMLElement;
  inputEl: HTMLInputElement;
  inputSlotEl: HTMLSlotElement | null;

  value!: string;
  step!: string;
  min!: string;
  max!: string;
  name?: string;
  comparisonValue?: string;

  static observedAttributes = [
    "value",
    "step",
    "min",
    "max",
    "name",
    "comparison-value",
    "horizontal",
  ];

  constructor() {
    super();

    bindAttributes(this, AfixRangeSlider.observedAttributes, {
      value: "100",
      min: "0",
      max: "100",
      step: "1",
    });

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );

    this.inputEl = this.configureInput(this.shadowRoot.querySelector("input"));

    this.inputSlotEl = this.shadowRoot.querySelector("slot[name=input]");
    this.inputSlotEl?.addEventListener("slotchange", () => {
      const assigned = this.inputSlotEl?.assignedElements();
      assert(!!assigned && assigned.length !== 0);
      this.inputEl = this.configureInput(assigned[0], this.inputEl);
    });

    if (!this.hasAttribute("tabindex")) {
      this.tabIndex = 0;
    }

    this.updateAccessibilityModel(this.getState());

    this.addEventListener("wheel", this.handleWheel);
    this.addEventListener("pointerdown", this.handlePointer);
    this.addEventListener("touchstart", (e) => e.preventDefault());
    this.addEventListener("keydown", this.handleKeyboard);
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    if (name === "value" || name === "comparison-value") {
      this.style.setProperty(
        "--" + name,
        minmax(
          ((+newValue - +this.min) / +this.max) * 100,
          +this.min,
          +this.max
        ) + "%"
      );
    }

    if (name === 'horizontal') {
      this.updateAccessibilityModel(this.getState());
    }
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
    assert(newInput instanceof HTMLInputElement);

    if (oldInput) {
      oldInput.removeEventListener("change", this.emitChangeEvent);
      oldInput.remove();
    }

    newInput.addEventListener("change", this.emitChangeEvent, {
      passive: true,
    });

    if (this.value) newInput.value = this.value;
    if (this.min) newInput.min = this.min;
    if (this.max) newInput.max = this.max;
    if (this.step) newInput.step = this.step;
    if (this.name) newInput.name = this.name;

    return newInput;
  }

  private emitChangeEvent() {
    this.dispatchEvent(
      new MessageEvent<AfixRangeSliderChange>("change", {
        data: {
          value: (+this.value).toFixed(getFractionDigits(this.step)),
          rawValue: +this.value,
        },
        bubbles: true,
      })
    );
  }

  private getState(): State {
    const { width, height } = this.getBoundingClientRect();
    return {
      width,
      height,
      min: +this.min,
      max: +this.max,
      value: +this.value,
    };
  }

  private handleWheel(e: WheelEvent) {
    e.preventDefault();
    this.handleMove(e.deltaX, e.deltaY, this.getState());
  }

  private handlePointer(startEvent: PointerEvent) {
    const state = this.getState();
    const handlePointerMove = (e: PointerEvent) =>
      this.handleMove(
        startEvent.clientX - e.clientX,
        startEvent.clientY - e.clientY,
        state
      );

    startEvent.preventDefault();
    this.setPointerCapture(startEvent.pointerId);

    this.addEventListener(
      "lostpointercapture",
      () => window.removeEventListener("pointermove", handlePointerMove),
      { passive: true, once: true }
    );

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
  }

  private handleKeyboard(e: KeyboardEvent) {
    e.preventDefault();

    const delta =
      (e.shiftKey || /^Page(Up|Down)$/.test(e.key) ? 10 : 1) * +this.step;

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
      case "PageDown":
        this.value = String(minmax(+this.value - delta, +this.min, +this.max));
        break;
      case "ArrowRight":
      case "ArrowUp":
      case "PageUp":
        this.value = String(minmax(+this.value + delta, +this.min, +this.max));
        break;
      case "Home":
        this.value = this.min;
        break;
      case "End":
        this.value = this.max;
        break;
    }
  }

  private handleMove(
    dx: number,
    dy: number,
    { height, width, min, max, value }: State
  ) {
    const [length, delta] = height > width ? [height, dy] : [width, -dx];

    const newPixelPosition = (length / max) * value + delta;

    this.value = minmax((newPixelPosition / length) * max, min, max).toFixed(
      getFractionDigits(this.step)
    );

    this.inputEl.value = this.value;

    this.emitChangeEvent();
    this.updateAccessibilityModel({ height, width, min, max, value });
  }

  // implements the slider role
  // https://www.w3.org/TR/wai-aria-1.1/#slider
  private updateAccessibilityModel({
    min,
    max,
    value,
    width,
    height,
  }: State) {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "slider");
    }

    if (typeof min === 'number') {
      this.setAttribute("aria-valuemin", String(min));
    }

    if (typeof max === 'number') {
      this.setAttribute("aria-valuemax", String(max));
    }

    if (typeof value === 'number') {
      this.setAttribute("aria-valuenow", String(value));
    }

    this.setAttribute('aria-orientation', (width > height) ? 'horizontal' : 'vertical');
  }
}

customElements.define("afix-range-slider", AfixRangeSlider);

export default AfixRangeSlider;
