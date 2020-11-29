import { assert } from './Component.utils'

export const template = html`
  <template>
    <div class="slider" part="root">
      <slot name="input">
        <input type="range" />
      </slot>
      <div class="track" part="comparison-value"></div>
      <div class="track" part="value"></div>
      <slot name="icon"></slot>
    </div>
    <style>
      input,
      ::slotted(input),
      :host(input) {
        clip: rect(1px, 1px, 1px, 1px);
        clip-path: inset(50%);
        height: 1px;
        width: 1px;
        margin: -1px;
        overflow: hidden;
        position: absolute;
      }

      :host {
        display: inline-block;
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

      :host([vertical]) {
        width: 2rem;
        height: 12rem;
        cursor: ns-resize;
      }

      :host(:not([vertical])) {
        cursor: ew-resize;
        width: 12rem;
        height: 2rem;
      }

      :host([comparison-label])::after {
        display: block;
        position: absolute;
        left: 0;
        content: attr(comparison-value);
        color: var(--afix-range-slider-comparison-label-color, #fff);
        width: 100%;
        mix-blend-mode: difference;
      }

      :host([comparison-label][vertical])::after {
        transform: translateY(
          clamp(0%, calc(105% - var(--comparison-value)), 85%)
        );
        top: 0;
        height: 100%;
        text-align: center;
      }

      :host([comparison-label]:not([vertical]))::after {
        transform: translateX(
            clamp(5%, calc(var(--comparison-value) - 15%), 85%)
          )
          translateY(-50%);
        top: 50%;
        text-align: left;
      }

      .slider {
        width: 100%;
        height: 100%;
        position: relative;
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
        background-color: var(--ars-comparison-value-color, #fd892e);
      }

      :host(:not([comparison-value])) .track[part='comparison-value'] {
        display: none;
      }

      :host([vertical]) .track[part='comparison-value'] {
        transform: translateY(calc(100% - var(--comparison-value)));
      }

      :host(:not([vertical])) .track[part='comparison-value'] {
        transform: translateX(calc(-100% + var(--comparison-value)));
      }

      :host([vertical]) .track[part='value'] {
        transform: translateY(calc(100% - var(--value)));
      }

      :host(:not([vertical])) .track[part='value'] {
        transform: translateX(calc(-100% + var(--value)));
      }

      :host(:not([line-style])) .track[part='value'] {
        background-color: var(--afix-range-slider-value-color, currentColor);
      }

      :host([line-style]) .track[part='value'] {
        height: calc(100% - 2px);
      }

      :host([line-style]) .track[part='value']::after {
        position: absolute;
        content: '';
        display: block;
        background: var(--afix-range-slider-track-line-color, currentColor);
      }

      :host([vertical][line-style]) .track[part='value']::after {
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
      }

      :host(:not([vertical])[line-style]) .track[part='value'] {
        width: calc(100% - 2px);
        height: 100%;
      }

      :host(:not([vertical])[line-style]) .track[part='value']::after {
        top: 0;
        right: -2px;
        height: 100%;
        width: 2px;
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
