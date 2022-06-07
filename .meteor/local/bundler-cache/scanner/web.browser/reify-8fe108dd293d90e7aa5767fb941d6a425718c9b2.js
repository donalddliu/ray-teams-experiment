module.export({NavbarGroup:()=>NavbarGroup});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Alignment;module.link("../../common/alignment",{Alignment(v){Alignment=v}},3);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},4);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},5);/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */






// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var NavbarGroup = /** @class */ (function (_super) {
    tslib_1.__extends(NavbarGroup, _super);
    function NavbarGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavbarGroup.prototype.render = function () {
        var _a = this.props, align = _a.align, children = _a.children, className = _a.className, htmlProps = tslib_1.__rest(_a, ["align", "children", "className"]);
        var classes = classNames(Classes.NAVBAR_GROUP, Classes.alignmentClass(align), className);
        return (React.createElement("div", tslib_1.__assign({ className: classes }, htmlProps), children));
    };
    NavbarGroup.displayName = DISPLAYNAME_PREFIX + ".NavbarGroup";
    NavbarGroup.defaultProps = {
        align: Alignment.LEFT,
    };
    return NavbarGroup;
}(React.PureComponent));

//# sourceMappingURL=navbarGroup.js.map