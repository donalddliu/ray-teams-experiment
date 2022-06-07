module.export({FileInput:()=>FileInput});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Utils;module.link("../../common",{Utils(v){Utils=v}},3);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},4);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},5);/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */






// TODO: write tests (ignoring for now to get a build passing quickly)
/* istanbul ignore next */
var FileInput = /** @class */ (function (_super) {
    tslib_1.__extends(FileInput, _super);
    function FileInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleInputChange = function (e) {
            Utils.safeInvoke(_this.props.onInputChange, e);
            Utils.safeInvoke(_this.props.inputProps.onChange, e);
        };
        return _this;
    }
    FileInput.prototype.render = function () {
        var _a = this.props, className = _a.className, fill = _a.fill, disabled = _a.disabled, inputProps = _a.inputProps, onInputChange = _a.onInputChange, large = _a.large, text = _a.text, htmlProps = tslib_1.__rest(_a, ["className", "fill", "disabled", "inputProps", "onInputChange", "large", "text"]);
        var rootClasses = classNames(Classes.FILE_INPUT, (_b = {},
            _b[Classes.DISABLED] = disabled,
            _b[Classes.FILL] = fill,
            _b[Classes.LARGE] = large,
            _b), className);
        return (React.createElement("label", tslib_1.__assign({}, htmlProps, { className: rootClasses }),
            React.createElement("input", tslib_1.__assign({}, inputProps, { onChange: this.handleInputChange, type: "file", disabled: disabled })),
            React.createElement("span", { className: Classes.FILE_UPLOAD_INPUT }, text)));
        var _b;
    };
    FileInput.displayName = DISPLAYNAME_PREFIX + ".FileInput";
    FileInput.defaultProps = {
        inputProps: {},
        text: "Choose file...",
    };
    return FileInput;
}(React.PureComponent));

//# sourceMappingURL=fileInput.js.map