# Range Slider

An accessible and flexible range slider web component.

<div style="text-align: center">
  <a href="https://blog.lukechannings.com/afix-range-slider/#hsl"><img src="screenshots/hsl.png" alt="HSL" width="25%" /></a>
  <a href="https://blog.lukechannings.com/afix-range-slider/#rgb"><img src="screenshots/rgb.png" alt="RGB" width="25%" /></a>
  <a href="https://blog.lukechannings.com/afix-range-slider/#complex"><img src="screenshots/borders.png" alt="With borders" width="33.15%" /></a>
</div>

## Using it

Via a script tag,

```html
<script
  src="https://cdn.skypack.dev/afix-range-slider@latest"
  type="module"
></script>
```

Or install with

```bash
npm install afix-range-slider
```

And use like this

```js
import "afix-range-slider"`
```

`<afix-range-slider value="50" min="25" max="75" />`

## Browser Support

This component depends on the following features.

- [CSS Custom Properties](https://caniuse.com/#feat=custom-elementsv1)
- [Web Components](https://caniuse.com/#feat=custom-elementsv1)
- [JavaScript modules](https://caniuse.com/#feat=es6-module) _Optional_

All modern browsers have supported these features for some time. If you need IE support you will need to look elsewhere.

## Attributes

| Name         | Type    | Description                                                                                                    |
| ------------ | ------- | -------------------------------------------------------------------------------------------------------------- |
| value        | number  | The current value of the input                                                                                 |
| shadow-value | number  | A secondary value shown with the value. `color` should be set to something semi-transparent with this setting. |
| min          | number  | The minimum permitted value                                                                                    |
| max          | number  | The maximum permitted value                                                                                    |
| step         | number  | The stepping interval, used both for user interface and validation purposes                                    |
| line-style   | boolean | When set, the position will be shown as a line. Bar by default                                                 |
| horizontal   | boolean | The input should be displayed horizontally. Vertical by default                                                |

### CSS Custom Properties

Remember **all custom properties are prefixed with the component name**. e.g. `background-color` is `--afix-range-slider-background-color`.

| Name                   | Default                            | Description                                          |
| ---------------------- | ---------------------------------- | ---------------------------------------------------- |
| track-background-color | currentColor                       | The track color                                      |
| track-background-image | none                               | The `background-image` for the track                 |
| track-line-color       | none                               | The color of the line when position-indicator="line" |
| width                  | 3.75rem vertical, 12rem horizontal | Width of the range                                   |
| height                 | 10rem vertical, 3.75rem horizontal | Height of the range                                  |
| background-color       | rgba(0, 0, 0, 0.8)                 | `background-color` for the range element             |
| background-image       | none                               | `background-image` for the range element             |
| border                 | none                               | `border` for the range element                       |
| comparison-label-color | white                              |                                                      |

## Events

### `change`

A [MessageEvent](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent) where the shape of `data` conforms to the following interface:

```typescript
interface RangeSliderChange {
  // Good for presenting to the user - The boundedValue to a fixed number of places based on the step attribute.
  value: number;
  // Good for using in calculations, more precise than value - the raw input value after minmax(value)
  rawValue: number;
}
```
