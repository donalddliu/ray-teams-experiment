module.export({ButtonGroup:()=>ButtonGroup});let __assign,__extends,__rest;module.link("tslib",{__assign(v){__assign=v},__extends(v){__extends=v},__rest(v){__rest=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let AbstractPureComponent2,Classes;module.link("../../common",{AbstractPureComponent2(v){AbstractPureComponent2=v},Classes(v){Classes=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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





// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var ButtonGroup = /** @class */ (function (_super) {
    __extends(ButtonGroup, _super);
    function ButtonGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonGroup.prototype.render = function () {
        var _a;
        var _b = this.props, alignText = _b.alignText, className = _b.className, fill = _b.fill, minimal = _b.minimal, large = _b.large, vertical = _b.vertical, htmlProps = __rest(_b, ["alignText", "className", "fill", "minimal", "large", "vertical"]);
        var buttonGroupClasses = classNames(Classes.BUTTON_GROUP, (_a = {},
            _a[Classes.FILL] = fill,
            _a[Classes.LARGE] = large,
            _a[Classes.MINIMAL] = minimal,
            _a[Classes.VERTICAL] = vertical,
            _a), Classes.alignmentClass(alignText), className);
        return (React.createElement("div", __assign({}, htmlProps, { className: buttonGroupClasses }), this.props.children));
    };
    ButtonGroup.displayName = "".concat(DISPLAYNAME_PREFIX, ".ButtonGroup");
    return ButtonGroup;
}(AbstractPureComponent2));

//# sourceMappingURL=buttonGroup.js.map