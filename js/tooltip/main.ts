import Module from '../module';

export default class Tooltip extends Module {
  private tooltip: HTMLElement

  constructor(el: HTMLElement | string) {
    super(el)

    this.el.onmouseenter = (event) => this.mouseEnter(event)
    this.el.onmouseleave = (event) => this.mouseLeave(event)
  }

  private mouseEnter(this: Tooltip, event: UIEvent) {
    const text = this.el.getAttribute('alt')

    this.tooltip = document.createElement('div')
    this.tooltip.className = 'tooltip'
    this.tooltip.innerHTML = text

    this.el.parentElement.insertBefore(this.tooltip, this.el.nextSibling)

    const { left, top } = this.getPosition()
    this.tooltip.style.left = left + 'px'
    this.tooltip.style.top = top + 'px'
  }

  private mouseLeave(this: Tooltip, event: UIEvent) {
    this.el.parentElement.removeChild(this.tooltip)
  }

  private getPosition() {
    const left = this.el.offsetLeft + (this.el.clientWidth / 2) - (this.tooltip.clientWidth / 2)
    const top = this.el.offsetTop + this.el.clientHeight + 5

    return {
      left, top,
    }
  }

}
