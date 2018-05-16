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

    var Modal = /** @class */ (function () {
        function Modal(el, options) {
            if (options === void 0) { options = {
                closeable: true,
            }; }
            this.isOpened = false;
            if (el instanceof HTMLElement) {
                this.el = el;
            }
            else {
                this.el = document.querySelector(el);
            }
            this.options = options;
            this.backdrop = document.createElement('div');
            this.backdrop.className = 'modal-backdrop';
        }
        Modal.prototype.open = function () {
            this.isOpened = true;
            this.el.style.display = 'block';
            this.el.parentElement.insertBefore(this.backdrop, this.el.nextSibling);
            this.bindEvents();
        };
        Modal.prototype.close = function () {
            this.isOpened = false;
            this.el.style.display = 'none';
            this.el.parentElement.removeChild(this.backdrop);
        };
        Object.defineProperty(Modal.prototype, "closeable", {
            get: function () {
                return this.options.closeable;
            },
            set: function (state) {
                this.options.closeable = state;
            },
            enumerable: true,
            configurable: true
        });
        Modal.prototype.bindEvents = function () {
            var _this = this;
            this.backdrop.onclick = (this.options.closeable ? function (event) {
                if (_this.backdrop === event.target) {
                    _this.close();
                }
            } : null);
        };
        return Modal;
    }());

    var Props = /** @class */ (function () {
        function Props() {
            this.requestAnimFrameLastCallValue = 0;
        }
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
        Object.defineProperty(Props, "requestAnimFrameLastCall", {
            get: function () {
                return Props.all.requestAnimFrameLastCallValue;
            },
            set: function (value) {
                Props.all.requestAnimFrameLastCallValue = value;
            },
            enumerable: true,
            configurable: true
        });
        return Props;
    }());

    var requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        (function (callback) {
            var currTime = new Date().getTime();
            var lastCall = Props.requestAnimFrameLastCall;
            var timeToCall = Math.max(0, 16 - (currTime - lastCall));
            var id = window.setTimeout(function () { return callback(currTime + timeToCall); }, timeToCall);
            Props.requestAnimFrameLastCall = currTime + timeToCall;
            return id;
        });
    var cancelAnimationFrame = window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        (function (id) { return window.clearTimeout(id); });

    var Events = /** @class */ (function () {
        function Events(scrollbar) {
            var _this = this;
            this.isMac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
            this.isScroling = false;
            this.isWheeling = null;
            this.watcher = null;
            this.fps = 1000 / 16;
            this.scrollbar = scrollbar;
            this.scrollbar.el.onwheel = function (event) { return _this.mouseWheel(event); };
            this.scrollbar.scroll.onwheel = function (event) { return _this.mouseWheel(event); };
            this.scrollbar.bar.onmousedown = function (event) { return _this.mouseDown(event); };
            this.scrollbar.el.onscroll = function (event) { return _this.userScrolled(event); };
            document.onmouseup = function (event) { return _this.mouseUp(event); };
            this.lastWatched = Date.now();
            this.watcher = requestAnimationFrame(function () { return _this.tick.call(_this); });
        }
        Events.prototype.tick = function () {
            var _this = this;
            cancelAnimationFrame(this.watcher);
            this.watcher = requestAnimationFrame(function () { return _this.tick.call(_this); });
            var elapsed = Date.now() - this.lastWatched;
            if (elapsed > this.fps) {
                this.lastWatched = Date.now() - (elapsed % this.fps);
                if (this.scrollbar.el.scrollHeight !== this.scrollbar.scrollHeight) {
                    this.scrollbar.calculateSizes.call(this.scrollbar);
                }
                if (this.scrollbar.height !== this.scrollbar.el.clientHeight || this.scrollbar.width !== this.scrollbar.el.clientWidth) {
                    this.scrollbar.calculateSizes.call(this.scrollbar);
                }
            }
        };
        Events.prototype.mouseDown = function (event) {
            var _this = this;
            event.preventDefault();
            this.isScroling = true;
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
            var _this = this;
            event.preventDefault();
            this.isScroling = true;
            var distance = null;
            if (event.wheelDelta) {
                distance = -((event.wheelDelta % 120 - 0) === -0 ? event.wheelDelta / 10 : event.wheelDelta);
            }
            else {
                var rawAmmount = event.deltaY ? event.deltaY : event.detail;
                distance = -(rawAmmount % 3 ? rawAmmount * 10 : rawAmmount / 3);
            }
            this.scrollbar.move(distance);
            clearTimeout(this.isWheeling);
            this.isWheeling = setTimeout(function () {
                _this.isScroling = false;
            }, 250);
        };
        Events.prototype.mouseUp = function (event) {
            document.onmousemove = null;
            this.isScroling = false;
        };
        Events.prototype.userScrolled = function (event) {
            this.scrollbar.setBarPosition();
        };
        return Events;
    }());

    var Scrollbar = /** @class */ (function () {
        function Scrollbar(el) {
            this.maxPosition = 0;
            this.position = 0;
            this.scrollClass = null;
            this.el = el;
            this.el.classList.add('scroll-content');
            this.createScroll();
            this.calculateSizes();
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
        Scrollbar.prototype.createScroll = function () {
            this.scroll = document.createElement('div');
            this.scroll.classList.add('scroll-bar');
            this.bar = document.createElement('div');
            this.bar.classList.add('bar');
            this.scroll.appendChild(this.bar);
            this.events = new Events(this);
            this.el.parentElement.insertBefore(this.scroll, this.el.nextSibling);
        };
        return Scrollbar;
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
        }
        return Module;
    }());

    var Tooltip = /** @class */ (function (_super) {
        __extends(Tooltip, _super);
        function Tooltip(el) {
            var _this = _super.call(this, el) || this;
            _this.el.onmouseenter = function (event) { return _this.mouseEnter(event); };
            _this.el.onmouseleave = function (event) { return _this.mouseLeave(event); };
            return _this;
        }
        Tooltip.prototype.mouseEnter = function (event) {
            var text = this.el.getAttribute('alt');
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'tooltip';
            this.tooltip.innerHTML = text;
            this.el.parentElement.insertBefore(this.tooltip, this.el.nextSibling);
            var _a = this.getPosition(), left = _a.left, top = _a.top;
            this.tooltip.style.left = left + 'px';
            this.tooltip.style.top = top + 'px';
        };
        Tooltip.prototype.mouseLeave = function (event) {
            this.el.parentElement.removeChild(this.tooltip);
        };
        Tooltip.prototype.getPosition = function () {
            var left = this.el.offsetLeft + (this.el.clientWidth / 2) - (this.tooltip.clientWidth / 2);
            var top = this.el.offsetTop + this.el.clientHeight + 5;
            return {
                left: left, top: top,
            };
        };
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
