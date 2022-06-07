module.export({Menu:()=>Menu});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);let MenuDivider;module.link("./menuDivider",{MenuDivider(v){MenuDivider=v}},5);let MenuItem;module.link("./menuItem",{MenuItem(v){MenuItem=v}},6);/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */







var Menu = /** @class */ (function (_super) {
    tslib_1.__extends(Menu, _super);
    function Menu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Menu.prototype.render = function () {
        var _a = this.props, className = _a.className, children = _a.children, large = _a.large, ulRef = _a.ulRef, htmlProps = tslib_1.__rest(_a, ["className", "children", "large", "ulRef"]);
        var classes = classNames(Classes.MENU, (_b = {}, _b[Classes.LARGE] = large, _b), className);
        return (React.createElement("ul", tslib_1.__assign({}, htmlProps, { className: classes, ref: ulRef }), children));
        var _b;
    };
    Menu.displayName = DISPLAYNAME_PREFIX + ".Menu";
    Menu.Divider = MenuDivider;
    Menu.Item = MenuItem;
    return Menu;
}(React.Component));

//# sourceMappingURL=menu.js.map