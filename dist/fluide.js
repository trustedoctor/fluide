/*!
 * Fluide v1.0.0-alpha.1
 * (c) 2018 nerdslabs
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Fluide = {})));
}(this, (function (exports) { 'use strict';

    function __extends(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var Props = /** @class */ (function () {
        function Props() {
            var _this = this;
            this.tickTimout = null;
            this.tickInstances = [];
            this.fps = 1000 / 24;
            this.tickTimout = setTimeout(function () { return _this.tick(); }, this.fps);
        }
        Props.prototype.addTickInstance = function (c) {
            this.tickInstances.push(c);
        };
        Props.prototype.tick = function () {
            var _this = this;
            this.tickInstances.forEach(function (instance) { return instance.onTick(); });
            this.tickTimout = setTimeout(function () { return _this.tick(); }, this.fps);
        };
        Object.defineProperty(Props, "all", {
            get: function () {
                if (typeof window._fluide === typeof undefined) {
                    window._fluide = new Props();
                }
                return window._fluide;
            },
            enumerable: true,
            configurable: true
        });
        return Props;
    }());

    var Module = /** @class */ (function () {
        function Module(el) {
            if (el instanceof HTMLElement) {
                this.el = el;
            }
            else {
                this.el = document.querySelector(el);
            }
            if (this.el === null) {
                throw new Error('Provided Element is null or cannot be found.');
            }
            if (this.onTick !== undefined) {
                Props.all.addTickInstance(this);
            }
        }
        return Module;
    }());

    var Modal = /** @class */ (function (_super) {
        __extends(Modal, _super);
        function Modal(el, options) {
            if (options === void 0) { options = {
                closeable: true,
            }; }
            var _this = _super.call(this, el) || this;
            _this.opened = false;
            _this.content = _this.el.querySelector('.modal-content');
            _this.options = options;
            _this.bindEvents();
            return _this;
        }
        Modal.prototype.open = function () {
            this.el.classList.add('visible');
            this.opened = true;
        };
        Modal.prototype.close = function () {
            this.el.classList.remove('visible');
            this.opened = false;
        };
        Modal.prototype.isOpened = function () {
            return this.opened;
        };
        Modal.prototype.setCloseable = function (state) {
            this.options.closeable = state;
            this.bindEvents();
        };
        Modal.prototype.isCloseable = function () {
            return this.options.closeable;
        };
        Modal.prototype.bindEvents = function () {
            var _this = this;
            this.el.onclick = (this.options.closeable ? function (event) {
                if (event.target !== _this.content) {
                    _this.close();
                }
            } : null);
        };
        return Modal;
    }(Module));

    var Events = /** @class */ (function () {
        function Events(scrollbar) {
            var _this = this;
            this.isMac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
            this.isWheeling = null;
            this.watcher = null;
            this.fps = 1000 / 24;
            this.scrollbar = scrollbar;
            this.scrollbar.el.onwheel = function (event) { return _this.mouseWheel(event); };
            this.scrollbar.scroll.onwheel = function (event) { return _this.mouseWheel(event); };
            this.scrollbar.bar.onmousedown = function (event) { return _this.mouseDown(event); };
            this.scrollbar.el.onscroll = function (event) { return _this.userScrolled(event); };
            document.onmouseup = function (event) { return _this.mouseUp(event); };
            // this.watcher = setTimeout(() => this.tick.call(this), this.fps);
        }
        Events.prototype.tick = function () {
            var _this = this;
            this.watcher = setTimeout(function () { return _this.tick.call(_this); }, this.fps);
            if (this.scrollbar.el.scrollHeight !== this.scrollbar.scrollHeight) {
                this.scrollbar.calculateSizes.call(this.scrollbar);
            }
            if (this.scrollbar.height !== this.scrollbar.el.clientHeight || this.scrollbar.width !== this.scrollbar.el.clientWidth) {
                this.scrollbar.calculateSizes.call(this.scrollbar);
            }
        };
        Events.prototype.mouseDown = function (event) {
            var _this = this;
            event.preventDefault();
            this.currentY = event.pageY;
            document.onmousemove = function (e) { return _this.mouseMove(e); };
        };
        Events.prototype.mouseMove = function (event) {
            event.preventDefault();
            var moveDistance = (event.pageY - this.currentY);
            var scrollDistance = (moveDistance / this.scrollbar.maxPosition) * (this.scrollbar.scrollHeight - this.scrollbar.height);
            this.currentY = event.pageY;
            this.scrollbar.move(scrollDistance);
        };
        Events.prototype.mouseWheel = function (event) {
            var distance = null;
            if (event.wheelDelta && (event.wheelDelta % 120) === 0) {
                distance = -(event.wheelDelta / 10);
            }
            else {
                distance = event.deltaY;
            }
            if ((distance > 0 && this.scrollbar.el.scrollTop < (this.scrollbar.scrollHeight - this.scrollbar.height)) || (distance < 0 && this.scrollbar.el.scrollTop > 0)) {
                event.preventDefault();
                this.scrollbar.move(distance);
            }
        };
        Events.prototype.mouseUp = function (event) {
            document.onmousemove = null;
        };
        Events.prototype.userScrolled = function (event) {
            this.scrollbar.setBarPosition();
        };
        return Events;
    }());

    var Scrollbar = /** @class */ (function (_super) {
        __extends(Scrollbar, _super);
        function Scrollbar(el) {
            var _this = _super.call(this, el) || this;
            _this.maxPosition = 0;
            _this.position = 0;
            _this.scrollClass = null;
            _this.createScroll();
            _this.calculateSizes();
            return _this;
        }
        Scrollbar.prototype.calculateSizes = function () {
            this.el.style.overflow = 'auto';
            this.height = this.el.clientHeight;
            this.scrollHeight = this.el.scrollHeight;
            this.el.style.overflow = 'hidden';
            this.el.style.display = 'inline-block';
            this.el.style.width = null;
            this.el.style.width = 'calc(100% - ' + this.scroll.offsetWidth + 'px)';
            this.width = this.el.clientWidth;
            var visibleProportion = this.height / this.scrollHeight;
            if (this.height * visibleProportion > 30) {
                this.visibleProportion = visibleProportion;
                this.barHeight = this.height * visibleProportion;
            }
            else {
                this.visibleProportion = 30 / this.height;
                this.barHeight = 30;
            }
            this.maxPosition = this.height - this.barHeight;
            this.scroll.style.height = this.height + 'px';
            this.bar.style.height = this.barHeight + 'px';
            this.setBarPosition();
        };
        Scrollbar.prototype.move = function (distance) {
            var _this = this;
            this.el.scrollTop = (distance + this.el.scrollTop);
            this.scroll.className = this.scroll.className.indexOf('scroll-active') > 0 ? this.scroll.className : this.scroll.className + ' scroll-active';
            clearTimeout(this.scrollClass);
            this.scrollClass = setTimeout(function () {
                _this.scroll.className = _this.scroll.className.replace(/\s*scroll-active\s*/g, '');
            }, 500);
        };
        Scrollbar.prototype.setBarPosition = function () {
            var position = (this.el.scrollTop / (this.scrollHeight - this.height)) * this.maxPosition;
            if (position <= 0) {
                this.position = 0;
            }
            else if (position < this.maxPosition) {
                this.position = position;
            }
            else {
                this.position = this.maxPosition;
            }
            this.bar.style.marginTop = this.position + 'px';
        };
        Scrollbar.prototype.onTick = function () {
            if (this.el.scrollHeight !== this.scrollHeight) {
                this.calculateSizes.call(this);
            }
            if (this.height !== this.el.clientHeight || this.width !== this.el.clientWidth) {
                this.calculateSizes.call(this);
            }
        };
        Scrollbar.prototype.createScroll = function () {
            this.scroll = document.createElement('div');
            this.scroll.className = 'scrollbar-handler';
            this.bar = document.createElement('div');
            this.bar.className = 'bar';
            this.scroll.appendChild(this.bar);
            this.events = new Events(this);
            this.el.parentElement.insertBefore(this.scroll, this.el.nextSibling);
        };
        return Scrollbar;
    }(Module));

    var Position;
    (function (Position) {
        Position["TOP"] = "tooltip-top";
        Position["BOTTOM"] = "tooltip-top";
        Position["LEFT"] = "tooltip-top";
        Position["RIGHT"] = "tooltip-top";
        Position["CLASS"] = "tooltip-top";
    })(Position || (Position = {}));
    var Tooltip = /** @class */ (function (_super) {
        __extends(Tooltip, _super);
        function Tooltip(el, position) {
            if (position === void 0) { position = Position.CLASS; }
            var _this = _super.call(this, el) || this;
            if (position === Position.CLASS) {
                if (_this.el.className.indexOf('tooltip-top') > -1) {
                    _this.position = Position.TOP;
                }
                else if (_this.el.className.indexOf('tooltip-left') > -1) {
                    _this.position = Position.LEFT;
                }
                else if (_this.el.className.indexOf('tooltip-right') > -1) {
                    _this.position = Position.RIGHT;
                }
                else {
                    _this.position = Position.BOTTOM;
                }
            }
            else {
                _this.position = position;
            }
            _this.el.onmouseenter = function (event) { return _this.mouseEnter(event); };
            _this.el.onmouseleave = function (event) { return _this.mouseLeave(event); };
            return _this;
        }
        Tooltip.prototype.mouseEnter = function (event) {
            var text = this.el.getAttribute('alt');
            this.tooltip = document.createElement('div');
            this.tooltip.classList.add('tooltip', this.position);
            this.tooltip.innerHTML = text;
            document.body.appendChild(this.tooltip);
            var _a = this.calculatePosition(), left = _a.left, top = _a.top;
            this.tooltip.style.left = left + 'px';
            this.tooltip.style.top = top + 'px';
            window.onscroll = this.mouseScroll.bind(this);
        };
        Tooltip.prototype.mouseLeave = function (event) {
            document.body.removeChild(this.tooltip);
            window.onscroll = null;
        };
        Tooltip.prototype.mouseScroll = function (event) {
            var _a = this.calculatePosition(), left = _a.left, top = _a.top;
            this.tooltip.style.left = left + 'px';
            this.tooltip.style.top = top + 'px';
        };
        Tooltip.prototype.calculatePosition = function () {
            var left;
            var top;
            var position = this.el.getBoundingClientRect();
            if (this.position === Position.BOTTOM) {
                left = position.left + (this.el.offsetWidth / 2) - (this.tooltip.offsetWidth / 2);
                top = position.top + this.el.offsetHeight + 5;
            }
            else if (this.position === Position.TOP) {
                left = position.left + (this.el.offsetWidth / 2) - (this.tooltip.offsetWidth / 2);
                top = position.top - this.tooltip.offsetHeight - 5;
            }
            else if (this.position === Position.LEFT) {
                left = position.left - this.tooltip.offsetWidth - 5;
                top = position.top + (this.el.offsetHeight / 2) - (this.tooltip.offsetHeight / 2);
            }
            else if (this.position === Position.RIGHT) {
                left = position.left + this.el.offsetWidth + 5;
                top = position.top + (this.el.offsetHeight / 2) - (this.tooltip.offsetHeight / 2);
            }
            if (left < 0) {
                left = 0;
            }
            else if (left + this.tooltip.offsetWidth > document.documentElement.scrollWidth) {
                left = document.documentElement.scrollWidth - this.tooltip.offsetWidth;
            }
            return {
                left: left, top: top,
            };
        };
        Tooltip.Position = Position;
        return Tooltip;
    }(Module));

    var version = '1.0.0-alpha.1';
    var fluide = {
        Scrollbar: Scrollbar, Modal: Modal, Tooltip: Tooltip, version: version,
    };

    exports.Modal = Modal;
    exports.Scrollbar = Scrollbar;
    exports.Tooltip = Tooltip;
    exports.version = version;
    exports.default = fluide;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=fluide.js.map
