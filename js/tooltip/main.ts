import Module from '../module';

enum Position {
  TOP, BOTTOM, LEFT, RIGHT, CLASS,
}

export default class Tooltip extends Module {
  public static Position = Position

  private tooltip: HTMLElement
  private position: Position

  constructor(el: HTMLElement | string, position: Position = Position.CLASS) {
    super(el)

    if (position === Position.CLASS) {
      if (this.el.className.indexOf('tooltip-top') > -1) {
        this.position = Position.TOP
      } else if (this.el.className.indexOf('tooltip-left') > -1) {
        this.position = Position.LEFT
      } else if (this.el.className.indexOf('tooltip-right') > -1) {
        this.position = Position.RIGHT
      } else {
        this.position = Position.BOTTOM
      }
    } else {
      this.position = position
    }

    this.el.onmouseenter = (event) => this.mouseEnter(event)
    this.el.onmouseleave = (event) => this.mouseLeave(event)
  }

  private mouseEnter(this: Tooltip, event: UIEvent) {
    const text = this.el.getAttribute('alt')

    this.tooltip = document.createElement('div')
    this.tooltip.className = 'tooltip'
    this.tooltip.innerHTML = text

    this.el.parentElement.insertBefore(this.tooltip, this.el.nextSibling)

    const { left, top } = this.calculatePosition()
    this.tooltip.style.left = left + 'px'
    this.tooltip.style.top = top + 'px'
  }

  private mouseLeave(this: Tooltip, event: UIEvent) {
    this.el.parentElement.removeChild(this.tooltip)
  }

  private calculatePosition() {
    let left
    let top

    if (this.position === Position.BOTTOM) {
      left = this.el.offsetLeft + (this.el.clientWidth / 2) - (this.tooltip.clientWidth / 2)
      top = this.el.offsetTop + this.el.clientHeight + 5
    } else if (this.position === Position.TOP) {
      left = this.el.offsetLeft + (this.el.clientWidth / 2) - (this.tooltip.clientWidth / 2)
      top = this.el.offsetTop - this.tooltip.clientHeight - 5
    } else if (this.position === Position.LEFT) {
      left = this.el.offsetLeft - this.tooltip.clientWidth - 5
      top = this.el.offsetTop + (this.el.clientHeight / 2) - (this.tooltip.clientHeight / 2)
    } else if (this.position === Position.RIGHT) {
      left = this.el.offsetLeft + this.el.clientWidth + 5
      top = this.el.offsetTop + (this.el.clientHeight / 2) - (this.tooltip.clientHeight / 2)
    }

    return {
      left, top,
    }
  }

}
