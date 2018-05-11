import { debounce } from '../helpers'
import Scrollbar from './main'

import { cancelAnimationFrame, requestAnimationFrame } from '../polyfills/animationFrame'

export default class Events {
  private scrollbar: Scrollbar
  private currentY: number
  private distance: number

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
