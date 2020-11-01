const template = html`
  <template>
    <div class="slider" part="root">
      <input type="range" />
      <div class="track" part="comparison-value"></div>
      <div class="track" part="value"></div>
    </div>
    <style>
      :host {
        display: inline-block;
        width: 2rem;
        height: 12rem;
        cursor: ns-resize;
        overflow: hidden;
        background-color: #c3d5df;
        box-sizing: border-box;
        position: relative;
      }

      :host([horizontal]) {
        cursor: ew-resize;
        width: 12rem;
        height: 2rem;
      }

      :host([comparison-label])::after {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        content: attr(comparison-value);
        color: var(--afix-range-slider-comparison-label-color, #fff);
        width: 100%;
        height: 100%;
        text-align: center;
        transform: translateY(
          clamp(0%, calc(105% - var(--comparison-value)), 85%)
        );
        mix-blend-mode: difference;
      }

      :host([comparison-label][horizontal])::after {
        transform: translateX(
            clamp(5%, calc(var(--comparison-value) - 15%), 85%)
          )
          translateY(-50%);
        top: 50%;
        height: auto;
        text-align: left;
      }

      .slider {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
      }

      :host(:focus),
      :host(:focus-within) {
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

      :host(:not([line-style])) .track[part="value"] {
        background-color: var(--afix-range-slider-value-color, currentColor);
      }

      :host([line-style]) .track[part="value"]::after {
        position: absolute;
        content: "";
        display: block;
        background: var(--afix-range-slider-track-line-color, currentColor);
        width: 100%;
        height: 2px;
        left: 0;
        top: -1px;
      }

      :host([horizontal][line-style]) .track[part="value"]::after {
        top: 0;
        left: auto;
        right: -1px;
        height: 100%;
        width: 2px;
      }

      :host(:not([comparison-value])) .track[part="comparison-value"] {
        display: none;
      }

      .track[part="comparison-value"] {
        background-color: var(--a-range-slider-comparison-value-color, #fd892e);
      }

      .track[part="value"] {
        transform: translateY(calc(100% - var(--value)));
      }
      :host([horizontal]) .track[part="value"] {
        transform: translateX(calc(-100% + var(--value)));
      }

      .track[part="comparison-value"] {
        transform: translateY(calc(100% - var(--comparison-value)));
      }
      :host([horizontal]) .track[part="comparison-value"] {
        transform: translateX(calc(-100% + var(--comparison-value)));
      }

      input {
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
`;

export class AfixRangeSlider extends HTMLElement {
  constructor() {
    super();

    /** @type {ShadowRoot & HTMLElement} */
    this.shadowRoot;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );

    /** @type {HTMLElement} */
    this.sliderEl = notNull(this.shadowRoot.querySelector(".slider"));

    /** @type {HTMLInputElement} */
    this.inputEl = notNull(this.shadowRoot.querySelector("input"));
    this.inputEl.addEventListener(
      "change",
      () => {
        this.dispatchEvent(
          new MessageEvent("change", {
            data: { value: this.value },
            bubbles: true,
          })
        );
      },
      {
        passive: true,
      }
    );

    bindAttributes(this, AfixRangeSlider.observedAttributes);
    /** @type {string} */ this.name;
    /** @type {string} */ this.value;
    /** @type {string} */ this.comparisonValue;
    /** @type {string} */ this.aspect;
    /** @type {string} */ this.step;
    /** @type {string} */ this.min;
    /** @type {string} */ this.max;

    this.inputEl.value = this.value;
    this.inputEl.min = this.min;
    this.inputEl.max = this.max;
    this.inputEl.step = this.step;
    this.inputEl.name = this.name;

    this.attributeChangedCallback("comparison-value", "", this.comparisonValue);

    this.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.handleMove(e.deltaX, e.deltaY, this.getContext());
    });

    this.addEventListener("touchstart", (e) => e.preventDefault());

    this.addEventListener("pointerdown", (startEvent) => {
      startEvent.preventDefault();
      this.setPointerCapture(startEvent.pointerId);

      this.addEventListener(
        "lostpointercapture",
        () => window.removeEventListener("pointermove", handleMove),
        { passive: true, once: true }
      );

      const ctx = this.getContext();

      /**
       *
       * @param {PointerEvent} e
       */
      const handleMove = (e) => {
        this.handleMove(
          startEvent.clientX - e.clientX,
          startEvent.clientY - e.clientY,
          ctx
        );
      };

      window.addEventListener("pointermove", handleMove, { passive: true });
    });
  }

  /**
   * @typedef {Object} Context
   * @property {number} width
   * @property {number} height
   * @property {number} min
   * @property {number} max
   * @property {number} step
   * @property {number} value
   *
   * @returns {Context}
   */
  getContext() {
    const { width, height } = this.getBoundingClientRect();
    const min = Number(this.min);
    const max = Number(this.max);
    const value = Number(this.value);
    const step = (this.step || "1").replace(".", "").length - 1;
    return { height, width, min, max, step, value };
  }

  /**
   *
   * @param {number} dx
   * @param {number} dy
   * @param {Context} context
   */
  handleMove(dx, dy, { height, width, min, max, step, value }) {
    const [length, delta] = height > width ? [height, dy] : [width, -dx];

    const newPixelPosition = (length / max) * value + delta;

    this.value = Number(Math.max(
      min,
      Math.min(max, (newPixelPosition / length) * max)
    ).toFixed(step));

    this.inputEl.value = this.value;

    this.dispatchEvent(
      new MessageEvent("change", { data: { value: this.value }, bubbles: true })
    );
  }

  static get observedAttributes() {
    return ["value", "comparison-value", "min", "max", "step", "name"];
  }

  /**
   * @param {string} name
   * @param {string} _
   * @param {string} newValue
   */
  attributeChangedCallback(name, _, newValue) {
    if (name === "value" || name === "comparison-value") {
      this.style.setProperty(
        "--" + name,
        Math.max(
          0,
          Math.min(100, ((+newValue - +this.min) / +this.max) * 100)
        ) + "%"
      );
    }
  }
}

export default AfixRangeSlider;

customElements.define("afix-range-slider", AfixRangeSlider);

/**
 * makeTemplate is a template tag used to construct a <template>.
 * @param {TemplateStringsArray} tagString
 */
function html(tagString) {
  const div = document.createElement("div");
  div.innerHTML = String.raw(tagString);
  return /** @type {HTMLTemplateElement} */ (notNull(div.firstElementChild));
}

/**
 * notNull - takes a value and returns it if it's not null, otherwise throws
 * @template T
 * @param {T | null} value A possibly null value
 * @param {Error=} error The error to throw if the value's null
 * @returns {T}
 */
function notNull(value, error = new Error()) {
  if (value === null) throw error;
  return value;
}

/**
 * ensures that the target's instance value and the attribute value are the same
 * @param {HTMLElement} target
 * @param {string[]} names
 */
function bindAttributes(target, names) {
  for (const name of names) {
    Object.defineProperty(target, toCamelCase(name), {
      get() {
        if (name === 'name') {
          return target.getAttribute(name);
        }
        return Number(target.getAttribute(name));
      },
      set(value) {
        target.setAttribute(name, value);
      },
    });
  }
}

/**
 *
 * @param {string} value
 */
function toCamelCase(value) {
  return value.replace(/([ -][a-z0-9])/g, (v) => v[1].toUpperCase());
}
