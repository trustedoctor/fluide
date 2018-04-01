import Scrollbar from "./main"

export default class Events {
  private scrollbar: Scrollbar
  private currentY: number
  private distance: number

  private isMac: RegExpMatchArray = navigator.platform.match(
    /(Mac|iPhone|iPod|iPad)/i
  )

  private isScroling: boolean = false
  private isWheeling: number = null

  // TODO: react on scroll changed by user (element.scrollTop = (...)), by binding event listener

  constructor(scrollbar: Scrollbar) {
    this.scrollbar = scrollbar

    this.scrollbar.el.onwheel = event => this.mouseWheel(event)
    this.scrollbar.scroll.onwheel = event => this.mouseWheel(event)
    this.scrollbar.bar.onmousedown = event => this.mouseDown(event)
    document.onmouseup = event => this.mouseUp(event)

    this.scrollbar.el.onscroll = event => this.userScrolled(event)
  }

  mouseDown(this: Events, event: MouseEvent) {
    this.isScroling = true
    this.distance = 0
    this.currentY = event.pageY
    document.onmousemove = event => this.mouseMove(event)
  }

  mouseMove(this: Events, event: MouseEvent) {
    event.preventDefault()

    let distance = event.pageY - this.currentY
    this.currentY = event.pageY

    if (distance != this.distance) {
      this.distance = distance
      this.scrollbar.move(this.distance)
    }
  }

  mouseWheel(this: Events, event: WheelEvent) {
    event.preventDefault()
    this.isScroling = true;

    let distance = null
    if (this.isMac) {
      distance = event.deltaY * 0.05
    } else {
      distance = event.deltaY
    }

    if (distance != this.distance) {
      this.distance = distance
      this.scrollbar.move(this.distance)
    }

    clearTimeout(this.isWheeling)
    this.isWheeling = setTimeout(() => {
      this.isScroling = false;
    }, 250)
  }

  mouseUp(this: Events, event: MouseEvent) {
    document.onmousemove = null
    this.distance = 0

    this.isScroling = false
  }

  userScrolled(this: Events, event: UIEvent) {
    if(!this.isScroling) {
      let position = this.scrollbar.el.scrollTop
      this.scrollbar.setBarPosition(position)
    }
  }
}
