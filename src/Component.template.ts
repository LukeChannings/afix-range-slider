import { assert } from './Component.utils'

export const template = html`
  <template>
    <div class="slider" part="root">
      <slot name="input">
        <input type="range" />
      </slot>
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

      :host(:focus),
      :host(:focus-within) {
        outline-color: -webkit-focus-ring-color;
        outline-style: auto;
        outline-width: 5px;
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

      .track[part='comparison-value'] {
        background-color: var(--a-range-slider-comparison-value-color, #fd892e);
        transform: translateY(calc(100% - var(--comparison-value)));
      }

      .track[part='value'] {
        transform: translateY(calc(100% - var(--value)));
      }

      :host(:not([line-style])) .track[part='value'] {
        background-color: var(--afix-range-slider-value-color, currentColor);
      }

      :host([line-style]) .track[part='value']::after {
        position: absolute;
        content: '';
        display: block;
        background: var(--afix-range-slider-track-line-color, currentColor);
        width: 100%;
        height: 2px;
        left: 0;
        top: -1px;
      }

      :host([horizontal][line-style]) .track[part='value']::after {
        top: 0;
        left: auto;
        right: -1px;
        height: 100%;
        width: 2px;
      }

      :host(:not([comparison-value])) .track[part='comparison-value'] {
        display: none;
      }

      :host([horizontal]) .track[part='value'] {
        transform: translateX(calc(-100% + var(--value)));
      }

      :host([horizontal]) .track[part='comparison-value'] {
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
`

function html(tagString: TemplateStringsArray): HTMLTemplateElement {
  const div = document.createElement('div')
  div.innerHTML = String.raw(tagString)
  assert(div.firstElementChild instanceof HTMLTemplateElement)
  return div.firstElementChild
}
