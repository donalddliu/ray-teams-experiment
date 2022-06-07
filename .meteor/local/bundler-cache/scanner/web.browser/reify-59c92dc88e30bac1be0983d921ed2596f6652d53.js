module.export({NonIdealState:()=>NonIdealState});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);let ensureElement;module.link("../../common/utils",{ensureElement(v){ensureElement=v}},5);let H4;module.link("../html/html",{H4(v){H4=v}},6);let Icon;module.link("../icon/icon",{Icon(v){Icon=v}},7);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */








var NonIdealState = /** @class */ (function (_super) {
    tslib_1.__extends(NonIdealState, _super);
    function NonIdealState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NonIdealState.prototype.render = function () {
        var _a = this.props, action = _a.action, children = _a.children, className = _a.className, description = _a.description, title = _a.title;
        return (React.createElement("div", { className: classNames(Classes.NON_IDEAL_STATE, className) },
            this.maybeRenderVisual(),
            title && React.createElement(H4, null, title),
            description && ensureElement(description, "div"),
            action,
            children));
    };
    NonIdealState.prototype.maybeRenderVisual = function () {
        var icon = this.props.icon;
        if (icon == null) {
            return null;
        }
        else {
            return (React.createElement("div", { className: Classes.NON_IDEAL_STATE_VISUAL },
                React.createElement(Icon, { icon: icon, iconSize: Icon.SIZE_LARGE * 3 })));
        }
    };
    NonIdealState.displayName = DISPLAYNAME_PREFIX + ".NonIdealState";
    return NonIdealState;
}(React.PureComponent));

//# sourceMappingURL=nonIdealState.js.map