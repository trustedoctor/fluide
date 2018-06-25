---
layout: doc
type: css
order: 2
title: Arrangement
submenu:
  Details: Details
  Grid order: Grid-order
  Text: Text-alignment
---

### Details
Arrangement classes that you can use with fluide. 

### Grid order
{% code html %}
<div class="row row-margin grid-example">
  <div class="small-12 large-6 small-order-1 large-order-2 cell"><div>small-12 small-order-1 large-order-2 large-6</div></div>
  <div class="small-12 large-6 small-order-2 large-order-1 cell"><div>small-12 small-order-2 large-order-1 large-6</div></div>
</div>
{% endcode %}

### Text alignment
{% code html %}
<div class="row row-margin grid-example">
  <div class="small-12 large-6 text-left large-text-center cell"><div>text-left large-text-center</div></div>
  <div class="small-12 large-6 text-right large-text-left cell"><div>text-right large-text-left</div></div>
</div>
{% endcode %}