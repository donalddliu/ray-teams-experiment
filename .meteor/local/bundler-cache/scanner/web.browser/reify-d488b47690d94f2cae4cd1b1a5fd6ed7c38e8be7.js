module.export({HotkeysDialog2:()=>HotkeysDialog2});let __assign,__rest;module.link("tslib",{__assign(v){__assign=v},__rest(v){__rest=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes;module.link("../../common",{Classes(v){Classes=v}},3);let Dialog;module.link("../dialog/dialog",{Dialog(v){Dialog=v}},4);let Hotkey;module.link("./hotkey",{Hotkey(v){Hotkey=v}},5);let Hotkeys;module.link("./hotkeys",{Hotkeys(v){Hotkeys=v}},6);/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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







var HotkeysDialog2 = function (_a) {
    var _b = _a.globalGroupName, globalGroupName = _b === void 0 ? "Global" : _b, hotkeys = _a.hotkeys, props = __rest(_a, ["globalGroupName", "hotkeys"]);
    return (React.createElement(Dialog, __assign({}, props, { className: classNames(Classes.HOTKEY_DIALOG, props.className) }),
        React.createElement("div", { className: Classes.DIALOG_BODY },
            React.createElement(Hotkeys, null, hotkeys.map(function (hotkey, index) { return (React.createElement(Hotkey, __assign({ key: index }, hotkey, { group: hotkey.global === true && hotkey.group == null ? globalGroupName : hotkey.group }))); })))));
};
//# sourceMappingURL=hotkeysDialog2.js.map