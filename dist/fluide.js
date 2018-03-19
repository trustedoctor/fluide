/*!
 * Fluide v1.0.0-alpha.1
 * (c) 2018 nerdslabs
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Fluide = factory());
}(this, (function () { 'use strict';

var Events = /** @class */ (function () {
    // TODO: react on scroll changed by user (element.scrollTop = (...)), by binding event listener
    function Events(scrollbar) {
        var _this = this;
        this.isMac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
        this.isScroling = false;
        this.isWheeling = null;
        this.scrollbar = scrollbar;
        this.scrollbar.el.onwheel = function (event) { return _this.mouseWheel(_this, event); };
        this.scrollbar.scroll.onwheel = function (event) { return _this.mouseWheel(_this, event); };
        this.scrollbar.bar.onmousedown = function (event) { return _this.mouseDown(_this, event); };
        document.onmouseup = function (event) { return _this.mouseUp(_this, event); };
        this.scrollbar.el.onscroll = function (event) { return _this.userScrolled(_this, event); };
    }
    Events.prototype.mouseDown = function (_this, event) {
        _this.isScroling = true;
        _this.distance = 0;
        _this.currentY = event.pageY;
        document.onmousemove = function (event) { return _this.mouseMove(_this, event); };
    };
    Events.prototype.mouseMove = function (_this, event) {
        event.preventDefault();
        var distance = event.pageY - _this.currentY;
        _this.currentY = event.pageY;
        if (distance != _this.distance) {
            _this.distance = distance;
            _this.scrollbar.move(_this.distance);
        }
    };
    Events.prototype.mouseWheel = function (_this, event) {
        var _this = this;
        event.preventDefault();
        this.isScroling = true;
        var distance = null;
        if (this.isMac) {
            distance = event.deltaY * 0.05;
        }
        else {
            distance = event.deltaY;
        }
        if (distance != _this.distance) {
            _this.distance = distance;
            _this.scrollbar.move(_this.distance);
        }
        clearTimeout(this.isWheeling);
        this.isWheeling = setTimeout(function () {
            _this.isScroling = false;
        }, 250);
    };
    Events.prototype.mouseUp = function (_this, event) {
        document.onmousemove = null;
        _this.distance = 0;
        _this.isScroling = false;
    };
    Events.prototype.userScrolled = function (_this, event) {
        if (!_this.isScroling) {
            var position = _this.scrollbar.el.scrollTop;
            _this.scrollbar.setBarPosition(position);
        }
    };
    return Events;
}());

var Scrollbar = /** @class */ (function () {
    function Scrollbar(el) {
        this.position = 0;
        this.maxPosition = 0;
        this.scrollClass = null;
        this.el = el;
        this.el.classList.add('scroll-content');
        this.el.style.overflow = 'auto';
        this.height = this.el.clientHeight;
        this.scrollHeight = this.el.scrollHeight;
        this.el.style.overflow = 'hidden';
        this.createScroll();
        this.calculateSizes();
    }
    Scrollbar.prototype.calculateSizes = function () {
        this.barProportion = parseFloat((this.height / this.scrollHeight).toPrecision(1));
        if (this.height * this.barProportion > 26) {
            this.barHeight = this.height * this.barProportion;
        }
        else {
            // this.barHeight = this.height * this.barProportion
            this.barHeight = 26;
        }
        this.maxPosition = this.height - this.barHeight;
        this.scroll.style.height = this.height + 'px';
        this.bar.style.height = this.barHeight + 'px';
        this.el.style.width = (this.el.offsetWidth - this.scroll.offsetWidth) + "px";
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
    Scrollbar.prototype.move = function (distance) {
        var _this = this;
        var newPosition = (distance + this.position);
        if (newPosition <= 0) {
            this.position = 0;
        }
        else if (newPosition < this.maxPosition) {
            this.position = newPosition;
        }
        else {
            this.position = this.maxPosition;
        }
        this.el.scrollTop = (this.position / this.maxPosition) * (this.scrollHeight - this.height);
        this.bar.style.marginTop = this.position + 'px';
        this.scroll.className = this.scroll.className.indexOf('scroll-active') > 0 ? this.scroll.className : this.scroll.className + ' scroll-active';
        clearTimeout(this.scrollClass);
        this.scrollClass = setTimeout(function () {
            _this.scroll.className = _this.scroll.className.replace(/\s*scroll-active\s*/g, '');
        }, 500);
    };
    Scrollbar.prototype.setBarPosition = function (scrollPosition) {
        var position = scrollPosition * this.barProportion;
        if (position <= 0) {
            this.position = 0;
        }
        else if (position < this.maxPosition) {
            this.position = position;
        }
        else {
            this.position = this.maxPosition;
        }
        this.bar.style.marginTop = this.position + "px";
    };
    return Scrollbar;
}());

var main = {
    version: '1.0.0-alpha.1',
    Scrollbar: Scrollbar
};

return main;

})));
//# sourceMappingURL=fluide.js.map
