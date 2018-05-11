export default class Modal {
  private el: HTMLElement
  private options: Options
  private isOpened: boolean = false
  private backdrop: HTMLElement

  constructor(el: HTMLElement | string, options: Options = {
    closeable: true,
  }) {
    if (el instanceof HTMLElement) {
      this.el = el
    } else {
      this.el = document.querySelector(el)
    }
    this.options = options

    this.backdrop = document.createElement('div')
    this.backdrop.className = 'modal-backdrop'
  }

  public open() {
    this.isOpened = true
    this.el.style.display = 'block'

    this.el.parentElement.insertBefore(this.backdrop, this.el.nextSibling)

    this.bindEvents()
  }

  public close() {
    this.isOpened = false
    this.el.style.display = 'none'

    this.el.parentElement.removeChild(this.backdrop)
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
