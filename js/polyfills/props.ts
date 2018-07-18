import Module from '../module'

export default class Props {
  public tickTimout: NodeJS.Timer = null
  public tickInstances: Module[] = []

  private fps: number = 1000 / 24

  constructor() {
    this.tickTimout = setTimeout(() => this.tick(), this.fps)
  }

  public addTickInstance(c: Module) {
    this.tickInstances.push(c)
  }

  public tick() {
    this.tickInstances.forEach(instance => instance.onTick())
    this.tickTimout = setTimeout(() => this.tick(), this.fps)
  }

  static get all(): Props {
    if (typeof window._fluide === typeof undefined) {
      window._fluide = new Props()
    }

    return window._fluide
  }
}

declare global {
  interface Window {
    _fluide: Props
  }
}
