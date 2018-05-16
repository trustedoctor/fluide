import { debounce } from '../helpers'
import Scrollbar from './main'

import { cancelAnimationFrame, requestAnimationFrame } from '../polyfills/animationFrame'

export default class Events {
  private scrollbar: Scrollbar
  private currentY: number

  private isMac: RegExpMatchArray = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)

  private isScroling: boolean = false
  private isWheeling: NodeJS.Timer = null

  private watcher: number = null
  private fps: number = 1000 / 16
  private lastWatched: number

  constructor(scrollbar: Scrollbar) {
    this.scrollbar = scrollbar

    this.scrollbar.el.onwheel = event => this.mouseWheel(event)
    this.scrollbar.scroll.onwheel = event => this.mouseWheel(event)
    this.scrollbar.bar.onmousedown = event => this.mouseDown(event)
    this.scrollbar.el.onscroll = event => this.userScrolled(event)

    document.onmouseup = event => this.mouseUp(event)

    this.lastWatched = Date.now()
    this.watcher = requestAnimationFrame(() => this.tick.call(this));
  }

  private tick() {
    cancelAnimationFrame(this.watcher);
    this.watcher = requestAnimationFrame(() => this.tick.call(this));

    const elapsed: number = Date.now() - this.lastWatched
    if (elapsed > this.fps) {
      this.lastWatched = Date.now() - (elapsed % this.fps)

      if (this.scrollbar.el.scrollHeight !== this.scrollbar.scrollHeight) {
        this.scrollbar.calculateSizes.call(this.scrollbar)
      }

      if (this.scrollbar.height !== this.scrollbar.el.clientHeight || this.scrollbar.width !== this.scrollbar.el.clientWidth) {
        this.scrollbar.calculateSizes.call(this.scrollbar)
      }
    }
  }

  private mouseDown(this: Events, event: MouseEvent) {
    event.preventDefault()
    this.isScroling = true
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
    event.preventDefault()
    this.isScroling = true;

    let distance = null

    if (event.wheelDelta) {
      distance = -((event.wheelDelta % 120 - 0) === -0 ? event.wheelDelta / 10 : event.wheelDelta);
    } else {
      const rawAmmount = event.deltaY ? event.deltaY : event.detail;
      distance = -(rawAmmount % 3 ? rawAmmount * 10 : rawAmmount / 3);
    }

    this.scrollbar.move(distance)

    clearTimeout(this.isWheeling)
    this.isWheeling = setTimeout(() => {
      this.isScroling = false;
    }, 250)
  }

  private mouseUp(this: Events, event: MouseEvent) {
    document.onmousemove = null
    this.isScroling = false
  }

  private userScrolled(this: Events, event: UIEvent) {
    this.scrollbar.setBarPosition()
  }
}
