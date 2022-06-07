module.export({ProgressBar:()=>ProgressBar});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);let clamp;module.link("../../common/utils",{clamp(v){clamp=v}},5);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */






var ProgressBar = /** @class */ (function (_super) {
    tslib_1.__extends(ProgressBar, _super);
    function ProgressBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProgressBar.prototype.render = function () {
        var _a = this.props, _b = _a.animate, animate = _b === void 0 ? true : _b, className = _a.className, intent = _a.intent, _c = _a.stripes, stripes = _c === void 0 ? true : _c, value = _a.value;
        var classes = classNames(Classes.PROGRESS_BAR, Classes.intentClass(intent), (_d = {}, _d[Classes.PROGRESS_NO_ANIMATION] = !animate, _d[Classes.PROGRESS_NO_STRIPES] = !stripes, _d), className);
        // don't set width if value is null (rely on default CSS value)
        var width = value == null ? null : 100 * clamp(value, 0, 1) + "%";
        return (React.createElement("div", { className: classes },
            React.createElement("div", { className: Classes.PROGRESS_METER, style: { width: width } })));
        var _d;
    };
    ProgressBar.displayName = DISPLAYNAME_PREFIX + ".ProgressBar";
    return ProgressBar;
}(React.PureComponent));

//# sourceMappingURL=progressBar.js.map