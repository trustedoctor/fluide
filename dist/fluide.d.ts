declare module "modal/main" {
    export default class Modal {
        private el;
        private options;
        private isOpened;
        private backdrop;
        constructor(el: HTMLElement | string, options?: Options);
        open(): void;
        close(): void;
        closeable: boolean;
        private bindEvents();
    }
    export interface Options {
        closeable: boolean;
    }
}
declare module "module" {
    export default abstract class Module {
        el: HTMLElement;
        constructor(el: HTMLElement | string);
    }
}
declare module "helpers" {
    export function debounce(callback: () => void, time: number): () => void;
}
declare module "scrollbar/events" {
    import Scrollbar from "scrollbar/main";
    export default class Events {
        private scrollbar;
        private currentY;
        private isMac;
        private isWheeling;
        private watcher;
        private fps;
        constructor(scrollbar: Scrollbar);
        private tick();
        private mouseDown(this, event);
        private mouseMove(this, event);
        private mouseWheel(this, event);
        private mouseUp(this, event);
        private userScrolled(this, event);
    }
}
declare module "scrollbar/main" {
    import Module from "module";
    export default class Scrollbar extends Module {
        scroll: HTMLElement;
        bar: HTMLElement;
        scrollHeight: number;
        maxPosition: number;
        height: number;
        width: number;
        private visibleProportion;
        private events;
        private barHeight;
        private position;
        private scrollClass;
        constructor(el: HTMLElement);
        calculateSizes(): void;
        move(distance: number): void;
        setBarPosition(): void;
        private createScroll();
    }
}
declare module "tooltip/main" {
    import Module from "module";
    export default class Tooltip extends Module {
        private tooltip;
        constructor(el: HTMLElement | string);
        private mouseEnter(this, event);
        private mouseLeave(this, event);
        private getPosition();
    }
}
declare module "fluide" {
    import Modal from "modal/main";
    import Scrollbar from "scrollbar/main";
    import Tooltip from "tooltip/main";
    const version = "__VERSION__";
    export { Modal, Scrollbar, Tooltip, version };
    const _default: {
        Scrollbar: typeof Scrollbar;
        Modal: typeof Modal;
        Tooltip: typeof Tooltip;
        version: string;
    };
    export default _default;
}
declare module "polyfills/props" {
    export default class Props {
        requestAnimFrameLastCallValue: number;
        requestAnimFrameIdValue: number;
        static readonly all: Props;
        static requestAnimFrameLastCall: number;
        static readonly requestAnimFrameId: number;
    }
    global  {
        interface Window {
            _fluide: Props;
        }
    }
}
declare module "polyfills/animationFrame" {
    const requestAnimationFrame: (callback: FrameRequestCallback) => number;
    const cancelAnimationFrame: (id: number) => void;
    export { cancelAnimationFrame, requestAnimationFrame };
}
