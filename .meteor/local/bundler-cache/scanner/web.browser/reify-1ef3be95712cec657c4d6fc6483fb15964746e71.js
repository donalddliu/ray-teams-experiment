module.export({Alert:()=>Alert});let __assign,__extends,__rest;module.link("tslib",{__assign(v){__assign=v},__extends(v){__extends=v},__rest(v){__rest=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let AbstractPureComponent2,Classes,DISPLAYNAME_PREFIX;module.link("../../common",{AbstractPureComponent2(v){AbstractPureComponent2=v},Classes(v){Classes=v},DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},3);let ALERT_WARN_CANCEL_ESCAPE_KEY,ALERT_WARN_CANCEL_OUTSIDE_CLICK,ALERT_WARN_CANCEL_PROPS;module.link("../../common/errors",{ALERT_WARN_CANCEL_ESCAPE_KEY(v){ALERT_WARN_CANCEL_ESCAPE_KEY=v},ALERT_WARN_CANCEL_OUTSIDE_CLICK(v){ALERT_WARN_CANCEL_OUTSIDE_CLICK=v},ALERT_WARN_CANCEL_PROPS(v){ALERT_WARN_CANCEL_PROPS=v}},4);let Button;module.link("../button/buttons",{Button(v){Button=v}},5);let Dialog;module.link("../dialog/dialog",{Dialog(v){Dialog=v}},6);let Icon;module.link("../icon/icon",{Icon(v){Icon=v}},7);/*
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








var Alert = /** @class */ (function (_super) {
    __extends(Alert, _super);
    function Alert() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleCancel = function (evt) { return _this.internalHandleCallbacks(false, evt); };
        _this.handleConfirm = function (evt) { return _this.internalHandleCallbacks(true, evt); };
        return _this;
    }
    Alert.prototype.render = function () {
        var _a = this.props, canEscapeKeyCancel = _a.canEscapeKeyCancel, canOutsideClickCancel = _a.canOutsideClickCancel, children = _a.children, className = _a.className, icon = _a.icon, intent = _a.intent, loading = _a.loading, cancelButtonText = _a.cancelButtonText, confirmButtonText = _a.confirmButtonText, onClose = _a.onClose, overlayProps = __rest(_a, ["canEscapeKeyCancel", "canOutsideClickCancel", "children", "className", "icon", "intent", "loading", "cancelButtonText", "confirmButtonText", "onClose"]);
        return (React.createElement(Dialog, __assign({}, overlayProps, { className: classNames(Classes.ALERT, className), canEscapeKeyClose: canEscapeKeyCancel, canOutsideClickClose: canOutsideClickCancel, onClose: this.handleCancel, portalContainer: this.props.portalContainer }),
            React.createElement("div", { className: Classes.ALERT_BODY },
                React.createElement(Icon, { icon: icon, size: 40, intent: intent }),
                React.createElement("div", { className: Classes.ALERT_CONTENTS }, children)),
            React.createElement("div", { className: Classes.ALERT_FOOTER },
                React.createElement(Button, { loading: loading, intent: intent, text: confirmButtonText, onClick: this.handleConfirm }),
                cancelButtonText && (React.createElement(Button, { text: cancelButtonText, disabled: loading, onClick: this.handleCancel })))));
    };
    Alert.prototype.validateProps = function (props) {
        if (props.onClose == null && (props.cancelButtonText == null) !== (props.onCancel == null)) {
            console.warn(ALERT_WARN_CANCEL_PROPS);
        }
        var hasCancelHandler = props.onCancel != null || props.onClose != null;
        if (props.canEscapeKeyCancel && !hasCancelHandler) {
            console.warn(ALERT_WARN_CANCEL_ESCAPE_KEY);
        }
        if (props.canOutsideClickCancel && !hasCancelHandler) {
            console.warn(ALERT_WARN_CANCEL_OUTSIDE_CLICK);
        }
    };
    Alert.prototype.internalHandleCallbacks = function (confirmed, evt) {
        var _a;
        var _b = this.props, onCancel = _b.onCancel, onClose = _b.onClose, onConfirm = _b.onConfirm;
        (_a = (confirmed ? onConfirm : onCancel)) === null || _a === void 0 ? void 0 : _a(evt);
        onClose === null || onClose === void 0 ? void 0 : onClose(confirmed, evt);
    };
    Alert.defaultProps = {
        canEscapeKeyCancel: false,
        canOutsideClickCancel: false,
        confirmButtonText: "OK",
        isOpen: false,
        loading: false,
    };
    Alert.displayName = "".concat(DISPLAYNAME_PREFIX, ".Alert");
    return Alert;
}(AbstractPureComponent2));

//# sourceMappingURL=alert.js.map