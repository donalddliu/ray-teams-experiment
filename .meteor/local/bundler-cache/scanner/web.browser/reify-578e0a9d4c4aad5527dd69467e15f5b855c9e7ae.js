module.export({Tag:()=>Tag});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes,DISPLAYNAME_PREFIX,Utils;module.link("../../common",{Classes(v){Classes=v},DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v},Utils(v){Utils=v}},3);let Icon;module.link("../icon/icon",{Icon(v){Icon=v}},4);let Text;module.link("../text/text",{Text(v){Text=v}},5);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */






var Tag = /** @class */ (function (_super) {
    tslib_1.__extends(Tag, _super);
    function Tag() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onRemoveClick = function (e) {
            Utils.safeInvoke(_this.props.onRemove, e, _this.props);
        };
        return _this;
    }
    Tag.prototype.render = function () {
        var _a = this.props, active = _a.active, children = _a.children, className = _a.className, icon = _a.icon, intent = _a.intent, interactive = _a.interactive, large = _a.large, minimal = _a.minimal, multiline = _a.multiline, onRemove = _a.onRemove, rightIcon = _a.rightIcon, round = _a.round, _b = _a.tabIndex, tabIndex = _b === void 0 ? 0 : _b, htmlProps = tslib_1.__rest(_a, ["active", "children", "className", "icon", "intent", "interactive", "large", "minimal", "multiline", "onRemove", "rightIcon", "round", "tabIndex"]);
        var isRemovable = Utils.isFunction(onRemove);
        var tagClasses = classNames(Classes.TAG, Classes.intentClass(intent), (_c = {},
            _c[Classes.ACTIVE] = active,
            _c[Classes.INTERACTIVE] = interactive,
            _c[Classes.LARGE] = large,
            _c[Classes.MINIMAL] = minimal,
            _c[Classes.ROUND] = round,
            _c), className);
        var isLarge = large || tagClasses.indexOf(Classes.LARGE) >= 0;
        var removeButton = isRemovable ? (React.createElement("button", { type: "button", className: Classes.TAG_REMOVE, onClick: this.onRemoveClick },
            React.createElement(Icon, { icon: "small-cross", iconSize: isLarge ? Icon.SIZE_LARGE : Icon.SIZE_STANDARD }))) : null;
        return (React.createElement("span", tslib_1.__assign({}, htmlProps, { className: tagClasses, tabIndex: interactive ? tabIndex : undefined }),
            React.createElement(Icon, { icon: icon }),
            React.createElement(Text, { className: Classes.FILL, ellipsize: !multiline, tagName: "span" }, children),
            React.createElement(Icon, { icon: rightIcon }),
            removeButton));
        var _c;
    };
    Tag.displayName = DISPLAYNAME_PREFIX + ".Tag";
    return Tag;
}(React.PureComponent));

//# sourceMappingURL=tag.js.map