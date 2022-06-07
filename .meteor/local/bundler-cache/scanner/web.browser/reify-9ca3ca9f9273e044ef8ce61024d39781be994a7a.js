module.export({HTMLSelect:()=>HTMLSelect});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let DISABLED,FILL,HTML_SELECT,LARGE,MINIMAL;module.link("../../common/classes",{DISABLED(v){DISABLED=v},FILL(v){FILL=v},HTML_SELECT(v){HTML_SELECT=v},LARGE(v){LARGE=v},MINIMAL(v){MINIMAL=v}},3);let Icon;module.link("../icon/icon",{Icon(v){Icon=v}},4);/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */





// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var HTMLSelect = /** @class */ (function (_super) {
    tslib_1.__extends(HTMLSelect, _super);
    function HTMLSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLSelect.prototype.render = function () {
        var _a = this.props, className = _a.className, disabled = _a.disabled, elementRef = _a.elementRef, fill = _a.fill, iconProps = _a.iconProps, large = _a.large, minimal = _a.minimal, _b = _a.options, options = _b === void 0 ? [] : _b, htmlProps = tslib_1.__rest(_a, ["className", "disabled", "elementRef", "fill", "iconProps", "large", "minimal", "options"]);
        var classes = classNames(HTML_SELECT, (_c = {},
            _c[DISABLED] = disabled,
            _c[FILL] = fill,
            _c[LARGE] = large,
            _c[MINIMAL] = minimal,
            _c), className);
        var optionChildren = options.map(function (option) {
            var props = typeof option === "object" ? option : { value: option };
            return React.createElement("option", tslib_1.__assign({}, props, { key: props.value, children: props.label || props.value }));
        });
        return (React.createElement("div", { className: classes },
            React.createElement("select", tslib_1.__assign({ disabled: disabled, ref: elementRef }, htmlProps, { multiple: false }),
                optionChildren,
                htmlProps.children),
            React.createElement(Icon, tslib_1.__assign({ icon: "double-caret-vertical" }, iconProps))));
        var _c;
    };
    return HTMLSelect;
}(React.PureComponent));

//# sourceMappingURL=htmlSelect.js.map