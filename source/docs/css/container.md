---
layout: doc
type: css
order: 1
title: Container
submenu:
  Details: Details
  Basic usage: Basic-usage
  Fluid: Fluid
  Full: Full
  SCSS variables: SCSS-variables
---

### Details
**Default container `max-width` is `1200px`**

You can change it, if you use `SCSS` version of fluide by setting variable before mixins.
```scss
$global-width: 1200px;
```

### Basic usage
```html
<div class="container"></div>
```

### Fluid

After adding class `fluid` to `container` it will have `100%` width but with margins on left and right side.

```html
<div class="container fluid"></div>
```

Default margin is `10px`, you can change it by setting variable:
```scss
$grid-column-gutter: 10px;
```

### Full

After adding class `full` to `container` it will have `100%` width.

```html
<div class="container full"></div>
```

### SCSS variables
| Variable                    | Default value                                                                  |
| --------------------------- |--------------------------------------------------------------------------------|
| `$global-width`             | `1200px`                                                                       |