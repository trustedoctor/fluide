import { debounce } from '../helpers'
import Scrollbar from './main'

export default class Events {
  private scrollbar: Scrollbar
  private currentY: number

  private isMac: RegExpMatchArray = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)

  private isWheeling: NodeJS.Timer = null

  private watcher: NodeJS.Timer = null
  private fps: number = 1000 / 24

  constructor(scrollbar: Scrollbar) {
    this.scrollbar = scrollbar

    this.scrollbar.el.onwheel = event => this.mouseWheel(event)
    this.scrollbar.scroll.onwheel = event => this.mouseWheel(event)
    this.scrollbar.bar.onmousedown = event => this.mouseDown(event)
    this.scrollbar.el.onscroll = event => this.userScrolled(event)

    document.onmouseup = event => this.mouseUp(event)

    this.watcher = setTimeout(() => this.tick.call(this), this.fps);
  }

  private tick() {
    this.watcher = setTimeout(() => this.tick.call(this), this.fps);

    if (this.scrollbar.el.scrollHeight !== this.scrollbar.scrollHeight) {
      this.scrollbar.calculateSizes.call(this.scrollbar)
    }

    if (this.scrollbar.height !== this.scrollbar.el.clientHeight || this.scrollbar.width !== this.scrollbar.el.clientWidth) {
      this.scrollbar.calculateSizes.call(this.scrollbar)
    }
  }

  private mouseDown(this: Events, event: MouseEvent) {
    event.preventDefault()
    this.currentY = event.pageY
    document.onmousemove = e => this.mouseMove(e)
  }

  private mouseMove(this: Events, event: MouseEvent) {
    event.preventDefault()

    const moveDistance = (event.pageY - this.currentY)
    const scrollDistance = (moveDistance / this.scrollbar.maxPosition) * (this.scrollbar.scrollHeight - this.scrollbar.height)
    this.currentY = event.pageY

    this.scrollbar.move(scrollDistance)
  }

  private mouseWheel(this: Events, event: WheelEvent) {
    let distance = null

    if (event.wheelDelta && (event.wheelDelta % 120) === 0) {
      distance = -(event.wheelDelta / 10);
    } else {
      distance = event.deltaY
    }

    if ((distance > 0 && this.scrollbar.el.scrollTop < (this.scrollbar.scrollHeight - this.scrollbar.height)) || (distance < 0 && this.scrollbar.el.scrollTop > 0)) {
      event.preventDefault()
      this.scrollbar.move(distance)
    }
  }

  private mouseUp(this: Events, event: MouseEvent) {
    document.onmousemove = null
  }

  private userScrolled(this: Events, event: UIEvent) {
    this.scrollbar.setBarPosition()
  }
}
