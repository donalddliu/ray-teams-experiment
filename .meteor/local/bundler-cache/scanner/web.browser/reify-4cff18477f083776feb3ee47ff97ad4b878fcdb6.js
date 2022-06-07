module.export({Callout:()=>Callout});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes,DISPLAYNAME_PREFIX,Intent;module.link("../../common",{Classes(v){Classes=v},DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v},Intent(v){Intent=v}},3);let Icon;module.link("../../index",{Icon(v){Icon=v}},4);let H4;module.link("../html/html",{H4(v){H4=v}},5);/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */






var Callout = /** @class */ (function (_super) {
    tslib_1.__extends(Callout, _super);
    function Callout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Callout.prototype.render = function () {
        var _a = this.props, className = _a.className, children = _a.children, icon = _a.icon, intent = _a.intent, title = _a.title, htmlProps = tslib_1.__rest(_a, ["className", "children", "icon", "intent", "title"]);
        var iconName = this.getIconName(icon, intent);
        var classes = classNames(Classes.CALLOUT, Classes.intentClass(intent), (_b = {}, _b[Classes.CALLOUT_ICON] = iconName != null, _b), className);
        return (React.createElement("div", tslib_1.__assign({ className: classes }, htmlProps),
            iconName && React.createElement(Icon, { icon: iconName, iconSize: Icon.SIZE_LARGE }),
            title && React.createElement(H4, null, title),
            children));
        var _b;
    };
    Callout.prototype.getIconName = function (icon, intent) {
        // 1. no icon
        if (icon === null) {
            return undefined;
        }
        // 2. defined iconName prop
        if (icon !== undefined) {
            return icon;
        }
        // 3. default intent icon
        switch (intent) {
            case Intent.DANGER:
                return "error";
            case Intent.PRIMARY:
                return "info-sign";
            case Intent.WARNING:
                return "warning-sign";
            case Intent.SUCCESS:
                return "tick";
            default:
                return undefined;
        }
    };
    Callout.displayName = DISPLAYNAME_PREFIX + ".Callout";
    return Callout;
}(React.PureComponent));

//# sourceMappingURL=callout.js.map