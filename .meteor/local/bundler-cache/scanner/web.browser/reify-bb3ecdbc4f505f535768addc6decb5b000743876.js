module.export({Hotkey:()=>Hotkey});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let AbstractPureComponent,Classes,DISPLAYNAME_PREFIX;module.link("../../common",{AbstractPureComponent(v){AbstractPureComponent=v},Classes(v){Classes=v},DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},3);let KeyCombo;module.link("./keyCombo",{KeyCombo(v){KeyCombo=v}},4);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */





var Hotkey = /** @class */ (function (_super) {
    tslib_1.__extends(Hotkey, _super);
    function Hotkey() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Hotkey.prototype.render = function () {
        var _a = this.props, label = _a.label, className = _a.className, spreadableProps = tslib_1.__rest(_a, ["label", "className"]);
        var rootClasses = classNames(Classes.HOTKEY, className);
        return (React.createElement("div", { className: rootClasses },
            React.createElement("div", { className: Classes.HOTKEY_LABEL }, label),
            React.createElement(KeyCombo, tslib_1.__assign({}, spreadableProps))));
    };
    Hotkey.prototype.validateProps = function (props) {
        if (props.global !== true && props.group == null) {
            throw new Error("non-global <Hotkey>s must define a group");
        }
    };
    Hotkey.displayName = DISPLAYNAME_PREFIX + ".Hotkey";
    Hotkey.defaultProps = {
        allowInInput: false,
        disabled: false,
        global: false,
        preventDefault: false,
        stopPropagation: false,
    };
    return Hotkey;
}(AbstractPureComponent));

//# sourceMappingURL=hotkey.js.map