module.export({MenuItem:()=>MenuItem});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},3);let Position;module.link("../../common/position",{Position(v){Position=v}},4);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},5);let Icon;module.link("../icon/icon",{Icon(v){Icon=v}},6);let Popover,PopoverInteractionKind;module.link("../popover/popover",{Popover(v){Popover=v},PopoverInteractionKind(v){PopoverInteractionKind=v}},7);let Text;module.link("../text/text",{Text(v){Text=v}},8);let Menu;module.link("./menu",{Menu(v){Menu=v}},9);/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */










var MenuItem = /** @class */ (function (_super) {
    tslib_1.__extends(MenuItem, _super);
    function MenuItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuItem.prototype.render = function () {
        var _a = this.props, active = _a.active, className = _a.className, children = _a.children, disabled = _a.disabled, icon = _a.icon, intent = _a.intent, labelElement = _a.labelElement, multiline = _a.multiline, popoverProps = _a.popoverProps, shouldDismissPopover = _a.shouldDismissPopover, text = _a.text, htmlProps = tslib_1.__rest(_a, ["active", "className", "children", "disabled", "icon", "intent", "labelElement", "multiline", "popoverProps", "shouldDismissPopover", "text"]);
        var hasSubmenu = children != null;
        var intentClass = Classes.intentClass(intent);
        var anchorClasses = classNames(Classes.MENU_ITEM, intentClass, (_b = {},
            _b[Classes.ACTIVE] = active,
            _b[Classes.INTENT_PRIMARY] = active && intentClass == null,
            _b[Classes.DISABLED] = disabled,
            // prevent popover from closing when clicking on submenu trigger or disabled item
            _b[Classes.POPOVER_DISMISS] = shouldDismissPopover && !disabled && !hasSubmenu,
            _b), className);
        var target = (React.createElement("a", tslib_1.__assign({}, htmlProps, (disabled ? DISABLED_PROPS : {}), { className: anchorClasses }),
            React.createElement(Icon, { icon: icon }),
            React.createElement(Text, { className: Classes.FILL, ellipsize: !multiline }, text),
            this.maybeRenderLabel(labelElement),
            hasSubmenu && React.createElement(Icon, { icon: "caret-right" })));
        var liClasses = classNames((_c = {}, _c[Classes.MENU_SUBMENU] = hasSubmenu, _c));
        return React.createElement("li", { className: liClasses }, this.maybeRenderPopover(target, children));
        var _b, _c;
    };
    MenuItem.prototype.maybeRenderLabel = function (labelElement) {
        var label = this.props.label;
        if (label == null && labelElement == null) {
            return null;
        }
        return (React.createElement("span", { className: Classes.MENU_ITEM_LABEL },
            label,
            labelElement));
    };
    MenuItem.prototype.maybeRenderPopover = function (target, children) {
        if (children == null) {
            return target;
        }
        var _a = this.props, disabled = _a.disabled, popoverProps = _a.popoverProps;
        return (React.createElement(Popover, tslib_1.__assign({ autoFocus: false, captureDismiss: false, disabled: disabled, enforceFocus: false, hoverCloseDelay: 0, interactionKind: PopoverInteractionKind.HOVER, modifiers: SUBMENU_POPOVER_MODIFIERS, position: Position.RIGHT_TOP, usePortal: false }, popoverProps, { content: React.createElement(Menu, null, children), minimal: true, popoverClassName: classNames(Classes.MENU_SUBMENU, popoverProps.popoverClassName), target: target })));
    };
    MenuItem.defaultProps = {
        disabled: false,
        multiline: false,
        popoverProps: {},
        shouldDismissPopover: true,
        text: "",
    };
    MenuItem.displayName = DISPLAYNAME_PREFIX + ".MenuItem";
    return MenuItem;
}(React.PureComponent));

var SUBMENU_POPOVER_MODIFIERS = {
    // 20px padding - scrollbar width + a bit
    flip: { boundariesElement: "viewport", padding: 20 },
    // shift popover up 5px so MenuItems align
    offset: { offset: -5 },
    preventOverflow: { boundariesElement: "viewport", padding: 20 },
};
// props to ignore when disabled
var DISABLED_PROPS = {
    href: undefined,
    onClick: undefined,
    onMouseDown: undefined,
    onMouseEnter: undefined,
    onMouseLeave: undefined,
    tabIndex: -1,
};
//# sourceMappingURL=menuItem.js.map