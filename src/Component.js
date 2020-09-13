const { min, max, round } = Math;

const template = html`
  <template>
    <div class="slider" part="root">
      <input class="input" type="range" />
      <div class="track value" part="track"></div>
      <div class="track shadow-value --bar" part="shadow-track"></div>
    </div>
    <style>
      .slider {
        --width: var(--afix-range-slider-width, 4rem);
        --height: var(--afix-range-slider-height, 12rem);

        background-color: var(
          --afix-range-slider-background-color,
          rgba(0, 0, 0, 0.8)
        );
        background-image: var(--afix-range-slider-background-image, none);
        border: var(--afix-range-slider-border, none);
        width: var(--width);
        height: var(--height);
        margin: 0;
        position: relative;
        transition: transform ease-in-out 100ms;
        overflow: hidden;
        clip-path: border-box;
      }

      .slider:focus-within {
        transform: scale(1.05);
        outline-color: -webkit-focus-ring-color;
        outline-style: auto;
        outline-width: 5px;
      }

      :host([horizontal]) .slider {
        --width: var(--afix-range-slider-width, 12rem);
        --height: var(--afix-range-slider-height, 4rem);
      }

      .--vertical {
        cursor: ns-resize;
        border-radius: calc(var(--width) / 6);
      }

      .--horizontal {
        cursor: ew-resize;
        border-radius: calc(var(--height) / 6);
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
        background-color: var(
          --afix-range-slider-track-background-color,
          currentColor
        );
        background-image: var(--afix-range-slider-track-background-image);
      }

      .track.--line::after {
        position: absolute;
        content: "";
        display: block;
        background: var(--afix-range-slider-track-line-color, #fff);
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
        transform: translateY(calc(100% - var(--afix-value)));
      }
      .--vertical .track.shadow-value {
        transform: translateY(calc(100% - var(--afix-shadow-value)));
        transition: transform 100ms linear;
      }
      .--horizontal .track.value {
        transform: translateX(calc(-100% + var(--afix-value)));
      }
      .--horizontal .track.shadow-value {
        transform: translateX(calc(-100% + var(--afix-shadow-value)));
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
    this.sliderEl = notNull(
      this.shadowRoot.querySelector(".slider"),
      new Error(".slider wasnt defined")
    );

    /** @type {HTMLInputElement} */
    this.inputEl = notNull(
      this.shadowRoot.querySelector(".input"),
      new Error(".input wasnt defined")
    );

    /** @type {HTMLElement} */
    this.trackEl = notNull(
      this.shadowRoot.querySelector(".track"),
      new Error(".track wasnt defined")
    );

    this.setName(this.getAttribute("name"));
    this.min = Number(this.getAttribute("min"));
    this.max = Number(this.getAttribute("max"));
    this.step = Number(this.getAttribute("step") || "1");

    this.setValue(Number(this.getAttribute("value")));
    this.setShadowValue(Number(this.getAttribute("shadow-value") || "0"));

    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(() => this.setAspectRatio());
      this.resizeObserver.observe(this.sliderEl);
    }

    this.setAspectRatio();
    this.initializeInput();
    this.initializeSlider();
  }

  setAspectRatio() {
    const { width, height } = this.sliderEl.getBoundingClientRect();

    this.deltaYMax = height;
    this.deltaXMax = width;

    if (width > height) {
      this.aspect = "horizontal";
      this.sliderEl.classList.remove("--vertical");
      this.sliderEl.classList.add("--horizontal");
    } else {
      this.aspect = "vertical";
      this.sliderEl.classList.remove("--horizontal");
      this.sliderEl.classList.add("--vertical");
    }
  }

  initializeInput() {
    if (!(this.inputEl instanceof HTMLInputElement)) {
      throw new Error("Failed to get a handle for inputEl.");
    }

    this.inputEl.min = String(this.min);
    this.inputEl.max = String(this.max);

    this.inputEl.addEventListener(
      "change",
      () => this.setValue(Number(this.inputEl.value)),
      { passive: true }
    );

    this.sliderEl.addEventListener("wheel", (e) => {
      e.preventDefault();
      let delta;

      if (this.aspect === "vertical") {
        delta = (e.deltaY * this.step) / (this.deltaYMax || 1);
      } else {
        delta = (-e.deltaX * this.step) / (this.deltaXMax || 1);
      }

      this.setValue((this.value || 0) + delta * (this.max - this.min));
    });
  }

  initializeSlider() {
    const positionIndicatorStyle =
      this.getAttribute("position-indicator") || "bar";

    if (positionIndicatorStyle === "line") {
      this.trackEl.classList.add("--line");
    } else {
      this.trackEl.classList.add("--bar");
    }

    /** @type {boolean} */
    let hasPointerCapture = false;
    /** @type {number | null} */
    this.lastX = null;
    /** @type {number | null} */
    this.lastY = null;

    this.sliderEl.addEventListener("touchstart", (e) => e.preventDefault());

    this.sliderEl.addEventListener(
      "pointerdown",
      (e) => {
        if (e.button === 2) return;
        this.sliderEl.setPointerCapture(e.pointerId);
        hasPointerCapture = true;
        this.lastX = e.x;
        this.lastY = e.y;
      },
      { passive: true }
    );

    window.addEventListener(
      "pointermove",
      (e) => {
        if (
          hasPointerCapture &&
          typeof this.lastX === "number" &&
          typeof this.lastY === "number"
        ) {
          const deltaX = this.lastX - e.x;
          const deltaY = this.lastY - e.y;

          this.lastX = e.x;
          this.lastY = e.y;

          let delta;

          if (this.aspect === "vertical") {
            delta = deltaY / (this.deltaYMax || 1);
          } else {
            delta = -deltaX / (this.deltaXMax || 1);
          }

          this.setValue((this.value || 0) + delta * (this.max - this.min));
        }
      },
      { passive: true }
    );

    this.sliderEl.addEventListener(
      "lostpointercapture",
      () => {
        this.lastX = null;
        this.lastY = null;
        hasPointerCapture = false;
      },
      { passive: true }
    );
  }

  /**
   *
   * @param {number} value
   */
  setValue(value) {
    const boundedValue = max(this.min, min(this.max, value));
    const roundedValue = round(boundedValue);

    if (this.value === boundedValue) {
      return;
    }

    this.inputEl.value = String(roundedValue);
    this.sliderEl.style.setProperty(
      "--afix-value",
      ((boundedValue - this.min) / (this.max - this.min)) * 100 + "%"
    );
    /** @type {number} */
    this.value = boundedValue;
    this.setAttribute("value", String(boundedValue));
    const fractionDigits =
      this.step % 1 > 0 ? String(this.step).replace(/^.+?\./, "").length : 0;
    this.dispatchEvent(
      new MessageEvent("change", {
        bubbles: true,
        data: {
          value: Number(boundedValue.toFixed(fractionDigits)),
          rawValue: boundedValue,
        },
      })
    );
  }

  /**
   *
   * @param {number} shadowValue
   */
  setShadowValue(shadowValue) {
    this.shadowValue = shadowValue;
    this.sliderEl.style.setProperty(
      "--afix-shadow-value",
      Math.min(100, ((shadowValue - this.min) / (this.max - this.min)) * 100) +
        "%"
    );
  }

  /**
   *
   * @param {*} name
   */
  setName(name) {
    this.name = name;
    this.inputEl.name = name;
  }

  static get observedAttributes() {
    return ["value", "shadow-value", "min", "max", "step", "name"];
  }

  /**
   * @param {string} name
   * @param {string} _
   * @param {string} newValue
   */
  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "value":
        this.setValue(Number(newValue));
        break;
      case "shadow-value":
        this.setShadowValue(Number(newValue));
        break;
      case "name": {
        this.setName(newValue);
        break;
      }
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
