module.export({Alert:()=>Alert});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let AbstractPureComponent,Classes,DISPLAYNAME_PREFIX;module.link("../../common",{AbstractPureComponent(v){AbstractPureComponent=v},Classes(v){Classes=v},DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},3);let ALERT_WARN_CANCEL_ESCAPE_KEY,ALERT_WARN_CANCEL_OUTSIDE_CLICK,ALERT_WARN_CANCEL_PROPS;module.link("../../common/errors",{ALERT_WARN_CANCEL_ESCAPE_KEY(v){ALERT_WARN_CANCEL_ESCAPE_KEY=v},ALERT_WARN_CANCEL_OUTSIDE_CLICK(v){ALERT_WARN_CANCEL_OUTSIDE_CLICK=v},ALERT_WARN_CANCEL_PROPS(v){ALERT_WARN_CANCEL_PROPS=v}},4);let safeInvoke;module.link("../../common/utils",{safeInvoke(v){safeInvoke=v}},5);let Button;module.link("../button/buttons",{Button(v){Button=v}},6);let Dialog;module.link("../dialog/dialog",{Dialog(v){Dialog=v}},7);let Icon;module.link("../icon/icon",{Icon(v){Icon=v}},8);/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */









var Alert = /** @class */ (function (_super) {
    tslib_1.__extends(Alert, _super);
    function Alert() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleCancel = function (evt) { return _this.internalHandleCallbacks(false, evt); };
        _this.handleConfirm = function (evt) { return _this.internalHandleCallbacks(true, evt); };
        return _this;
    }
    Alert.prototype.render = function () {
        var _a = this.props, canEscapeKeyCancel = _a.canEscapeKeyCancel, canOutsideClickCancel = _a.canOutsideClickCancel, children = _a.children, className = _a.className, icon = _a.icon, intent = _a.intent, cancelButtonText = _a.cancelButtonText, confirmButtonText = _a.confirmButtonText, onClose = _a.onClose, overlayProps = tslib_1.__rest(_a, ["canEscapeKeyCancel", "canOutsideClickCancel", "children", "className", "icon", "intent", "cancelButtonText", "confirmButtonText", "onClose"]);
        return (React.createElement(Dialog, tslib_1.__assign({}, overlayProps, { className: classNames(Classes.ALERT, className), canEscapeKeyClose: canEscapeKeyCancel, canOutsideClickClose: canOutsideClickCancel, onClose: this.handleCancel }),
            React.createElement("div", { className: Classes.ALERT_BODY },
                React.createElement(Icon, { icon: icon, iconSize: 40, intent: intent }),
                React.createElement("div", { className: Classes.ALERT_CONTENTS }, children)),
            React.createElement("div", { className: Classes.ALERT_FOOTER },
                React.createElement(Button, { intent: intent, text: confirmButtonText, onClick: this.handleConfirm }),
                cancelButtonText && React.createElement(Button, { text: cancelButtonText, onClick: this.handleCancel }))));
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
        var _a = this.props, onCancel = _a.onCancel, onClose = _a.onClose, onConfirm = _a.onConfirm;
        safeInvoke(confirmed ? onConfirm : onCancel, evt);
        safeInvoke(onClose, confirmed, evt);
    };
    Alert.defaultProps = {
        canEscapeKeyCancel: false,
        canOutsideClickCancel: false,
        confirmButtonText: "OK",
        isOpen: false,
    };
    Alert.displayName = DISPLAYNAME_PREFIX + ".Alert";
    return Alert;
}(AbstractPureComponent));

//# sourceMappingURL=alert.js.map