declare module "fluide" {
  export class Events {
    private scrollbar;
    private currentY;
    private distance;
    private isMac;
    private isScroling;
    private isWheeling;
    constructor(scrollbar: Scrollbar);
    mouseDown(this: Events, event: MouseEvent): void;
    mouseMove(this: Events, event: MouseEvent): void;
    mouseWheel(this: Events, event: WheelEvent): void;
    mouseUp(this: Events, event: MouseEvent): void;
    userScrolled(this: Events, event: UIEvent): void;
  }

  export class Scrollbar {
    private events;
    el: HTMLElement;
    scroll: HTMLElement;
    bar: HTMLElement;
    private height;
    private scrollHeight;
    private barProportion;
    private barHeight;
    private position;
    private maxPosition;
    private scrollClass;
    constructor(el: HTMLElement);
    calculateSizes(): void;
    createScroll(): void;
    move(distance: number): void;
    setBarPosition(scrollPosition: number): void;
  }
  
  const _default: {
    version: string;
    Scrollbar: typeof Scrollbar;
  };
  export default _default;
}