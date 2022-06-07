module.export({Slider:()=>Slider});let __assign,__extends,__rest;module.link("tslib",{__assign(v){__assign=v},__extends(v){__extends=v},__rest(v){__rest=v}},0);let React;module.link("react",{"*"(v){React=v}},1);let AbstractPureComponent2,Intent;module.link("../../common",{AbstractPureComponent2(v){AbstractPureComponent2=v},Intent(v){Intent=v}},2);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},3);let MultiSlider;module.link("./multiSlider",{MultiSlider(v){MultiSlider=v}},4);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */





var Slider = /** @class */ (function (_super) {
    __extends(Slider, _super);
    function Slider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Slider.prototype.render = function () {
        var _a = this.props, initialValue = _a.initialValue, intent = _a.intent, value = _a.value, onChange = _a.onChange, onRelease = _a.onRelease, props = __rest(_a, ["initialValue", "intent", "value", "onChange", "onRelease"]);
        return (React.createElement(MultiSlider, __assign({}, props),
            React.createElement(MultiSlider.Handle, { value: value, intentAfter: value < initialValue ? intent : undefined, intentBefore: value >= initialValue ? intent : undefined, onChange: onChange, onRelease: onRelease }),
            React.createElement(MultiSlider.Handle, { value: initialValue, interactionKind: "none" })));
    };
    Slider.defaultProps = __assign(__assign({}, MultiSlider.defaultSliderProps), { initialValue: 0, intent: Intent.PRIMARY, value: 0 });
    Slider.displayName = "".concat(DISPLAYNAME_PREFIX, ".Slider");
    return Slider;
}(AbstractPureComponent2));

//# sourceMappingURL=slider.js.map