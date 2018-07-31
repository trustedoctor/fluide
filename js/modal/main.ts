import Module from '../module';

export default class Modal extends Module {
  private options: Options
  private opened: boolean = false
  private content: HTMLElement

  constructor(el: HTMLElement | string, options: Options = {
    closeable: true,
  }) {
    super(el)

    this.content = this.el.querySelector('.modal-content')
    this.options = options

    this.bindEvents()
  }

  public open() {
    this.el.classList.add('visible')
    this.opened = true
  }

  public close() {
    this.el.classList.remove('visible')
    this.opened = false
  }

  public isOpened() {
    return this.opened
  }

  public setCloseable(state: boolean) {
    this.options.closeable = state
    this.bindEvents()
  }

  public isCloseable(): boolean {
    return this.options.closeable
  }

  private bindEvents() {
    this.el.onclick = (this.options.closeable ? (event: MouseEvent) => {
      if (event.target !== this.content) {
        this.close()
      }
    } : null)
  }
}

export interface Options {
  closeable: boolean
}
