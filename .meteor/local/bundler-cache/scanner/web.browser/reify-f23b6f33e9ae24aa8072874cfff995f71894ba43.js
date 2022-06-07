module.export({Tooltip:()=>Tooltip});let __assign,__extends,__rest;module.link("tslib",{__assign(v){__assign=v},__extends(v){__extends=v},__rest(v){__rest=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let AbstractPureComponent2,Classes;module.link("../../common",{AbstractPureComponent2(v){AbstractPureComponent2=v},Classes(v){Classes=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);let Popover,PopoverInteractionKind;module.link("../popover/popover",{Popover(v){Popover=v},PopoverInteractionKind(v){PopoverInteractionKind=v}},5);/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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





// eslint-disable-next-line import/no-cycle

/** @deprecated use { Tooltip2 } from "@blueprintjs/popover2" */
var Tooltip = /** @class */ (function (_super) {
    __extends(Tooltip, _super);
    function Tooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // eslint-disable-next-line deprecation/deprecation
        _this.popover = null;
        return _this;
    }
    Tooltip.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, children = _b.children, intent = _b.intent, popoverClassName = _b.popoverClassName, restProps = __rest(_b, ["children", "intent", "popoverClassName"]);
        var classes = classNames(Classes.TOOLTIP, (_a = {}, _a[Classes.MINIMAL] = this.props.minimal, _a), Classes.intentClass(intent), popoverClassName);
        return (
        /* eslint-disable deprecation/deprecation */
        React.createElement(Popover, __assign({ interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY, modifiers: { arrow: { enabled: !this.props.minimal } } }, restProps, { autoFocus: false, canEscapeKeyClose: false, enforceFocus: false, lazy: true, popoverClassName: classes, portalContainer: this.props.portalContainer, ref: function (ref) { return (_this.popover = ref); } }), children));
    };
    Tooltip.prototype.reposition = function () {
        if (this.popover != null) {
            this.popover.reposition();
        }
    };
    Tooltip.displayName = "".concat(DISPLAYNAME_PREFIX, ".Tooltip");
    Tooltip.defaultProps = {
        hoverCloseDelay: 0,
        hoverOpenDelay: 100,
        minimal: false,
        transitionDuration: 100,
    };
    return Tooltip;
}(AbstractPureComponent2));

//# sourceMappingURL=tooltip.js.map