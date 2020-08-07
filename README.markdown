# Range Slider

An accessible and flexible range slider web component.

<div style="text-align: center">
  <a href="https://blog.lukechannings.com/vertical-range-slider/#hsl"><img src="screenshots/hsl.png" alt="HSL" width="25%" /></a>
  <a href="https://blog.lukechannings.com/vertical-range-slider/#rgb"><img src="screenshots/rgb.png" alt="RGB" width="25%" /></a>
  <a href="https://blog.lukechannings.com/vertical-range-slider/example.html"><img src="screenshots/borders.png" alt="With borders" width="32%" /></a>
</div>

## Attributes

| Name               | Type            | Description                                                                                                    | 
|--------------------|-----------------|----------------------------------------------------------------------------------------------------------------| 
| value              | number          | The current value of the input                                                                                 | 
| shadow-value       | number          | A secondary value shown with the value. `color` should be set to something semi-transparent with this setting. | 
| min                | number          | The minimum permitted value                                                                                    | 
| max                | number          | The maximum permitted value                                                                                    | 
| step               | number          | The stepping interval, used both for user interface and validation purposes                                    | 
| position-indicator | *bar* or *line* | The style of the position indicator, either a solid bar or a line.                                             | 
| horizontal         | boolean         | The input should be displayed horizontally. Vertical by default                                                | 


## CSS Variables

| Name                   | Default                            | Description                              | 
|------------------------|------------------------------------|------------------------------------------| 
| color                  | currentColor                       | The track color                          | 
| --rangeTrackImage      | none                               | The `background-image` for the track     | 
| --rangeWidth           | 3.75rem vertical, 12rem horizontal | Width of the range                       | 
| --rangeHeight          | 10rem vertical, 3.75rem horizontal | Height of the range                      | 
| --rangeBackgroundColor | rgba(0, 0, 0, 0.8)                 | `background-color` for the range element | 
| --rangeBackgroundImage | none                               | `background-image` for the range element | 
| --rangeBorder          | none                               | `border` for the range element           | 


## Events

### `change`

A [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) where the shape of `detail` conforms to the following interface:

```typescript
interface RangeSliderChange {
  // Good for presenting to the user - The boundedValue to a fixed number of places based on the step attribute.
  value: number;
  // Good for using in calculations, more precise than value - the raw input value after minmax(value)
  boundedValue: number;
  // the bounded value after Math.round()
  roundedValue: number;
}
```
