module.export({TextArea:()=>TextArea});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */





// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var TextArea = /** @class */ (function (_super) {
    tslib_1.__extends(TextArea, _super);
    function TextArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextArea.prototype.render = function () {
        var _a = this.props, className = _a.className, fill = _a.fill, intent = _a.intent, large = _a.large, inputRef = _a.inputRef, htmlProps = tslib_1.__rest(_a, ["className", "fill", "intent", "large", "inputRef"]);
        var rootClasses = classNames(Classes.INPUT, Classes.intentClass(intent), (_b = {},
            _b[Classes.FILL] = fill,
            _b[Classes.LARGE] = large,
            _b), className);
        return React.createElement("textarea", tslib_1.__assign({}, htmlProps, { className: rootClasses, ref: inputRef }));
        var _b;
    };
    TextArea.displayName = DISPLAYNAME_PREFIX + ".TextArea";
    return TextArea;
}(React.PureComponent));

//# sourceMappingURL=textArea.js.map