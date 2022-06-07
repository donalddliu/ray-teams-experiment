module.export({Hotkeys:()=>Hotkeys});let __assign,__extends;module.link("tslib",{__assign(v){__assign=v},__extends(v){__extends=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let AbstractPureComponent2,Classes,DISPLAYNAME_PREFIX;module.link("../../common",{AbstractPureComponent2(v){AbstractPureComponent2=v},Classes(v){Classes=v},DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},3);let HOTKEYS_HOTKEY_CHILDREN;module.link("../../common/errors",{HOTKEYS_HOTKEY_CHILDREN(v){HOTKEYS_HOTKEY_CHILDREN=v}},4);let isElementOfType,isReactChildrenElementOrElements;module.link("../../common/utils",{isElementOfType(v){isElementOfType=v},isReactChildrenElementOrElements(v){isReactChildrenElementOrElements=v}},5);let H4;module.link("../html/html",{H4(v){H4=v}},6);let Hotkey;module.link("./hotkey",{Hotkey(v){Hotkey=v}},7);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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








var Hotkeys = /** @class */ (function (_super) {
    __extends(Hotkeys, _super);
    function Hotkeys() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Hotkeys.prototype.render = function () {
        if (!isReactChildrenElementOrElements(this.props.children)) {
            return null;
        }
        var hotkeys = React.Children.map(this.props.children, function (child) { return child.props; });
        // sort by group label alphabetically, prioritize globals
        hotkeys.sort(function (a, b) {
            if (a.global === b.global && a.group && b.group) {
                return a.group.localeCompare(b.group);
            }
            return a.global ? -1 : 1;
        });
        var lastGroup;
        var elems = [];
        for (var _i = 0, hotkeys_1 = hotkeys; _i < hotkeys_1.length; _i++) {
            var hotkey = hotkeys_1[_i];
            var groupLabel = hotkey.group;
            if (groupLabel !== lastGroup) {
                elems.push(React.createElement(H4, { key: "group-".concat(elems.length) }, groupLabel));
                lastGroup = groupLabel;
            }
            elems.push(React.createElement(Hotkey, __assign({ key: elems.length }, hotkey)));
        }
        var rootClasses = classNames(Classes.HOTKEY_COLUMN, this.props.className);
        return React.createElement("div", { className: rootClasses }, elems);
    };
    Hotkeys.prototype.validateProps = function (props) {
        if (!isReactChildrenElementOrElements(props.children)) {
            return;
        }
        React.Children.forEach(props.children, function (child) {
            if (!isElementOfType(child, Hotkey)) {
                throw new Error(HOTKEYS_HOTKEY_CHILDREN);
            }
        });
    };
    Hotkeys.displayName = "".concat(DISPLAYNAME_PREFIX, ".Hotkeys");
    Hotkeys.defaultProps = {
        tabIndex: 0,
    };
    return Hotkeys;
}(AbstractPureComponent2));

//# sourceMappingURL=hotkeys.js.map