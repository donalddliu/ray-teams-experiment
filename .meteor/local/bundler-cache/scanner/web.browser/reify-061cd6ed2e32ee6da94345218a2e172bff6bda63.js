module.export({RangeSlider:()=>RangeSlider});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let React;module.link("react",{"*"(v){React=v}},1);let AbstractPureComponent;module.link("../../common/abstractPureComponent",{AbstractPureComponent(v){AbstractPureComponent=v}},2);let Errors;module.link("../../common/errors",{"*"(v){Errors=v}},3);let Intent;module.link("../../common/intent",{Intent(v){Intent=v}},4);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},5);let MultiSlider;module.link("./multiSlider",{MultiSlider(v){MultiSlider=v}},6);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */







var RangeIndex;
(function (RangeIndex) {
    RangeIndex[RangeIndex["START"] = 0] = "START";
    RangeIndex[RangeIndex["END"] = 1] = "END";
})(RangeIndex || (RangeIndex = {}));
var RangeSlider = /** @class */ (function (_super) {
    tslib_1.__extends(RangeSlider, _super);
    function RangeSlider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RangeSlider.prototype.render = function () {
        var _a = this.props, value = _a.value, props = tslib_1.__rest(_a, ["value"]);
        return (React.createElement(MultiSlider, tslib_1.__assign({}, props),
            React.createElement(MultiSlider.Handle, { value: value[RangeIndex.START], type: "start", intentAfter: Intent.PRIMARY }),
            React.createElement(MultiSlider.Handle, { value: value[RangeIndex.END], type: "end" })));
    };
    RangeSlider.prototype.validateProps = function (props) {
        var value = props.value;
        if (value == null || value[RangeIndex.START] == null || value[RangeIndex.END] == null) {
            throw new Error(Errors.RANGESLIDER_NULL_VALUE);
        }
    };
    RangeSlider.defaultProps = tslib_1.__assign({}, MultiSlider.defaultSliderProps, { value: [0, 10] });
    RangeSlider.displayName = DISPLAYNAME_PREFIX + ".RangeSlider";
    return RangeSlider;
}(AbstractPureComponent));

//# sourceMappingURL=rangeSlider.js.map