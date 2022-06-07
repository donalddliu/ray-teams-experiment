module.export({ContextMenuTarget:()=>ContextMenuTarget});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let React;module.link("react",{"*"(v){React=v}},1);let ReactDOM;module.link("react-dom",{"*"(v){ReactDOM=v}},2);let CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT,CONTEXTMENU_WARN_DECORATOR_NO_METHOD;module.link("../../common/errors",{CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT(v){CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT=v},CONTEXTMENU_WARN_DECORATOR_NO_METHOD(v){CONTEXTMENU_WARN_DECORATOR_NO_METHOD=v}},3);let getDisplayName,isFunction,safeInvoke;module.link("../../common/utils",{getDisplayName(v){getDisplayName=v},isFunction(v){isFunction=v},safeInvoke(v){safeInvoke=v}},4);let isDarkTheme;module.link("../../common/utils/isDarkTheme",{isDarkTheme(v){isDarkTheme=v}},5);let ContextMenu;module.link("./contextMenu",{"*"(v){ContextMenu=v}},6);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */







function ContextMenuTarget(WrappedComponent) {
    if (!isFunction(WrappedComponent.prototype.renderContextMenu)) {
        console.warn(CONTEXTMENU_WARN_DECORATOR_NO_METHOD);
    }
    return _a = /** @class */ (function (_super) {
            tslib_1.__extends(ContextMenuTargetClass, _super);
            function ContextMenuTargetClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ContextMenuTargetClass.prototype.render = function () {
                var _this = this;
                var element = _super.prototype.render.call(this);
                if (element == null) {
                    // always return `element` in case caller is distinguishing between `null` and `undefined`
                    return element;
                }
                if (!React.isValidElement(element)) {
                    console.warn(CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT);
                    return element;
                }
                var oldOnContextMenu = element.props.onContextMenu;
                var onContextMenu = function (e) {
                    // support nested menus (inner menu target would have called preventDefault())
                    if (e.defaultPrevented) {
                        return;
                    }
                    if (isFunction(_this.renderContextMenu)) {
                        var menu = _this.renderContextMenu(e);
                        if (menu != null) {
                            var htmlElement = ReactDOM.findDOMNode(_this);
                            var darkTheme = htmlElement != null && isDarkTheme(htmlElement);
                            e.preventDefault();
                            ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, _this.onContextMenuClose, darkTheme);
                        }
                    }
                    safeInvoke(oldOnContextMenu, e);
                };
                return React.cloneElement(element, { onContextMenu: onContextMenu });
            };
            return ContextMenuTargetClass;
        }(WrappedComponent)),
        _a.displayName = "ContextMenuTarget(" + getDisplayName(WrappedComponent) + ")",
        _a;
    var _a;
}
//# sourceMappingURL=contextMenuTarget.js.map