---
layout: doc
type: css
order: 2
title: Grid
submenu:
  Details: Details
  Responsive: Responsive
  Basic usage: Basic-usage
  Margins between cells: Margins-between-cells
  SCSS variables: SCSS-variables
---

### Details
Grid is based on **Flexbox**.

### Responsive

| Breakpoint class | Breakpoint minimal width |
| ---------------- |--------------------------|
| `small-#`        | `> 0px`                  |
| `medium-#`       | `> 640px`                |
| `large-#`        | `> 1024px`               |
| `xlarge-#`       | `> 1200px`               |

### Basic usage
{% code html %}
<div class="row">
  <div class="small-12 large-6 cell"><div>small-12 large-6</div></div>
  <div class="small-12 large-6 cell"><div>small-12 large-6</div></div>
</div>
{% endcode %}

### Margins between cells
{% code html %}
<div class="row row-margin">
  <div class="small-12 large-6 cell"><div>small-12 large-6</div></div>
  <div class="small-12 large-6 cell"><div>small-12 large-6</div></div>
</div>
{% endcode %}

### SCSS variables
| Variable                    | Default value                                                                  |
| --------------------------- |--------------------------------------------------------------------------------|
| `$grid-columns`             | `12`                                                                           |
| `$grid-column-gutter`       | `10px`                                                                         |
| `$grid-breakpoints`         | `( small: 0, medium: 640px, large: 1024px, xlarge: 1200px, xxlarge: 1440px, )` |
| `$grid-breakpoints-classes` | `( medium, large, xlarge, )`                                                   |