export default abstract class Module {
  protected el: HTMLElement

  constructor(el: HTMLElement | string) {
    if (el instanceof HTMLElement) {
      this.el = el
    } else {
      this.el = document.querySelector(el)
    }

    if (this.el === null) {
      throw new Error('Provided Element is null or cannot be found.')
    }
  }
}
