module.export({KeyCombo:()=>KeyCombo});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes,DISPLAYNAME_PREFIX;module.link("../../common",{Classes(v){Classes=v},DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},3);let Icon;module.link("../icon/icon",{Icon(v){Icon=v}},4);let normalizeKeyCombo;module.link("./hotkeyParser",{normalizeKeyCombo(v){normalizeKeyCombo=v}},5);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */






var KeyIcons = {
    alt: "key-option",
    cmd: "key-command",
    ctrl: "key-control",
    delete: "key-delete",
    down: "arrow-down",
    enter: "key-enter",
    left: "arrow-left",
    meta: "key-command",
    right: "arrow-right",
    shift: "key-shift",
    up: "arrow-up",
};
var KeyCombo = /** @class */ (function (_super) {
    tslib_1.__extends(KeyCombo, _super);
    function KeyCombo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderKey = function (key, index) {
            var icon = KeyIcons[key];
            var reactKey = "key-" + index;
            return icon == null ? (React.createElement("kbd", { className: Classes.KEY, key: reactKey }, key)) : (React.createElement("kbd", { className: classNames(Classes.KEY, Classes.MODIFIER_KEY), key: reactKey },
                React.createElement(Icon, { icon: icon }),
                " ",
                key));
        };
        _this.renderMinimalKey = function (key, index) {
            var icon = KeyIcons[key];
            return icon == null ? key : React.createElement(Icon, { icon: icon, key: "key-" + index });
        };
        return _this;
    }
    KeyCombo.prototype.render = function () {
        var _a = this.props, className = _a.className, combo = _a.combo, minimal = _a.minimal;
        var keys = normalizeKeyCombo(combo)
            .map(function (key) { return (key.length === 1 ? key.toUpperCase() : key); })
            .map(minimal ? this.renderMinimalKey : this.renderKey);
        return React.createElement("span", { className: classNames(Classes.KEY_COMBO, className) }, keys);
    };
    KeyCombo.displayName = DISPLAYNAME_PREFIX + ".KeyCombo";
    return KeyCombo;
}(React.Component));

//# sourceMappingURL=keyCombo.js.map