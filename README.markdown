# Vertical Range Slider

Zero-dependency recreation of the iOS vertical range slider. Uses a range input as an accessibility base. Supports scroll events and pointer events. (It also bounces a little when you touch it.)

![Brightness Slider screenshot](./screenshot.png)

## Markup

### Minimal structure

```html
<div class="rangeSlider">
  <div class="rangeSlider__track"></div>
  <input type="range" class="rangeSlider__input" min="0" max="100" value="50" />
</div>
```

### Optional value label

```html
<div class="rangeSlider">
  <div class="rangeSlider__track"></div>
  <div class="rangeSlider__value"></div>
  <input type="range" class="rangeSlider__input" min="0" max="100" value="50" />
</div>
```

### Optional icon

```html
<div class="rangeSlider">
  <div class="rangeSlider__track"></div>
  <div class="rangeSlider__icon" data-type="brightness"></div>
  <input type="range" class="rangeSlider__input" min="0" max="100" value="50" />
</div>
```

## CSS Variable configurations

- `--rangeInputColor`: Change the background colour of the input (default: `rgba(0, 0, 0, 0.8)`)
- `--rangeInputTrackColor`: Change the range track colour (default: `#fff`)
- `--rangeInputWidth`: Change the input width (default `3.75rem`, usually `60px`)
- `--rangeInputHeight`: Change the input height (default: `2.66 * width`.)
- `--rangeInputIconSize`: Change the icon size (default: `width / 3` )
