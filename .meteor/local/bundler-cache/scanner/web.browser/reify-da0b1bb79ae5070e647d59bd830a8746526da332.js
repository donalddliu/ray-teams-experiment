module.export({Dialog:()=>Dialog});let __assign,__extends;module.link("tslib",{__assign(v){__assign=v},__extends(v){__extends=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let AbstractPureComponent2,Classes;module.link("../../common",{AbstractPureComponent2(v){AbstractPureComponent2=v},Classes(v){Classes=v}},3);let Errors;module.link("../../common/errors",{"*"(v){Errors=v}},4);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},5);let uniqueId;module.link("../../common/utils",{uniqueId(v){uniqueId=v}},6);let Button;module.link("../button/buttons",{Button(v){Button=v}},7);let H4;module.link("../html/html",{H4(v){H4=v}},8);let Icon,IconSize;module.link("../icon/icon",{Icon(v){Icon=v},IconSize(v){IconSize=v}},9);let Overlay;module.link("../overlay/overlay",{Overlay(v){Overlay=v}},10);/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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











var Dialog = /** @class */ (function (_super) {
    __extends(Dialog, _super);
    function Dialog(props) {
        var _this = _super.call(this, props) || this;
        var id = uniqueId("bp-dialog");
        _this.titleId = "title-".concat(id);
        return _this;
    }
    Dialog.prototype.render = function () {
        return (React.createElement(Overlay, __assign({}, this.props, { className: Classes.OVERLAY_SCROLL_CONTAINER, hasBackdrop: true }),
            React.createElement("div", { className: Classes.DIALOG_CONTAINER },
                React.createElement("div", { className: classNames(Classes.DIALOG, this.props.className), role: "dialog", "aria-labelledby": this.props["aria-labelledby"] || (this.props.title ? this.titleId : undefined), "aria-describedby": this.props["aria-describedby"], style: this.props.style },
                    this.maybeRenderHeader(),
                    this.props.children))));
    };
    Dialog.prototype.validateProps = function (props) {
        if (props.title == null) {
            if (props.icon != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_ICON);
            }
            if (props.isCloseButtonShown != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_CLOSE_BUTTON);
            }
        }
    };
    Dialog.prototype.maybeRenderCloseButton = function () {
        // show close button if prop is undefined or null
        // this gives us a behavior as if the default value were `true`
        if (this.props.isCloseButtonShown !== false) {
            return (React.createElement(Button, { "aria-label": "Close", className: Classes.DIALOG_CLOSE_BUTTON, icon: React.createElement(Icon, { icon: "small-cross", size: IconSize.LARGE }), minimal: true, onClick: this.props.onClose }));
        }
        else {
            return undefined;
        }
    };
    Dialog.prototype.maybeRenderHeader = function () {
        var _a = this.props, icon = _a.icon, title = _a.title;
        if (title == null) {
            return undefined;
        }
        return (React.createElement("div", { className: Classes.DIALOG_HEADER },
            React.createElement(Icon, { icon: icon, size: IconSize.LARGE, "aria-hidden": true, tabIndex: -1 }),
            React.createElement(H4, { id: this.titleId }, title),
            this.maybeRenderCloseButton()));
    };
    Dialog.defaultProps = {
        canOutsideClickClose: true,
        isOpen: false,
    };
    Dialog.displayName = "".concat(DISPLAYNAME_PREFIX, ".Dialog");
    return Dialog;
}(AbstractPureComponent2));

//# sourceMappingURL=dialog.js.map