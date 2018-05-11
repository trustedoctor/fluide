import Props from './props'

const requestAnimationFrame: (callback: FrameRequestCallback) => number = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  ((callback: FrameRequestCallback): number => {
    const currTime = new Date().getTime();
    const lastCall = Props.requestAnimFrameLastCall
    const timeToCall = Math.max(0, 16 - (currTime - lastCall));
    const id = window.setTimeout(() => callback(currTime + timeToCall), timeToCall)
    Props.requestAnimFrameLastCall = currTime + timeToCall
    return id
  })

const cancelAnimationFrame: (id: number) => void = window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  ((id: number) => window.clearTimeout(id))

export { cancelAnimationFrame, requestAnimationFrame }
