module.export({Tooltip:()=>Tooltip});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);let Popover,PopoverInteractionKind;module.link("../popover/popover",{Popover(v){Popover=v},PopoverInteractionKind(v){PopoverInteractionKind=v}},5);/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */






var Tooltip = /** @class */ (function (_super) {
    tslib_1.__extends(Tooltip, _super);
    function Tooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tooltip.prototype.render = function () {
        var _a = this.props, children = _a.children, intent = _a.intent, popoverClassName = _a.popoverClassName, restProps = tslib_1.__rest(_a, ["children", "intent", "popoverClassName"]);
        var classes = classNames(Classes.TOOLTIP, Classes.intentClass(intent), popoverClassName);
        return (React.createElement(Popover, tslib_1.__assign({}, restProps, { autoFocus: false, canEscapeKeyClose: false, enforceFocus: false, interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY, lazy: true, popoverClassName: classes }), children));
    };
    Tooltip.displayName = DISPLAYNAME_PREFIX + ".Tooltip";
    Tooltip.defaultProps = {
        hoverCloseDelay: 0,
        hoverOpenDelay: 100,
        transitionDuration: 100,
    };
    return Tooltip;
}(React.PureComponent));

//# sourceMappingURL=tooltip.js.map