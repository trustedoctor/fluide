export default class Props {
  public requestAnimFrameLastCallValue: number = 0

  static get all(): Props {
    if (typeof window._fluide === typeof undefined) {
      window._fluide = new Props()
    }

    return window._fluide
  }

  static get requestAnimFrameLastCall(): number {
    return Props.all.requestAnimFrameLastCallValue
  }

  static set requestAnimFrameLastCall(value: number) {
    Props.all.requestAnimFrameLastCallValue = value
  }
}

declare global {
  interface Window {
    _fluide: Props
  }
}
