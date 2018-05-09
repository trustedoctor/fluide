import { debounce } from '../helpers'
import Scrollbar from './main'

export default class Events {
  private scrollbar: Scrollbar
  private currentY: number
  private distance: number

  private isMac: RegExpMatchArray = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)

  private isScroling: boolean = false
  private isWheeling: NodeJS.Timer = null

  // TODO: react on scroll changed by user (element.scrollTop = (...)), by binding event listener

  constructor(scrollbar: Scrollbar) {
    this.scrollbar = scrollbar

    this.scrollbar.el.onwheel = event => this.mouseWheel(event)
    this.scrollbar.scroll.onwheel = event => this.mouseWheel(event)
    this.scrollbar.bar.onmousedown = event => this.mouseDown(event)
    this.scrollbar.el.onscroll = event => this.userScrolled(event)

    document.onmouseup = event => this.mouseUp(event)
    window.onresize = event => this.scrollbar.calculateSizes.call(scrollbar)
  }

  private mouseDown(this: Events, event: MouseEvent) {
    this.isScroling = true
    this.distance = 0
    this.currentY = event.pageY
    document.onmousemove = e => this.mouseMove(e)
  }

  private mouseMove(this: Events, event: MouseEvent) {
    event.preventDefault()

    const distance = event.pageY - this.currentY
    this.currentY = event.pageY

    if (distance !== this.distance) {
      this.distance = distance
      this.scrollbar.move(this.distance)
    }
  }

  private mouseWheel(this: Events, event: WheelEvent) {
    event.preventDefault()
    this.isScroling = true;

    let distance = null
    if (this.isMac) {
      distance = event.deltaY * 0.1
    } else {
      distance = event.deltaY
    }

    if (distance !== this.distance) {
      this.distance = distance
      this.scrollbar.move(this.distance)
    }

    clearTimeout(this.isWheeling)
    this.isWheeling = setTimeout(() => {
      this.isScroling = false;
    }, 250)
  }

  private mouseUp(this: Events, event: MouseEvent) {
    document.onmousemove = null
    this.distance = 0

    this.isScroling = false
  }

  private userScrolled(this: Events, event: UIEvent) {
    if (!this.isScroling) {
      const position = this.scrollbar.el.scrollTop
      this.scrollbar.setBarPosition(position)
    }
  }
}
