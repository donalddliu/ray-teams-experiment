module.export({Navbar:()=>Navbar});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);let NavbarDivider;module.link("./navbarDivider",{NavbarDivider(v){NavbarDivider=v}},5);let NavbarGroup;module.link("./navbarGroup",{NavbarGroup(v){NavbarGroup=v}},6);let NavbarHeading;module.link("./navbarHeading",{NavbarHeading(v){NavbarHeading=v}},7);/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */








// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var Navbar = /** @class */ (function (_super) {
    tslib_1.__extends(Navbar, _super);
    function Navbar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Navbar.prototype.render = function () {
        var _a = this.props, children = _a.children, className = _a.className, fixedToTop = _a.fixedToTop, htmlProps = tslib_1.__rest(_a, ["children", "className", "fixedToTop"]);
        var classes = classNames(Classes.NAVBAR, (_b = {}, _b[Classes.FIXED_TOP] = fixedToTop, _b), className);
        return (React.createElement("div", tslib_1.__assign({ className: classes }, htmlProps), children));
        var _b;
    };
    Navbar.displayName = DISPLAYNAME_PREFIX + ".Navbar";
    Navbar.Divider = NavbarDivider;
    Navbar.Group = NavbarGroup;
    Navbar.Heading = NavbarHeading;
    return Navbar;
}(React.PureComponent));

//# sourceMappingURL=navbar.js.map