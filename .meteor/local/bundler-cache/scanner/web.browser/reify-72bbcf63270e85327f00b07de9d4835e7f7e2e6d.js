module.export({DrawerSize:()=>DrawerSize,Drawer:()=>Drawer});let __assign,__extends;module.link("tslib",{__assign(v){__assign=v},__extends(v){__extends=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let AbstractPureComponent2,Classes;module.link("../../common",{AbstractPureComponent2(v){AbstractPureComponent2=v},Classes(v){Classes=v}},3);let Errors;module.link("../../common/errors",{"*"(v){Errors=v}},4);let getPositionIgnoreAngles,isPositionHorizontal;module.link("../../common/position",{getPositionIgnoreAngles(v){getPositionIgnoreAngles=v},isPositionHorizontal(v){isPositionHorizontal=v}},5);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},6);let Button;module.link("../button/buttons",{Button(v){Button=v}},7);let H4;module.link("../html/html",{H4(v){H4=v}},8);let Icon,IconSize;module.link("../icon/icon",{Icon(v){Icon=v},IconSize(v){IconSize=v}},9);let Overlay;module.link("../overlay/overlay",{Overlay(v){Overlay=v}},10);/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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











var DrawerSize;
(function (DrawerSize) {
    DrawerSize["SMALL"] = "360px";
    DrawerSize["STANDARD"] = "50%";
    DrawerSize["LARGE"] = "90%";
})(DrawerSize || (module.runSetters(DrawerSize = {})));
var Drawer = /** @class */ (function (_super) {
    __extends(Drawer, _super);
    function Drawer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Drawer.prototype.render = function () {
        var _a, _b;
        var _c;
        var _d = this.props, size = _d.size, style = _d.style, position = _d.position;
        var realPosition = getPositionIgnoreAngles(position);
        var classes = classNames(Classes.DRAWER, (_a = {},
            _a[(_c = Classes.positionClass(realPosition)) !== null && _c !== void 0 ? _c : ""] = true,
            _a), this.props.className);
        var styleProp = size == null
            ? style
            : __assign(__assign({}, style), (_b = {}, _b[isPositionHorizontal(realPosition) ? "height" : "width"] = size, _b));
        return (React.createElement(Overlay, __assign({}, this.props, { className: Classes.OVERLAY_CONTAINER }),
            React.createElement("div", { className: classes, style: styleProp },
                this.maybeRenderHeader(),
                this.props.children)));
    };
    Drawer.prototype.validateProps = function (props) {
        if (props.title == null) {
            if (props.icon != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_ICON);
            }
            if (props.isCloseButtonShown != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_CLOSE_BUTTON);
            }
        }
        if (props.position != null) {
            if (props.position !== getPositionIgnoreAngles(props.position)) {
                console.warn(Errors.DRAWER_ANGLE_POSITIONS_ARE_CASTED);
            }
        }
    };
    Drawer.prototype.maybeRenderCloseButton = function () {
        // `isCloseButtonShown` can't be defaulted through default props because of props validation
        // so this check actually defaults it to true (fails only if directly set to false)
        if (this.props.isCloseButtonShown !== false) {
            return (React.createElement(Button, { "aria-label": "Close", className: Classes.DIALOG_CLOSE_BUTTON, icon: React.createElement(Icon, { icon: "small-cross", size: IconSize.LARGE }), minimal: true, onClick: this.props.onClose }));
        }
        else {
            return null;
        }
    };
    Drawer.prototype.maybeRenderHeader = function () {
        var _a = this.props, icon = _a.icon, title = _a.title;
        if (title == null) {
            return null;
        }
        return (React.createElement("div", { className: Classes.DRAWER_HEADER },
            React.createElement(Icon, { icon: icon, size: IconSize.LARGE }),
            React.createElement(H4, null, title),
            this.maybeRenderCloseButton()));
    };
    Drawer.displayName = "".concat(DISPLAYNAME_PREFIX, ".Drawer");
    Drawer.defaultProps = {
        canOutsideClickClose: true,
        isOpen: false,
        position: "right",
        style: {},
    };
    return Drawer;
}(AbstractPureComponent2));

//# sourceMappingURL=drawer.js.map