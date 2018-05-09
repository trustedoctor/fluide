export function debounce(callback: () => void, time: number) {
  let interval: NodeJS.Timer
  const context = this

  return function() {
    const args = arguments

    interval = setTimeout(() => {
      interval = null;
      callback.apply(this, args);
    }, time);
  };
}
