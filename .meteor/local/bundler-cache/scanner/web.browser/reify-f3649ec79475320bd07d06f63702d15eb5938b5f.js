module.export({ControlGroup:()=>ControlGroup});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */





// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var ControlGroup = /** @class */ (function (_super) {
    tslib_1.__extends(ControlGroup, _super);
    function ControlGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControlGroup.prototype.render = function () {
        var _a = this.props, children = _a.children, className = _a.className, fill = _a.fill, vertical = _a.vertical, htmlProps = tslib_1.__rest(_a, ["children", "className", "fill", "vertical"]);
        var rootClasses = classNames(Classes.CONTROL_GROUP, (_b = {},
            _b[Classes.FILL] = fill,
            _b[Classes.VERTICAL] = vertical,
            _b), className);
        return (React.createElement("div", tslib_1.__assign({}, htmlProps, { className: rootClasses }), children));
        var _b;
    };
    ControlGroup.displayName = DISPLAYNAME_PREFIX + ".ControlGroup";
    return ControlGroup;
}(React.PureComponent));

//# sourceMappingURL=controlGroup.js.map