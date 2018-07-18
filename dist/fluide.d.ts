/// <reference types="node" />
declare module "polyfills/props" {
    import Module from "module";
    export default class Props {
        tickTimout: NodeJS.Timer;
        tickInstances: Module[];
        private fps;
        constructor();
        addTickInstance(c: Module): void;
        tick(): void;
        static readonly all: Props;
    }
    global  {
        interface Window {
            _fluide: Props;
        }
    }
}
declare module "module" {
    export default interface Module {
        onTick(): any;
    }
    export default abstract class Module {
        el: HTMLElement;
        constructor(el: HTMLElement | string);
    }
}
declare module "modal/main" {
    import Module from "module";
    export default class Modal extends Module {
        private options;
        private opened;
        private backdrop;
        constructor(el: HTMLElement | string, options?: Options);
        open(): void;
        close(): void;
        isOpened(): boolean;
        closeable: boolean;
        private bindEvents();
    }
    export interface Options {
        closeable: boolean;
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
        onTick(): void;
        private createScroll();
    }
}
declare module "tooltip/main" {
    import Module from "module";
    export enum Position {
        TOP = 0,
        BOTTOM = 1,
        LEFT = 2,
        RIGHT = 3,
        CLASS = 4,
    }
    export default class Tooltip extends Module {
        static Position: typeof Position;
        private tooltip;
        private position;
        constructor(el: HTMLElement | string, position?: Position);
        private mouseEnter(this, event);
        private mouseLeave(this, event);
        private calculatePosition();
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
