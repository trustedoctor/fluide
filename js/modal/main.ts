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

    this.el.style.display = 'block'

    this.el.remove()
    this.backdrop.appendChild(this.el)
  }

  public open() {
    this.opened = true

    document.body.appendChild(this.backdrop)

    this.bindEvents()
  }

  public close() {
    this.opened = false

    document.body.removeChild(this.backdrop)
  }

  public isOpened() {
    return this.opened
  }

  public setCloseable(state: boolean) {
    this.options.closeable = state
    if (this.opened) {
      this.bindEvents()
    }
  }

  public isCloseable(): boolean {
    return this.options.closeable
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
