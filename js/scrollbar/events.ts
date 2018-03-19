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

    this.scrollbar.el.onwheel = event => this.mouseWheel(this, event)
    this.scrollbar.scroll.onwheel = event => this.mouseWheel(this, event)
    this.scrollbar.bar.onmousedown = event => this.mouseDown(this, event)
    document.onmouseup = event => this.mouseUp(this, event)

    this.scrollbar.el.onscroll = event => this.userScrolled(this, event)
  }

  mouseDown(_this: Events, event: MouseEvent) {
    _this.isScroling = true
    _this.distance = 0
    _this.currentY = event.pageY
    document.onmousemove = event => _this.mouseMove(_this, event)
  }

  mouseMove(_this: Events, event: MouseEvent) {
    event.preventDefault()

    let distance = event.pageY - _this.currentY
    _this.currentY = event.pageY

    if (distance != _this.distance) {
      _this.distance = distance
      _this.scrollbar.move(_this.distance)
    }
  }

  mouseWheel(_this: Events, event: WheelEvent) {
    event.preventDefault()
    this.isScroling = true;

    let distance = null
    if (this.isMac) {
      distance = event.deltaY * 0.05
    } else {
      distance = event.deltaY
    }

    if (distance != _this.distance) {
      _this.distance = distance
      _this.scrollbar.move(_this.distance)
    }

    clearTimeout(this.isWheeling)
    this.isWheeling = setTimeout(() => {
      this.isScroling = false;
    }, 250)
  }

  mouseUp(_this: Events, event: MouseEvent) {
    document.onmousemove = null
    _this.distance = 0

    _this.isScroling = false
  }

  userScrolled(_this: Events, event: UIEvent) {
    if(!_this.isScroling) {
      let position = _this.scrollbar.el.scrollTop
      _this.scrollbar.setBarPosition(position)
    }
  }
}
