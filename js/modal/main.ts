import Module from '../module';

export default class Modal extends Module {
  private options: Options
  private opened: boolean = false
  private backdrop: HTMLElement

  constructor(el: HTMLElement | string, options: Options = {
    closeable: true,
  }) {
    super(el)

    this.options = options

    this.backdrop = document.createElement('div')
    this.backdrop.className = 'modal-backdrop'
  }

  public open() {
    this.opened = true
    this.el.style.display = 'block'

    this.el.parentElement.insertBefore(this.backdrop, this.el.nextSibling)

    this.bindEvents()
  }

  public close() {
    this.opened = false
    this.el.style.display = 'none'

    this.el.parentElement.removeChild(this.backdrop)
  }

  public isOpened() {
    return this.opened
  }

  get closeable(): boolean {
    return this.options.closeable
  }

  set closeable(state: boolean) {
    this.options.closeable = state
  }

  private bindEvents() {
    this.backdrop.onclick = (this.options.closeable ? (event: MouseEvent) => {
      if (this.backdrop === event.target) {
        this.close()
      }
    } : null)
  }
}

export interface Options {
  closeable: boolean
}
