module.export({Divider:()=>Divider});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let DIVIDER;module.link("../../common/classes",{DIVIDER(v){DIVIDER=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */





// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var Divider = /** @class */ (function (_super) {
    tslib_1.__extends(Divider, _super);
    function Divider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Divider.prototype.render = function () {
        var _a = this.props, className = _a.className, _b = _a.tagName, TagName = _b === void 0 ? "div" : _b, htmlProps = tslib_1.__rest(_a, ["className", "tagName"]);
        var classes = classNames(DIVIDER, className);
        return React.createElement(TagName, tslib_1.__assign({}, htmlProps, { className: classes }));
    };
    Divider.displayName = DISPLAYNAME_PREFIX + ".Divider";
    return Divider;
}(React.PureComponent));

//# sourceMappingURL=divider.js.map