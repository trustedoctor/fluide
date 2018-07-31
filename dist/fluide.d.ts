/// <reference types="node" />
declare module "polyfills/props" {
    import Module from "module";
    export class Props {
        tickTimout: NodeJS.Timer;
        tickInstances: Module[];
        private fps;
        constructor();
        addTickInstance(c: Module): void;
        tick(): void;
        static readonly all: Props;
    }
    global {
        interface Window {
            _fluide: Props;
        }
    }
}
declare module "module" {
    export interface Module {
        onTick(): any;
    }
    export abstract class Module {
        el: HTMLElement;
        constructor(el: HTMLElement | string);
    }
}
declare module "modal/main" {
    import Module from "module";
    export class Modal extends Module {
        private options;
        private opened;
        private backdrop;
        constructor(el: HTMLElement | string, options?: Options);
        open(): void;
        close(): void;
        isOpened(): boolean;
        setCloseable(state: boolean): void;
        isCloseable(): boolean;
        private bindEvents;
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
    export class Events {
        private scrollbar;
        private currentY;
        private isMac;
        private isWheeling;
        private watcher;
        private fps;
        constructor(scrollbar: Scrollbar);
        private tick;
        private mouseDown;
        private mouseMove;
        private mouseWheel;
        private mouseUp;
        private userScrolled;
    }
}
declare module "scrollbar/main" {
    import Module from "module";
    export class Scrollbar extends Module {
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
        private createScroll;
    }
}
declare module "tooltip/main" {
    import Module from "module";
    export enum Position {
        TOP = 0,
        BOTTOM = 1,
        LEFT = 2,
        RIGHT = 3,
        CLASS = 4
    }
    export class Tooltip extends Module {
        static Position: typeof Position;
        private tooltip;
        private position;
        constructor(el: HTMLElement | string, position?: Position);
        private mouseEnter;
        private mouseLeave;
        private calculatePosition;
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
