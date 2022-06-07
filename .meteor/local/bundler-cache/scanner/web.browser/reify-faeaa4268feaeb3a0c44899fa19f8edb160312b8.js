module.export({Hotkeys:()=>Hotkeys});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let React;module.link("react",{"*"(v){React=v}},1);let classNames;module.link("classnames",{default(v){classNames=v}},2);let AbstractPureComponent,Classes,DISPLAYNAME_PREFIX;module.link("../../common",{AbstractPureComponent(v){AbstractPureComponent=v},Classes(v){Classes=v},DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},3);let HOTKEYS_HOTKEY_CHILDREN;module.link("../../common/errors",{HOTKEYS_HOTKEY_CHILDREN(v){HOTKEYS_HOTKEY_CHILDREN=v}},4);let isElementOfType;module.link("../../common/utils",{isElementOfType(v){isElementOfType=v}},5);let H4;module.link("../html/html",{H4(v){H4=v}},6);let Hotkey;module.link("./hotkey",{Hotkey(v){Hotkey=v}},7);module.link("./hotkey",{Hotkey:"Hotkey"},8);module.link("./keyCombo",{KeyCombo:"KeyCombo"},9);module.link("./hotkeysTarget",{HotkeysTarget:"HotkeysTarget"},10);module.link("./hotkeyParser",{comboMatches:"comboMatches",getKeyCombo:"getKeyCombo",getKeyComboString:"getKeyComboString",parseKeyCombo:"parseKeyCombo"},11);module.link("./hotkeysDialog",{hideHotkeysDialog:"hideHotkeysDialog",setHotkeysDialogProps:"setHotkeysDialogProps"},12);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */













var Hotkeys = /** @class */ (function (_super) {
    tslib_1.__extends(Hotkeys, _super);
    function Hotkeys() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Hotkeys.prototype.render = function () {
        var hotkeys = React.Children.map(this.props.children, function (child) { return child.props; });
        // sort by group label alphabetically, globals first
        hotkeys.sort(function (a, b) {
            if (a.global) {
                return b.global ? 0 : -1;
            }
            if (b.global) {
                return 1;
            }
            return a.group.localeCompare(b.group);
        });
        var lastGroup = null;
        var elems = [];
        for (var _i = 0, hotkeys_1 = hotkeys; _i < hotkeys_1.length; _i++) {
            var hotkey = hotkeys_1[_i];
            var groupLabel = hotkey.group;
            if (groupLabel !== lastGroup) {
                elems.push(React.createElement(H4, { key: "group-" + elems.length }, groupLabel));
                lastGroup = groupLabel;
            }
            elems.push(React.createElement(Hotkey, tslib_1.__assign({ key: elems.length }, hotkey)));
        }
        var rootClasses = classNames(Classes.HOTKEY_COLUMN, this.props.className);
        return React.createElement("div", { className: rootClasses }, elems);
    };
    Hotkeys.prototype.validateProps = function (props) {
        React.Children.forEach(props.children, function (child) {
            if (!isElementOfType(child, Hotkey)) {
                throw new Error(HOTKEYS_HOTKEY_CHILDREN);
            }
        });
    };
    Hotkeys.displayName = DISPLAYNAME_PREFIX + ".Hotkeys";
    Hotkeys.defaultProps = {
        tabIndex: 0,
    };
    return Hotkeys;
}(AbstractPureComponent));

//# sourceMappingURL=hotkeys.js.map