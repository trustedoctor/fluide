import Events from './events'

export default class Scrollbar {

  public el: HTMLElement
  public scroll: HTMLElement
  public bar: HTMLElement

  public scrollHeight: number

  public height: number
  public width: number

  private events: Events

  private barProportion: number
  private barHeight: number

  private position: number = 0
  private maxPosition: number = 0

  private scrollClass: NodeJS.Timer = null

  constructor(el: HTMLElement) {
    this.el = el

    this.el.classList.add('scroll-content')

    this.createScroll()
    this.calculateSizes()
  }

  public calculateSizes() {
    this.el.style.overflow = 'auto'
    this.height = this.el.clientHeight
    this.width = this.el.clientWidth
    this.scrollHeight = this.el.scrollHeight
    this.el.style.overflow = 'hidden'
    this.el.style.display = 'inline-block'

    this.el.style.width = null
    this.el.style.width = 'calc(' + ('100% - ' + this.scroll.offsetWidth) + 'px)'

    this.barProportion = parseFloat((this.height / this.scrollHeight).toPrecision(1))

    if (this.height * this.barProportion > 26) {
      this.barHeight = this.height * this.barProportion
    } else {
      this.barHeight = 26
    }

    this.maxPosition = this.height - this.barHeight

    this.scroll.style.height = this.height + 'px'
    this.bar.style.height = this.barHeight + 'px'

    this.setBarPosition(this.el.scrollTop)
  }

  public move(distance: number) {
    const newPosition = (distance + this.position)

    if (newPosition <= 0) {
      this.position = 0
    } else if (newPosition < this.maxPosition) {
      this.position = newPosition
    } else {
      this.position = this.maxPosition
    }

    this.el.scrollTop = (this.position / this.maxPosition) * (this.scrollHeight - this.height)
    this.bar.style.marginTop = this.position + 'px'

    this.scroll.className = this.scroll.className.indexOf('scroll-active') > 0 ? this.scroll.className : this.scroll.className + ' scroll-active'
    clearTimeout(this.scrollClass)
    this.scrollClass = setTimeout(() => {
      this.scroll.className = this.scroll.className.replace(/\s*scroll-active\s*/g, '')
    }, 500)
  }

  public setBarPosition(scrollPosition: number) {
    const position = scrollPosition * this.barProportion

    if (position <= 0) {
      this.position = 0;
    } else if (position < this.maxPosition) {
      this.position = position;
    } else {
      this.position = this.maxPosition;
    }

    this.bar.style.marginTop = this.position + 'px';
  }

  private createScroll() {
    this.scroll = document.createElement('div')
    this.scroll.classList.add('scroll-bar')

    this.bar = document.createElement('div')
    this.bar.classList.add('bar')

    this.scroll.appendChild(this.bar)

    this.events = new Events(this)

    this.el.parentElement.insertBefore(this.scroll, this.el.nextSibling)
  }
}
