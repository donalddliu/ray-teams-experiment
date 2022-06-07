module.export({ResizeSensor:()=>ResizeSensor});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let React;module.link("react",{"*"(v){React=v}},1);let ResizeObserver;module.link("resize-observer-polyfill",{default(v){ResizeObserver=v}},2);let findDOMNode;module.link("react-dom",{findDOMNode(v){findDOMNode=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);let safeInvoke;module.link("../../common/utils",{safeInvoke(v){safeInvoke=v}},5);/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */






var ResizeSensor = /** @class */ (function (_super) {
    tslib_1.__extends(ResizeSensor, _super);
    function ResizeSensor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = null;
        _this.observer = new ResizeObserver(function (entries) { return safeInvoke(_this.props.onResize, entries); });
        return _this;
    }
    ResizeSensor.prototype.render = function () {
        // pass-through render of single child
        return React.Children.only(this.props.children);
    };
    ResizeSensor.prototype.componentDidMount = function () {
        // using findDOMNode for two reasons:
        // 1. cloning to insert a ref is unwieldy and not performant.
        // 2. ensure that we get an actual DOM node for observing.
        this.observeElement(findDOMNode(this));
    };
    ResizeSensor.prototype.componentDidUpdate = function (prevProps) {
        this.observeElement(findDOMNode(this), this.props.observeParents !== prevProps.observeParents);
    };
    ResizeSensor.prototype.componentWillUnmount = function () {
        this.observer.disconnect();
    };
    /**
     * Observe the given element, if defined and different from the currently
     * observed element. Pass `force` argument to skip element checks and always
     * re-observe.
     */
    ResizeSensor.prototype.observeElement = function (element, force) {
        if (force === void 0) { force = false; }
        if (element == null) {
            // stop everything if not defined
            this.observer.disconnect();
            return;
        }
        if (element === this.element && !force) {
            // quit if given same element -- nothing to update (unless forced)
            return;
        }
        else {
            // clear observer list if new element
            this.observer.disconnect();
            // remember element reference for next time
            this.element = element;
        }
        // observer callback is invoked immediately when observing new elements
        this.observer.observe(element);
        if (this.props.observeParents) {
            var parent_1 = element.parentElement;
            while (parent_1 != null) {
                this.observer.observe(parent_1);
                parent_1 = parent_1.parentElement;
            }
        }
    };
    ResizeSensor.displayName = DISPLAYNAME_PREFIX + ".ResizeSensor";
    return ResizeSensor;
}(React.PureComponent));

//# sourceMappingURL=resizeSensor.js.map